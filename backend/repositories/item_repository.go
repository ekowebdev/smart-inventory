package repositories

import (
	"smart-inventory-backend/models"

	"gorm.io/gorm"
)

type ItemRepository interface {
	GetAll(filter string) ([]models.Item, error)
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

func (r *itemRepository) GetAll(filter string) ([]models.Item, error) {
	var items []models.Item
	query := r.db
	if filter != "" {
		query = query.Where("name ILIKE ? OR sku ILIKE ? OR category ILIKE ?", "%"+filter+"%", "%"+filter+"%", "%"+filter+"%")
	}
	err := query.Find(&items).Error
	return items, err
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
	err := r.db.Model(&existingItem).Updates(item).Error
	return existingItem, err
}

func (r *itemRepository) Delete(id uint) error {
	return r.db.Delete(&models.Item{}, id).Error
}
