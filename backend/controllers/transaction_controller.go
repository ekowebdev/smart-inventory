package controllers

import (
	"net/http"
	"strconv"

	"smart-inventory-backend/models"
	"smart-inventory-backend/services"

	"github.com/gin-gonic/gin"
)

type TransactionController struct {
	service services.TransactionService
}

func NewTransactionController(service services.TransactionService) *TransactionController {
	return &TransactionController{service}
}

func (c *TransactionController) GetTransactions(ctx *gin.Context) {
	txType := ctx.Query("type")
	status := ctx.Query("status")
	transactions, err := c.service.GetTransactions(txType, status)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, transactions)
}

func (c *TransactionController) CreateStockIn(ctx *gin.Context) {
	var req struct {
		ItemID      uint   `json:"item_id" binding:"required"`
		Quantity    int    `json:"quantity" binding:"required,gt=0"`
		ReferenceID string `json:"reference_id"`
		Notes       string `json:"notes"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx, err := c.service.CreateStockIn(req.ItemID, req.Quantity, req.ReferenceID, req.Notes)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, tx)
}

func (c *TransactionController) CreateStockOut(ctx *gin.Context) {
	var req struct {
		ItemID      uint   `json:"item_id" binding:"required"`
		Quantity    int    `json:"quantity" binding:"required,gt=0"`
		ReferenceID string `json:"reference_id"`
		Notes       string `json:"notes"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx, err := c.service.CreateStockOut(req.ItemID, req.Quantity, req.ReferenceID, req.Notes)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, tx)
}

func (c *TransactionController) UpdateStatus(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var req struct {
		Status models.TransactionStatus `json:"status" binding:"required"`
		Notes  string                   `json:"notes"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx, err := c.service.UpdateStatus(uint(id), req.Status, req.Notes)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, tx)
}
