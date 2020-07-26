package controllers

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/alanqchen/Bear-Post/backend/app"
	"github.com/alanqchen/Bear-Post/backend/models"
	"github.com/alanqchen/Bear-Post/backend/repositories"
	"github.com/alanqchen/Bear-Post/backend/services"
	"github.com/alanqchen/Bear-Post/backend/util"
	"github.com/gofrs/uuid"
	"github.com/gorilla/mux"
)

type UserController struct {
	*app.App
	repositories.UserRepository
	repositories.PostRepository
}

/*
type PasswordResetController struct { // Same as Auth
	App *app.App
	repositories.UserRepository
	jwtService services.JWTAuthService
}
*/

func NewUserController(a *app.App, ur repositories.UserRepository, pr repositories.PostRepository) *UserController {
	return &UserController{a, ur, pr}
}

func (uc *UserController) HelloWorld(w http.ResponseWriter, r *http.Request) {
	log.Println(r.Context().Value("userId"))
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	fmt.Fprint(w, "Hey! You're not supposed to be here! (The API is online though)")
}

func (uc *UserController) Profile(w http.ResponseWriter, r *http.Request) {
	uid, err := services.UserIdFromContext(r.Context())
	if err != nil {
		NewAPIError(&APIError{false, "Something went wrong", http.StatusInternalServerError}, w)
		return
	}

	NewAPIResponse(&APIResponse{Success: true, Data: uid}, w, http.StatusOK)
}

func (uc *UserController) Create(w http.ResponseWriter, r *http.Request) {
	// Validate the length of the body since some users could send a big payload
	/*required := []string{"name", "email", "password"}
	if len(params) != len(required) {
		err := NewAPIError(false, "Invalid request")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(err)
		return
	}*/

	j, err := GetJSON(r.Body)
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}

	name, err := j.GetString("name")
	if err != nil {
		NewAPIError(&APIError{false, "Name is required", http.StatusBadRequest}, w)
		return
	}
	// TODO: Implement something like this and embed in a basecontroller https://stackoverflow.com/a/23960293/2554631
	if len(name) < 2 || len(name) > 32 {
		NewAPIError(&APIError{false, "Name must be between 2 and 32 characters", http.StatusBadRequest}, w)
		return
	}

	email, err := j.GetString("email")
	if err != nil {
		NewAPIError(&APIError{false, "Email is required", http.StatusBadRequest}, w)
		return
	}
	if ok := util.IsEmail(email); !ok {
		NewAPIError(&APIError{false, "You must provide a valid email address", http.StatusBadRequest}, w)
		return
	}
	exists := uc.UserRepository.Exists(email)
	if exists {
		NewAPIError(&APIError{false, "The email address is already in use", http.StatusBadRequest}, w)
		return
	}
	pw, err := j.GetString("password")
	if err != nil {
		NewAPIError(&APIError{false, "Password is required", http.StatusBadRequest}, w)
		return
	}
	if len(pw) < 6 {
		NewAPIError(&APIError{false, "Password must not be less than 6 characters", http.StatusBadRequest}, w)
		return
	}

	newID, err := uuid.NewV4()
	if err != nil {
		NewAPIError(&APIError{false, "Failed to generate user UUID", http.StatusInternalServerError}, w)
		return
	}

	u := &models.User{
		ID:        newID,
		Name:      name,
		Email:     email,
		Admin:     false,
		CreatedAt: time.Now(),
	}
	u.SetPassword(pw)

	err = uc.UserRepository.Create(u)
	if err != nil {
		NewAPIError(&APIError{false, "Could not create user", http.StatusBadRequest}, w)
		return
	}
	// This shouldn't be needed since this is server-side (closed automatically)
	//defer r.Body.Close()
	NewAPIResponse(&APIResponse{Success: true, Message: "User created"}, w, http.StatusOK)
}

func (uc *UserController) CreateFirstAdmin(w http.ResponseWriter, r *http.Request) {

	j, err := GetJSON(r.Body)
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}

	name, err := j.GetString("name")
	if err != nil {
		NewAPIError(&APIError{false, "Name is required", http.StatusBadRequest}, w)
		return
	}
	// TODO: Implement something like this and embed in a basecontroller https://stackoverflow.com/a/23960293/2554631
	if len(name) < 2 || len(name) > 32 {
		NewAPIError(&APIError{false, "Name must be between 2 and 32 characters", http.StatusBadRequest}, w)
		return
	}

	email, err := j.GetString("email")
	if err != nil {
		NewAPIError(&APIError{false, "Email is required", http.StatusBadRequest}, w)
		return
	}
	if ok := util.IsEmail(email); !ok {
		NewAPIError(&APIError{false, "You must provide a valid email address", http.StatusBadRequest}, w)
		return
	}
	exists := uc.UserRepository.Exists(email)
	if exists {
		NewAPIError(&APIError{false, "The email address is already in use", http.StatusBadRequest}, w)
		return
	}
	pw, err := j.GetString("password")
	if err != nil {
		NewAPIError(&APIError{false, "Password is required", http.StatusBadRequest}, w)
		return
	}
	if len(pw) < 6 {
		NewAPIError(&APIError{false, "Password must not be less than 6 characters", http.StatusBadRequest}, w)
		return
	}

	newID, err := uuid.NewV4()
	if err != nil {
		NewAPIError(&APIError{false, "Failed to generate user UUID", http.StatusInternalServerError}, w)
		return
	}

	u := &models.User{
		ID:        newID,
		Name:      name,
		Email:     email,
		Admin:     true,
		CreatedAt: time.Now(),
	}
	u.SetPassword(pw)

	success, err := uc.UserRepository.CreateFirstAdmin(u)
	if err != nil {
		NewAPIError(&APIError{false, "Could not create admin user", http.StatusBadRequest}, w)
		return
	}

	if success == false {
		log.Printf("[BAD CREATE FIRST ADMIN] There is already admin name: %v username: %v password: %v", name, email, pw)
		NewAPIError(&APIError{false, "There is already an admin user", http.StatusBadRequest}, w)
		return
	}

	// This shouldn't be needed since this is server-side (closed automatically)
	//defer r.Body.Close()
	
	log.Println("[AUTH] First admin user created")
	NewAPIResponse(&APIResponse{Success: true, Message: "Admin user created"}, w, http.StatusOK)
}

func (uc *UserController) GetAll(w http.ResponseWriter, r *http.Request) {
	users, err := uc.UserRepository.GetAll()
	if err != nil {
		// something went wrong
		NewAPIError(&APIError{false, "Could not fetch users", http.StatusBadRequest}, w)
		return
	}

	NewAPIResponse(&APIResponse{Success: true, Data: users}, w, http.StatusOK)
}

func (uc *UserController) GetAllDetailed(w http.ResponseWriter, r *http.Request) {
	users, err := uc.UserRepository.GetAllDetailed()
	if err != nil {
		// something went wrong
		NewAPIError(&APIError{false, "Could not fetch users", http.StatusBadRequest}, w)
		return
	}

	NewAPIResponse(&APIResponse{Success: true, Data: users}, w, http.StatusOK)
}

func (uc *UserController) GetById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if id == "" {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}

	user, err := uc.UserRepository.FindById(id)
	if err != nil {
		// user was not found
		NewAPIError(&APIError{false, "Could not find user", http.StatusNotFound}, w)
		return
	}

	NewAPIResponse(&APIResponse{Success: true, Data: user}, w, http.StatusOK)
}

func (uc *UserController) GetByIdDetailed(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if id == "" {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}

	user, err := uc.UserRepository.FindByIdDetailed(id)
	if err != nil {
		// user was not found
		NewAPIError(&APIError{false, "Could not find user", http.StatusNotFound}, w)
		return
	}

	NewAPIResponse(&APIResponse{Success: true, Data: user}, w, http.StatusOK)
}

func (uc *UserController) Update(w http.ResponseWriter, r *http.Request) {
	uid, err := services.UserIdFromContext(r.Context())
	if err != nil {
		NewAPIError(&APIError{false, "Something went wrong", http.StatusInternalServerError}, w)
		return
	}

	user, err := uc.UserRepository.FindById(uid)
	if err != nil {
		NewAPIError(&APIError{false, "Could not find user", http.StatusBadRequest}, w)
		return
	}

	j, err := GetJSON(r.Body)
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}

	name, err := j.GetString("name")
	if name != "" && err == nil {
		user.Name = name
	}

	newpw, err := j.GetString("newpassword")
	if newpw != "" && err == nil {
		// confirm password
		/*
			oldpw, err := j.GetString("oldpassword")
			if err != nil {
				NewAPIError(&APIError{false, "Old password is required", http.StatusBadRequest}, w)
				return
			}
			ok := user.CheckPassword(oldpw)
			if !ok {
				NewAPIError(&APIError{false, "Old password does not match", http.StatusBadRequest}, w)
				return
			}
		*/
		if len(newpw) < 6 {
			NewAPIError(&APIError{false, "Password must not be less than 6 characters", http.StatusBadRequest}, w)
			return
		}
		user.SetPassword(newpw)
	}

	tempTime := time.Now()
	user.UpdatedAt = &tempTime

	err = uc.UserRepository.Update(user)
	if err != nil {
		NewAPIError(&APIError{false, "Could not update user", http.StatusBadRequest}, w)
		return
	}

	authUser := &models.AuthUser{
		User:  user,
		Admin: user.Admin,
	}

	NewAPIResponse(&APIResponse{Success: true, Data: authUser}, w, http.StatusOK)
}

func (uc *UserController) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	if id == "" {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}

	user, err := uc.UserRepository.FindByIdDetailed(id)
	if err != nil {
		// user was not found
		NewAPIError(&APIError{false, "Could not find user", http.StatusNotFound}, w)
		return
	}

	err = uc.UserRepository.Delete(id)
	if err != nil {
		// user was not found
		NewAPIError(&APIError{false, "Failed to delete user", http.StatusInternalServerError}, w)
		return
	}

	log.Println("[DELETE USER SUCCESS] - username:", user.Email)
	NewAPIResponse(&APIResponse{Success: true, Data: user}, w, http.StatusOK)
}

// Password reset functionality - Might look into this more later
/*
func (prc *PasswordResetController) ResetPasswordRequest(w http.ResponseWriter, r *http.Request) {
	j, err := GetJSON(r.Body)
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}
	email, err := j.GetString("email")
	if err != nil {
		NewAPIError(&APIError{false, "Email is required", http.StatusBadRequest}, w)
		return
	}
	if ok := util.IsEmail(email); !ok {
		NewAPIError(&APIError{false, "You must provide a valid email address", http.StatusBadRequest}, w)
		return
	}

	user, err := prc.UserRepository.FindByEmail(email)

	data := struct {
		Tokens *services.Tokens `json:"tokens"`
		User   *models.AuthUser `json:"user"`
	}{
		nil,
		nil,
	}

	if user != nil {
		tokens, err := prc.jwtService.GenerateResetToken(user)
		if err != nil {
			NewAPIError(&APIError{false, "Something went wrong", http.StatusBadRequest}, w)
			return
		}

		err := smtp.SendMail(
			email := gmail.Compose("Email subject", tokens.AccessToken)
			email.From = "empty@gmail.com"
			email.Password = "empty"

			// Defaults to "text/plain; charset=utf-8" if unset.
			email.ContentType = "text/html; charset=utf-8"

			// Normally you'll only need one of these, but I thought I'd show both.
			email.AddRecipient(email)

			err := email.Send()
			if err != nil {
				log.err("Failed to send email")
				return
			}
		)
		if err != nil {
			log.Fatal(err)
		}

	}
	NewAPIResponse(&APIResponse{Success: true, Message: "Login successful", Data: data}, w, http.StatusOK)
	// TODO return jwt tokens
	//NewAPIResponse(&APIResponse{Success: true, Data: j}, w, http.StatusOK)

}
*/
