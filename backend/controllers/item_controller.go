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
// @Description Get a list of all inventory items with optional filtering and pagination.
// @Tags items
// @Accept  json
// @Produce  json
// @Param   filter     query    string  false  "Item filter (name, sku, category)"
// @Param   page       query    int     false  "Page number"
// @Param   limit      query    int     false  "Items per page"
// @Success 200 {object} models.PaginatedResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /items [get]
func (c *ItemController) GetAll(ctx *gin.Context) {
	filter := ctx.Query("filter")
	page := ctx.Query("page")
	limit := ctx.Query("limit")

	result, err := c.service.GetAllItems(filter, page, limit)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"error": gin.H{
				"code":    "INTERNAL_SERVER_ERROR",
				"message": err.Error(),
			},
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   result["data"],
		"meta":   result["meta"],
	})
}

// GetByID godoc
// @Summary Get item by ID
// @Description Retrieve details of a single inventory item by its numeric ID.
// @Tags items
// @Accept  json
// @Produce  json
// @Param   id     path    int     true  "Item ID"
// @Success 200 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Router /items/{id} [get]
func (c *ItemController) GetByID(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status": "error",
			"error": gin.H{
				"code":    "INVALID_ID",
				"message": "Invalid ID format",
			},
		})
		return
	}
	item, err := c.service.GetItemByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status": "error",
			"error": gin.H{
				"code":    "NOT_FOUND",
				"message": "Item not found",
			},
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   item,
	})
}

// Create godoc
// @Summary Create new item
// @Description Add a new SKU to the inventory assets.
// @Tags items
// @Accept  json
// @Produce  json
// @Param   item     body    models.Item     true  "Item Object"
// @Success 201 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /items [post]
func (c *ItemController) Create(ctx *gin.Context) {
	var item models.Item
	if err := ctx.ShouldBindJSON(&item); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status": "error",
			"error": gin.H{
				"code":    "INVALID_INPUT",
				"message": err.Error(),
			},
		})
		return
	}
	newItem, err := c.service.CreateItem(item)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"error": gin.H{
				"code":    "INTERNAL_SERVER_ERROR",
				"message": err.Error(),
			},
		})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   newItem,
	})
}

// Update godoc
// @Summary Update item
// @Description Modify an existing inventory item's details.
// @Tags items
// @Accept  json
// @Produce  json
// @Param   id     path    int     true  "Item ID"
// @Param   item     body    models.Item     true  "Item Object"
// @Success 200 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /items/{id} [put]
func (c *ItemController) Update(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status": "error",
			"error": gin.H{
				"code":    "INVALID_ID",
				"message": "Invalid ID format",
			},
		})
		return
	}
	var item models.Item
	if err := ctx.ShouldBindJSON(&item); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status": "error",
			"error": gin.H{
				"code":    "INVALID_INPUT",
				"message": err.Error(),
			},
		})
		return
	}
	updatedItem, err := c.service.UpdateItem(uint(id), item)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"error": gin.H{
				"code":    "INTERNAL_SERVER_ERROR",
				"message": err.Error(),
			},
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   updatedItem,
	})
}

// Delete godoc
// @Summary Delete item
// @Description Permantently remove an inventory item asset.
// @Tags items
// @Accept  json
// @Produce  json
// @Param   id     path    int     true  "Item ID"
// @Success 200 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /items/{id} [delete]
func (c *ItemController) Delete(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status": "error",
			"error": gin.H{
				"code":    "INVALID_ID",
				"message": "Invalid ID format",
			},
		})
		return
	}
	if err := c.service.DeleteItem(uint(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status": "error",
			"error": gin.H{
				"code":    "INTERNAL_SERVER_ERROR",
				"message": err.Error(),
			},
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Item deleted",
	})
}
