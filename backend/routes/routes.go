package routes

import (
	"net/http"
	"smart-inventory-backend/controllers"
	_ "smart-inventory-backend/docs"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupRoutes(r *gin.Engine, itemController *controllers.ItemController, transactionController *controllers.TransactionController) {
	// API v1 Group
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

	// Swagger Route
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
}
