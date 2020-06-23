package controllers

import (
	"log"
	"net/http"

	"github.com/alanqchen/Bear-Post/backend/app"
)

type ErrorController struct {
	*app.App
}

func NewErrorController(a *app.App) *ErrorController {
	return &ErrorController{a}
}

func (ec *ErrorController) NotFound(w http.ResponseWriter, r *http.Request) {
	log.Println("[WARN] No matching routes")
	NewAPIError(&APIError{false, "Invalid route", http.StatusNotFound}, w)
	return
}
