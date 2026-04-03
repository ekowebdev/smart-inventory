package database

import (
	"fmt"
	"log"
	"os"
	"smart-inventory-backend/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Connect() {
	_ = godotenv.Load()

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	fmt.Println("Database Connected Successfully")

	// Automigrate
	db.AutoMigrate(&models.Item{}, &models.Transaction{}, &models.TransactionLog{})

	// Seed Initial Data if table is empty
	seedData(db)

	DB = db
}

func seedData(db *gorm.DB) {
	var count int64
	db.Model(&models.Item{}).Count(&count)

	if count == 0 {
		initialItems := []models.Item{
			{Name: "MacBook Pro M2 14-inch", SKU: "LAP-001", Category: "Electronics", Description: "Space Gray, 16GB RAM, 512GB SSD", Price: 1999.00, PhysicalStock: 15, AvailableStock: 15},
			{Name: "iPhone 15 Pro Max", SKU: "PHN-001", Category: "Electronics", Description: "Natural Titanium, 256GB", Price: 1199.00, PhysicalStock: 25, AvailableStock: 25},
			{Name: "iPad Air M1", SKU: "TAB-001", Category: "Electronics", Description: "Starlight, 64GB, Wi-Fi", Price: 599.00, PhysicalStock: 10, AvailableStock: 10},
			{Name: "Sony WH-1000XM5", SKU: "AUD-001", Category: "Accessories", Description: "Industry Leading Noise Canceling Headphones", Price: 349.00, PhysicalStock: 30, AvailableStock: 30},
			{Name: "Monitor Dell UltraSharp 27", SKU: "MON-001", Category: "Peripheral", Description: "4K USB-C Hub Monitor - U2723QE", Price: 729.00, PhysicalStock: 12, AvailableStock: 12},
		}

		for _, item := range initialItems {
			db.Create(&item)
		}
		fmt.Println("Initial items seeded successfully")
	}
}
