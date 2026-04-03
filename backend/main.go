package main

import (
	"log"
	"net/http"
	"os"

	"smart-inventory-backend/controllers"
	"smart-inventory-backend/database"
	"smart-inventory-backend/repositories"
	"smart-inventory-backend/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

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

	// Routes
	v1 := r.Group("/api/v1")
	{
		// Inventory Items
		items := v1.Group("/items")
		{
			items.GET("", itemController.GetAll)
			items.GET("/:id", itemController.GetByID)
			items.POST("", itemController.Create)
			items.PUT("/:id", itemController.Update)
			items.DELETE("/:id", itemController.Delete)
		}

		// Transactions (Stock In / Stock Out)
		tx := v1.Group("/transactions")
		{
			tx.GET("", transactionController.GetTransactions)
			tx.POST("/stock-in", transactionController.CreateStockIn)
			tx.POST("/stock-out", transactionController.CreateStockOut)
			tx.PUT("/:id/status", transactionController.UpdateStatus)
		}
	}

	// Root Route
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Smart Inventory API v1 (Transactional)"})
	})

	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	r.Run(":" + port)
}
