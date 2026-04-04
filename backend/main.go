package main

import (
	"log"
	"os"

	"smart-inventory-backend/controllers"
	"smart-inventory-backend/database"
	"smart-inventory-backend/repositories"
	"smart-inventory-backend/routes"
	"smart-inventory-backend/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// @title Smart Inventory API
// @version 1.0
// @description Premium Core System for Warehouse and Inventory Management.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /api/v1

func main() {
	_ = godotenv.Load()

	// Database Connection
	database.Connect()

	// Dependency Injection
	itemRepo := repositories.NewItemRepository(database.DB)
	itemService := services.NewItemService(itemRepo)
	itemController := controllers.NewItemController(itemService)

	transactionRepo := repositories.NewTransactionRepository(database.DB)
	transactionService := services.NewTransactionService(transactionRepo, itemRepo, database.DB)
	transactionController := controllers.NewTransactionController(transactionService)

	// Router Setup
	r := gin.Default()

	// CORS Setup
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Length"},
		AllowCredentials: true,
	}))

	// Setup Routes
	routes.SetupRoutes(r, itemController, transactionController)

	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	r.Run(":" + port)
}
