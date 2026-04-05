package services

import (
	"math"
	"strconv"

	"smart-inventory-backend/models"
	"smart-inventory-backend/repositories"
)

type ItemService interface {
	GetAllItems(filter string, page string, limit string) (map[string]interface{}, error)
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

func (s *itemService) GetAllItems(filter string, page string, limit string) (map[string]interface{}, error) {
	p, _ := strconv.Atoi(page)
	if p <= 0 {
		p = 1
	}

	l, _ := strconv.Atoi(limit)
	if l <= 0 {
		l = 10
	}
	if l > 100 {
		l = 100
	}

	items, totalRecords, err := s.repo.GetAll(filter, p, l)
	if err != nil {
		return nil, err
	}

	totalPages := int(math.Ceil(float64(totalRecords) / float64(l)))

	return map[string]interface{}{
		"data": items,
		"meta": map[string]interface{}{
			"current_page":  p,
			"limit":         l,
			"total_records": totalRecords,
			"total_pages":   totalPages,
		},
	}, nil
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
