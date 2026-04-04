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

// GetTransactions godoc
// @Summary List transactions
// @Description Retrieve a filtered list of all stock movements (IN/OUT) and their statuses.
// @Tags transactions
// @Accept  json
// @Produce  json
// @Param   type     query    string  false  "Transaction type (STOCK_IN, STOCK_OUT)"
// @Param   status   query    string  false  "Transaction status (CREATED, DRAFT, IN_PROGRESS, DONE, CANCELLED)"
// @Success 200 {array} models.Transaction
// @Failure 500 {object} map[string]string
// @Router /transactions [get]
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

// CreateStockIn godoc
// @Summary Create Stock In
// @Description Create a new incoming stock transaction. This increases available and physical stock upon completion.
// @Tags transactions
// @Accept  json
// @Produce  json
// @Param   request     body    object     true  "Stock In Request (item_id, quantity, reference_id, notes)"
// @Success 201 {object} models.Transaction
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /transactions/stock-in [post]
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

// CreateStockOut godoc
// @Summary Create Stock Out
// @Description Create a new outgoing stock transaction. This reserves available stock immediately.
// @Tags transactions
// @Accept  json
// @Produce  json
// @Param   request     body    object     true  "Stock Out Request (item_id, quantity, reference_id, notes)"
// @Success 201 {object} models.Transaction
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /transactions/stock-out [post]
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

// UpdateStatus godoc
// @Summary Update transaction status
// @Description Change the status of an existing transaction (e.g., from DRAFT to DONE). Triggers inventory balancing.
// @Tags transactions
// @Accept  json
// @Produce  json
// @Param   id     path    int     true  "Transaction ID"
// @Param   request     body    object     true  "Status Update Request (status, notes)"
// @Success 200 {object} models.Transaction
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /transactions/{id}/status [put]
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
