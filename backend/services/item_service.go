package services

import (
	"smart-inventory-backend/models"
	"smart-inventory-backend/repositories"
)

type ItemService interface {
	GetAllItems(filter string) ([]models.Item, error)
	GetItemByID(id uint) (models.Item, error)
	CreateItem(item models.Item) (models.Item, error)
	UpdateItem(id uint, item models.Item) (models.Item, error)
	DeleteItem(id uint) error
}

type itemService struct {
	repo repositories.ItemRepository
}

func NewItemService(repo repositories.ItemRepository) ItemService {
	return &itemService{repo}
}

func (s *itemService) GetAllItems(filter string) ([]models.Item, error) {
	return s.repo.GetAll(filter)
}

func (s *itemService) GetItemByID(id uint) (models.Item, error) {
	return s.repo.GetByID(id)
}

func (s *itemService) CreateItem(item models.Item) (models.Item, error) {
	// Add business validation here if needed
	return s.repo.Create(item)
}

func (s *itemService) UpdateItem(id uint, item models.Item) (models.Item, error) {
	return s.repo.Update(id, item)
}

func (s *itemService) DeleteItem(id uint) error {
	return s.repo.Delete(id)
}
