package database

import (
	"fmt"
	"log"
	"os"
	"smart-inventory-backend/database/seeder"
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

	// Seed Initial Data (Idempotent)
	seeder.Seed(db)

	DB = db
}

