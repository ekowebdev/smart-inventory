package models

import (
	"time"

	"gorm.io/gorm"
)

type TransactionType string
type TransactionStatus string

const (
	STOCK_IN  TransactionType = "STOCK_IN"
	STOCK_OUT TransactionType = "STOCK_OUT"

	STATUS_CREATED     TransactionStatus = "CREATED"
	STATUS_DRAFT       TransactionStatus = "DRAFT"
	STATUS_IN_PROGRESS TransactionStatus = "IN_PROGRESS"
	STATUS_DONE        TransactionStatus = "DONE"
	STATUS_CANCELLED   TransactionStatus = "CANCELLED"
)

type Transaction struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
	Type        TransactionType   `gorm:"type:varchar(20);not null" json:"type"`
	Status      TransactionStatus `gorm:"type:varchar(20);not null" json:"status"`
	ItemID      uint           `json:"item_id"`
	Item        Item           `gorm:"foreignKey:ItemID" json:"item"`
	Quantity    int            `gorm:"not null" json:"quantity"`
	ReferenceID string         `gorm:"type:varchar(100)" json:"reference_id"` // Customer or Supplier Name
	Notes       string         `gorm:"type:text" json:"notes"`
}
