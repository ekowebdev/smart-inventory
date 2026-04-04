package controllers

import (
	"net/http"
	"strconv"

	"smart-inventory-backend/models"
	"smart-inventory-backend/services"

	"github.com/gin-gonic/gin"
)

type ItemController struct {
	service services.ItemService
}

func NewItemController(service services.ItemService) *ItemController {
	return &ItemController{service}
}

// GetAll godoc
// @Summary List all items
// @Description Get a list of all inventory items with optional filtering.
// @Tags items
// @Accept  json
// @Produce  json
// @Param   filter     query    string  false  "Item filter (name, sku, category)"
// @Success 200 {array} models.Item
// @Failure 500 {object} map[string]string
// @Router /items [get]
func (c *ItemController) GetAll(ctx *gin.Context) {
	filter := ctx.Query("filter")
	items, err := c.service.GetAllItems(filter)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, items)
}

// GetByID godoc
// @Summary Get item by ID
// @Description Retrieve details of a single inventory item by its numeric ID.
// @Tags items
// @Accept  json
// @Produce  json
// @Param   id     path    int     true  "Item ID"
// @Success 200 {object} models.Item
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /items/{id} [get]
func (c *ItemController) GetByID(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	item, err := c.service.GetItemByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}
	ctx.JSON(http.StatusOK, item)
}

// Create godoc
// @Summary Create new item
// @Description Add a new SKU to the inventory assets.
// @Tags items
// @Accept  json
// @Produce  json
// @Param   item     body    models.Item     true  "Item Object"
// @Success 201 {object} models.Item
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /items [post]
func (c *ItemController) Create(ctx *gin.Context) {
	var item models.Item
	if err := ctx.ShouldBindJSON(&item); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	newItem, err := c.service.CreateItem(item)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, newItem)
}

// Update godoc
// @Summary Update item
// @Description Modify an existing inventory item's details.
// @Tags items
// @Accept  json
// @Produce  json
// @Param   id     path    int     true  "Item ID"
// @Param   item     body    models.Item     true  "Item Object"
// @Success 200 {object} models.Item
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /items/{id} [put]
func (c *ItemController) Update(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	var item models.Item
	if err := ctx.ShouldBindJSON(&item); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	updatedItem, err := c.service.UpdateItem(uint(id), item)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, updatedItem)
}

// Delete godoc
// @Summary Delete item
// @Description Permantently remove an inventory item asset.
// @Tags items
// @Accept  json
// @Produce  json
// @Param   id     path    int     true  "Item ID"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /items/{id} [delete]
func (c *ItemController) Delete(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	if err := c.service.DeleteItem(uint(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Item deleted"})
}
