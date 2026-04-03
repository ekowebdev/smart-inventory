package models

import (
	"time"

	"gorm.io/gorm"
)

type Item struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
	Name           string         `gorm:"type:varchar(100);not null" json:"name"`
	SKU            string         `gorm:"type:varchar(50);unique;not null" json:"sku"`
	Description    string         `gorm:"type:text" json:"description"`
	PhysicalStock  int            `gorm:"default:0" json:"physical_stock"`
	AvailableStock int            `gorm:"default:0" json:"available_stock"`
	Category       string         `gorm:"type:varchar(50)" json:"category"`
	Price          float64        `gorm:"type:decimal(10,2)" json:"price"`
}
