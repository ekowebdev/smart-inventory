package dto

// MetaData represents pagination metadata
type MetaData struct {
	CurrentPage  int   `json:"current_page" example:"1"`
	Limit        int   `json:"limit" example:"5"`
	TotalRecords int64 `json:"total_records" example:"100"`
	TotalPages   int   `json:"total_pages" example:"20"`
}

// ErrorDetail represents standardized error object
type ErrorDetail struct {
	Code    string      `json:"code" example:"INVALID_INPUT"`
	Message string      `json:"message" example:"Validation failed"`
	Details interface{} `json:"details,omitempty"`
}

// SuccessResponse represents a standard success response wrapper
type SuccessResponse struct {
	Status string      `json:"status" example:"success"`
	Data   interface{} `json:"data"`
}

// PaginatedResponse represents a standard success response with pagination
type PaginatedResponse struct {
	Status string      `json:"status" example:"success"`
	Data   interface{} `json:"data"`
	Meta   MetaData    `json:"meta"`
}

// ErrorResponse represents a standard error response wrapper
type ErrorResponse struct {
	Status string      `json:"status" example:"error"`
	Error  ErrorDetail `json:"error"`
}
