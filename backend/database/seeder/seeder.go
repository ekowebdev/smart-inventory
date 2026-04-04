package seeder

import (
	"log"

	"gorm.io/gorm"
)

func Seed(db *gorm.DB) {
	log.Println("Database Seeding Started...")

	if err := SeedItems(db); err != nil {
		log.Printf("Error seeding items: %v", err)
	}

	// Add more seeders here as needed (e.g., Transactions)
	
	log.Println("Database Seeding Completed.")
}
