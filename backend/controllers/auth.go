package controllers

import (
	"log"
	"net/http"

	"github.com/alanqchen/Bear-Post/backend/app"
	"github.com/alanqchen/Bear-Post/backend/models"
	"github.com/alanqchen/Bear-Post/backend/repositories"
	"github.com/alanqchen/Bear-Post/backend/services"
)

// TODO repository, services
type AuthController struct {
	App *app.App
	repositories.UserRepository
	jwtService services.JWTAuthService
}

func NewAuthController(a *app.App, us repositories.UserRepository, jwtService services.JWTAuthService) *AuthController {
	return &AuthController{a, us, jwtService}
}

func (ac *AuthController) Authenticate(w http.ResponseWriter, r *http.Request) {
	j, err := GetJSON(r.Body)
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}
	username, err := j.GetString("username")
	if err != nil {
		NewAPIError(&APIError{false, "username is required", http.StatusBadRequest}, w)
		return
	}

	pw, err := j.GetString("password")
	if err != nil {
		NewAPIError(&APIError{false, "Password is required", http.StatusBadRequest}, w)
		return
	}

	/* NO LONGER REQUIRE A EMAIL
	if ok := util.IsEmail(email); !ok {
		NewAPIError(&APIError{false, "You must provide a valid email address", http.StatusBadRequest}, w)
		return
	}
	*/
	u, err := ac.UserRepository.FindByUsername(username)
	if err != nil {
		log.Println("[BAD LOGIN] - username:", username)
		NewAPIError(&APIError{false, "Incorrect email or password", http.StatusBadRequest}, w)
		return
	}

	if ok := u.CheckPassword(pw); !ok {
		log.Printf("[BAD LOGIN] - username: %v password %v", username, pw)
		NewAPIError(&APIError{false, "Incorrect email or password", http.StatusBadRequest}, w)
		return
	}

	tokens, err := ac.jwtService.GenerateTokens(u)
	if err != nil {
		NewAPIError(&APIError{false, "Something went wrong", http.StatusBadRequest}, w)
		return
	}

	authUser := &models.AuthUser{
		User:  u,
		Admin: u.Admin,
	}

	data := struct {
		Tokens *services.Tokens `json:"tokens"`
		User   *models.AuthUser `json:"user"`
	}{
		tokens,
		authUser,
	}

	log.Println("[LOGIN SUCCESS] - username:", username)
	NewAPIResponse(&APIResponse{Success: true, Message: "Login successful", Data: data}, w, http.StatusOK)
}

func (ac *AuthController) Logout(w http.ResponseWriter, r *http.Request) {
	tokenString, err := services.GetTokenFromRequest(&ac.App.Config, r)
	if err != nil {
		NewAPIError(&APIError{false, "Something went wrong", http.StatusBadRequest}, w)
		return
	}

	tokenHash, err := services.ExtractTokenHash(&ac.App.Config, tokenString)
	if err != nil {
		NewAPIError(&APIError{false, "Something went wrong", http.StatusBadRequest}, w)
		return
	}

	/*jti, err := services.ExtractJti(&ac.App.Config, tokenString)
	if err != nil {
		NewAPIError(&APIError{false, "Something went wrong", http.StatusBadRequest}, w)
		return
	}*/

	keys := ac.App.Redis.Keys("*" + tokenHash + ".*")
	for _, token := range keys.Val() {
		err := ac.App.Redis.Del(token).Err()
		if err != nil {
			log.Printf("Could not delete token: %s ; error: %v", token, err)
			NewAPIError(&APIError{false, "Something went wrong", http.StatusBadRequest}, w)
			return
		}
	}

	NewAPIResponse(&APIResponse{Success: true, Message: "Logout successful"}, w, http.StatusOK)

}

func (ac *AuthController) LogoutAll(w http.ResponseWriter, r *http.Request) {
	uid, err := services.UserIdFromContext(r.Context())
	if err != nil {
		NewAPIError(&APIError{false, "Something went wrong", http.StatusInternalServerError}, w)
		return
	}

	keys := ac.App.Redis.Keys("*." + uid + ".*")
	for _, token := range keys.Val() {
		err := ac.App.Redis.Del(token).Err()
		if err != nil {
			log.Printf("Could not delete token: %s ; error: %v", token, err)
		}
	}

	NewAPIResponse(&APIResponse{Success: true, Message: "Logout successful"}, w, http.StatusOK)
}

func (ac *AuthController) RefreshTokens(w http.ResponseWriter, r *http.Request) {
	tokenString, err := services.GetRefreshTokenFromRequest(&ac.App.Config, r)
	if err != nil {
		NewAPIError(&APIError{false, "Something went wrong", http.StatusInternalServerError}, w)
		return
	}
	uid, err := services.UserIdFromContext(r.Context())
	if err != nil {
		NewAPIError(&APIError{false, "Something went wrong", http.StatusInternalServerError}, w)
		return
	}
	tokenHash, err := services.ExtractRefreshTokenHash(&ac.App.Config, tokenString)
	if err != nil {
		NewAPIError(&APIError{false, "Something went wrong", http.StatusBadRequest}, w)
		return
	}
	u, err := ac.UserRepository.FindByID(uid)
	if err != nil {
		NewAPIError(&APIError{false, "Could not find user", http.StatusBadRequest}, w)
		return
	}
	tokens, err := ac.jwtService.GenerateTokens(u)
	if err != nil {
		NewAPIError(&APIError{false, "Something went wrong", http.StatusBadRequest}, w)
		return
	}

	keys := ac.App.Redis.Keys("*" + tokenHash + ".*")
	for _, token := range keys.Val() {
		err := ac.App.Redis.Del(token).Err()
		if err != nil {
			log.Printf("Could not delete token: %s ; error: %v", token, err)
			NewAPIError(&APIError{false, "Something went wrong", http.StatusBadRequest}, w)
			return
		}
	}
	log.Println("[AUTH] Created new refresh token for user", u.Username)
	NewAPIResponse(&APIResponse{Success: true, Message: "Refresh successful", Data: tokens}, w, http.StatusOK)
}
