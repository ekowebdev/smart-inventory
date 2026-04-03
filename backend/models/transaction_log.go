package models

import (
	"time"
)

type TransactionLog struct {
	ID            uint              `gorm:"primaryKey" json:"id"`
	CreatedAt     time.Time         `json:"created_at"`
	TransactionID uint              `json:"transaction_id"`
	FromStatus    TransactionStatus `gorm:"type:varchar(20)" json:"from_status"`
	ToStatus      TransactionStatus `gorm:"type:varchar(20)" json:"to_status"`
	Notes         string            `gorm:"type:text" json:"notes"`
}
