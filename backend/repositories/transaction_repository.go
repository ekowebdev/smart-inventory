package repositories

import (
	"smart-inventory-backend/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	GetAll(txType string, status string) ([]models.Transaction, error)
	GetByID(id uint) (models.Transaction, error)
	Create(transaction models.Transaction) (models.Transaction, error)
	UpdateStatus(id uint, status models.TransactionStatus) (models.Transaction, error)
	CreateLog(log models.TransactionLog) error
}

type transactionRepository struct {
	db *gorm.DB
}

func NewTransactionRepository(db *gorm.DB) TransactionRepository {
	return &transactionRepository{db}
}

func (r *transactionRepository) GetAll(txType string, status string) ([]models.Transaction, error) {
	var transactions []models.Transaction
	query := r.db.Preload("Item")
	if txType != "" {
		query = query.Where("type = ?", txType)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}
	err := query.Find(&transactions).Error
	return transactions, err
}

func (r *transactionRepository) GetByID(id uint) (models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.Preload("Item").First(&transaction, id).Error
	return transaction, err
}

func (r *transactionRepository) Create(transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Create(&transaction).Error
	return transaction, err
}

func (r *transactionRepository) UpdateStatus(id uint, status models.TransactionStatus) (models.Transaction, error) {
	var transaction models.Transaction
	if err := r.db.First(&transaction, id).Error; err != nil {
		return transaction, err
	}
	transaction.Status = status
	err := r.db.Save(&transaction).Error
	return transaction, err
}

func (r *transactionRepository) CreateLog(log models.TransactionLog) error {
	return r.db.Create(&log).Error
}
