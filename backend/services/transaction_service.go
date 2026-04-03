package services

import (
	"errors"
	"smart-inventory-backend/models"
	"smart-inventory-backend/repositories"

	"gorm.io/gorm"
)

type TransactionService interface {
	CreateStockIn(itemID uint, qty int, refID string, notes string) (models.Transaction, error)
	CreateStockOut(itemID uint, qty int, refID string, notes string) (models.Transaction, error)
	UpdateStatus(id uint, newStatus models.TransactionStatus, notes string) (models.Transaction, error)
	GetTransactions(txType string, status string) ([]models.Transaction, error)
}

type transactionService struct {
	repo     repositories.TransactionRepository
	itemRepo repositories.ItemRepository
	db       *gorm.DB
}

func NewTransactionService(repo repositories.TransactionRepository, itemRepo repositories.ItemRepository, db *gorm.DB) TransactionService {
	return &transactionService{repo, itemRepo, db}
}

func (s *transactionService) CreateStockIn(itemID uint, qty int, refID string, notes string) (models.Transaction, error) {
	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	transaction := models.Transaction{
		Type:        models.STOCK_IN,
		Status:      models.STATUS_CREATED,
		ItemID:      itemID,
		Quantity:    qty,
		ReferenceID: refID,
		Notes:       notes,
	}

	newTx, err := s.repo.Create(transaction)
	if err != nil {
		tx.Rollback()
		return models.Transaction{}, err
	}

	log := models.TransactionLog{
		TransactionID: newTx.ID,
		FromStatus:    "",
		ToStatus:      models.STATUS_CREATED,
		Notes:         "Initial created stock in",
	}
	s.repo.CreateLog(log)

	return newTx, tx.Commit().Error
}

func (s *transactionService) CreateStockOut(itemID uint, qty int, refID string, notes string) (models.Transaction, error) {
	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Stage 1: Allocation
	item, err := s.itemRepo.GetByID(itemID)
	if err != nil {
		tx.Rollback()
		return models.Transaction{}, err
	}

	if item.AvailableStock < qty {
		tx.Rollback()
		return models.Transaction{}, errors.New("insufficient available stock")
	}

	// Reserve Available Stock
	item.AvailableStock -= qty
	if _, err := s.itemRepo.Update(itemID, item); err != nil {
		tx.Rollback()
		return models.Transaction{}, err
	}

	transaction := models.Transaction{
		Type:        models.STOCK_OUT,
		Status:      models.STATUS_DRAFT,
		ItemID:      itemID,
		Quantity:    qty,
		ReferenceID: refID,
		Notes:       notes,
	}

	newTx, err := s.repo.Create(transaction)
	if err != nil {
		tx.Rollback()
		return models.Transaction{}, err
	}

	log := models.TransactionLog{
		TransactionID: newTx.ID,
		FromStatus:    "",
		ToStatus:      models.STATUS_DRAFT,
		Notes:         "Allocated stock for stock out",
	}
	s.repo.CreateLog(log)

	return newTx, tx.Commit().Error
}

func (s *transactionService) UpdateStatus(id uint, newStatus models.TransactionStatus, notes string) (models.Transaction, error) {
	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	transaction, err := s.repo.GetByID(id)
	if err != nil {
		tx.Rollback()
		return models.Transaction{}, err
	}

	oldStatus := transaction.Status

	// Business Logic for Transitions
	if transaction.Type == models.STOCK_IN {
		if oldStatus == models.STATUS_DONE {
			tx.Rollback()
			return models.Transaction{}, errors.New("cannot change status of completed stock in")
		}
		if newStatus == models.STATUS_DONE {
			// Finalize Stock In: Update Physical and Available Stock
			item, _ := s.itemRepo.GetByID(transaction.ItemID)
			item.PhysicalStock += transaction.Quantity
			item.AvailableStock += transaction.Quantity
			s.itemRepo.Update(item.ID, item)
		}
	} else if transaction.Type == models.STOCK_OUT {
		if oldStatus == models.STATUS_DONE {
			tx.Rollback()
			return models.Transaction{}, errors.New("cannot change status of completed stock out")
		}

		if newStatus == models.STATUS_DONE {
			// Finalize Stock Out: Update Physical Stock
			item, _ := s.itemRepo.GetByID(transaction.ItemID)
			item.PhysicalStock -= transaction.Quantity
			s.itemRepo.Update(item.ID, item)
		}

		if newStatus == models.STATUS_CANCELLED {
			// Rollback: Return to Available Stock
			if oldStatus == models.STATUS_DRAFT || oldStatus == models.STATUS_IN_PROGRESS {
				item, _ := s.itemRepo.GetByID(transaction.ItemID)
				item.AvailableStock += transaction.Quantity
				s.itemRepo.Update(item.ID, item)
			}
		}
	}

	updatedTx, err := s.repo.UpdateStatus(id, newStatus)
	if err != nil {
		tx.Rollback()
		return models.Transaction{}, err
	}

	log := models.TransactionLog{
		TransactionID: updatedTx.ID,
		FromStatus:    oldStatus,
		ToStatus:      newStatus,
		Notes:         notes,
	}
	s.repo.CreateLog(log)

	return updatedTx, tx.Commit().Error
}

func (s *transactionService) GetTransactions(txType string, status string) ([]models.Transaction, error) {
	return s.repo.GetAll(txType, status)
}
