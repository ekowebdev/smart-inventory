package repositories

import (
	"smart-inventory-backend/models"

	"gorm.io/gorm"
)

type ItemRepository interface {
	WithTx(tx *gorm.DB) ItemRepository
	GetAll(filter string, page int, limit int) ([]models.Item, int64, error)
	GetByID(id uint) (models.Item, error)
	Create(item models.Item) (models.Item, error)
	Update(id uint, item models.Item) (models.Item, error)
	Delete(id uint) error
}

type itemRepository struct {
	db *gorm.DB
}

func NewItemRepository(db *gorm.DB) ItemRepository {
	return &itemRepository{db}
}

func (r *itemRepository) WithTx(tx *gorm.DB) ItemRepository {
	return &itemRepository{db: tx}
}

func (r *itemRepository) GetAll(filter string, page int, limit int) ([]models.Item, int64, error) {
	var items []models.Item
	var totalRecords int64

	query := r.db.Model(&models.Item{})
	if filter != "" {
		// Filter by Name, SKU, Category, OR Customer/Reference from Transactions
		query = query.Where("items.name ILIKE ? OR items.sku ILIKE ? OR items.category ILIKE ? OR items.id IN (SELECT item_id FROM transactions WHERE reference_id ILIKE ?)", 
			"%"+filter+"%", "%"+filter+"%", "%"+filter+"%", "%"+filter+"%")
	}

	// Get total records first
	if err := query.Count(&totalRecords).Error; err != nil {
		return nil, 0, err
	}

	// Apply pagination
	offset := (page - 1) * limit
	err := query.Order("items.created_at DESC").Limit(limit).Offset(offset).Find(&items).Error

	return items, totalRecords, err
}

func (r *itemRepository) GetByID(id uint) (models.Item, error) {
	var item models.Item
	err := r.db.First(&item, id).Error
	return item, err
}

func (r *itemRepository) Create(item models.Item) (models.Item, error) {
	err := r.db.Create(&item).Error
	return item, err
}

func (r *itemRepository) Update(id uint, item models.Item) (models.Item, error) {
	var existingItem models.Item
	if err := r.db.First(&existingItem, id).Error; err != nil {
		return existingItem, err
	}
	err := r.db.Model(&existingItem).Omit("sku").Updates(item).Error
	return existingItem, err
}

func (r *itemRepository) Delete(id uint) error {
	return r.db.Delete(&models.Item{}, id).Error
}
