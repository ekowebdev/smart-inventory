package seeder

import (
	"fmt"
	"smart-inventory-backend/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

func SeedItems(db *gorm.DB) error {
	initialItems := []models.Item{
		{Name: "MacBook Pro M2 14-inch", SKU: "LAP-001", Category: "Electronics", Description: "Space Gray, 16GB RAM, 512GB SSD", Price: 1999.00, PhysicalStock: 15, AvailableStock: 15},
		{Name: "iPhone 15 Pro Max", SKU: "PHN-001", Category: "Electronics", Description: "Natural Titanium, 256GB", Price: 1199.00, PhysicalStock: 25, AvailableStock: 25},
		{Name: "iPad Air M1", SKU: "TAB-001", Category: "Electronics", Description: "Starlight, 64GB, Wi-Fi", Price: 599.00, PhysicalStock: 10, AvailableStock: 10},
		{Name: "Sony WH-1000XM5", SKU: "AUD-001", Category: "Accessories", Description: "Industry Leading Noise Canceling Headphones", Price: 349.00, PhysicalStock: 30, AvailableStock: 30},
		{Name: "Monitor Dell UltraSharp 27", SKU: "MON-001", Category: "Peripheral", Description: "4K USB-C Hub Monitor - U2723QE", Price: 729.00, PhysicalStock: 12, AvailableStock: 12},
	}

	// Idempotent seeding: Do nothing on conflict (SKU is unique)
	err := db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "sku"}},
		DoNothing: true,
	}).Create(&initialItems).Error

	if err != nil {
		return err
	}

	fmt.Println("Initial item seeding completed (Idempotent)")
	return nil
}
