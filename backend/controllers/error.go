package controllers

import (
	"log"
	"net/http"

	"github.com/alanqchen/Bear-Post/backend/app"
)

// ErrorController store the App config
type ErrorController struct {
	*app.App
}

// NewErrorController returns a new ErrorController struct
func NewErrorController(a *app.App) *ErrorController {
	return &ErrorController{a}
}

// NotFound returns a not found error
func (ec *ErrorController) NotFound(w http.ResponseWriter, r *http.Request) {
	log.Println("[WARN] No matching routes")
	NewAPIError(&APIError{false, "Invalid route", http.StatusNotFound}, w)
	return
}
