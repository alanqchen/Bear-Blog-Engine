package models

import (
	"encoding/json"
	"time"

	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

// User represents a user account for public visibility (used for public endpoints)
// Its MarshalJSON function wont expose its role.
type User struct {
	ID        uuid.UUID  `json:"id"`
	Name      string     `json:"name"`
	Email     string     `json:"email"`
	Password  string     `json:"password"`
	Admin     bool       `json:"admin"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt *time.Time `json:"updatedAt"`
	Username  string     `json:"username"`
}

// AuthUser represents a user account for private visibility (used for login and update response)
// Its MarshalJSON function will expose its role.
type AuthUser struct {
	*User
	Admin bool `json:"admin"`
}

// MarshalJSON marshals a given user's information
func (u *User) MarshalJSON() ([]byte, error) {
	value := u.UpdatedAt
	if value == nil {
		return json.Marshal(struct {
			ID        uuid.UUID  `json:"id"`
			Name      string     `json:"name"`
			Email     string     `json:"email"`
			CreatedAt time.Time  `json:"createdAt"`
			UpdatedAt *time.Time `json:"updatedAt"`
			Username  string     `json:"username"`
		}{u.ID, u.Name, u.Email, u.CreatedAt, nil, u.Username})
	}
	return json.Marshal(struct {
		ID        uuid.UUID  `json:"id"`
		Name      string     `json:"name"`
		Email     string     `json:"email"`
		CreatedAt time.Time  `json:"createdAt"`
		UpdatedAt *time.Time `json:"updatedAt"`
		Username  string     `json:"username"`
	}{u.ID, u.Name, u.Email, u.CreatedAt, u.UpdatedAt, u.Username})
}

// MarshalJSON marshals a given user's information including role
func (u *AuthUser) MarshalJSON() ([]byte, error) {
	value := u.UpdatedAt
	if value == nil {
		// *pgtype.Timestamptz is used so we can set it to nil
		return json.Marshal(struct {
			ID        uuid.UUID  `json:"id"`
			Name      string     `json:"name"`
			Email     string     `json:"email"`
			Admin     bool       `json:"admin"`
			CreatedAt time.Time  `json:"createdAt"`
			UpdatedAt *time.Time `json:"updatedAt"`
			Username  string     `json:"username"`
		}{u.ID, u.Name, u.Email, u.Admin, u.CreatedAt, nil, u.Username})
	}
	return json.Marshal(struct {
		ID        uuid.UUID  `json:"id"`
		Name      string     `json:"name"`
		Email     string     `json:"email"`
		Admin     bool       `json:"admin"`
		CreatedAt time.Time  `json:"createdAt"`
		UpdatedAt *time.Time `json:"updatedAt"`
		Username  string     `json:"username"`
	}{u.ID, u.Name, u.Email, u.Admin, u.CreatedAt, u.UpdatedAt, u.Username})
}

// SetPassword hashes and salts the given password and then sets it to the user
func (u *User) SetPassword(password string) {
	pwhash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	u.Password = string(pwhash)
}

// CheckPassword compares the given password with the user's password
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	if err != nil {
		return false
	}

	return true
}

// IsAdmin returns if the user is an admin
func (u *User) IsAdmin() bool {
	return u.Admin == true
}
