package repositories

import (
	"smart-inventory-backend/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	WithTx(tx *gorm.DB) TransactionRepository
	GetAll(txType string, status string, page int, limit int) ([]models.Transaction, int64, error)
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

func (r *transactionRepository) WithTx(tx *gorm.DB) TransactionRepository {
	return &transactionRepository{db: tx}
}

func (r *transactionRepository) GetAll(txType string, status string, page int, limit int) ([]models.Transaction, int64, error) {
	var transactions []models.Transaction
	var totalRecords int64

	query := r.db.Preload("Item").Preload("Logs")
	if txType != "" {
		query = query.Where("type = ?", txType)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}

	// Get total records first
	if err := query.Model(&models.Transaction{}).Count(&totalRecords).Error; err != nil {
		return nil, 0, err
	}

	// Apply pagination
	offset := (page - 1) * limit
	err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&transactions).Error

	return transactions, totalRecords, err
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
