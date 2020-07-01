package models

import (
	"encoding/json"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type UpdateTime struct {
	Time time.Time
}

// User represents a user account for public visibility (used for public endpoints)
// Its MarshalJSON function wont expose its role.
type User struct {
	ID        int        `json:"id"`
	Name      string     `json:"name"`
	Email     string     `json:"email"`
	Password  string     `json:"password"`
	Admin     bool       `json:"admin"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt *time.Time `json:"updatedAt"`
}

// AuthUser represents a user account for private visibility (used for login and update response)
// Its MarshalJSON function will expose its role.
type AuthUser struct {
	*User
	Admin bool `json:"admin"`
}

// TODO: Maybe find a better solution to remove the password when marshalling to json
func (u *User) MarshalJSON() ([]byte, error) {
	value := u.UpdatedAt
	if value == nil {
		return json.Marshal(struct {
			ID        int        `json:"id"`
			Name      string     `json:"name"`
			Email     string     `json:"email"`
			CreatedAt time.Time  `json:"createdAt"`
			UpdatedAt *time.Time `json:"updatedAt"`
		}{u.ID, u.Name, u.Email, u.CreatedAt, nil})
	}
	return json.Marshal(struct {
		ID        int        `json:"id"`
		Name      string     `json:"name"`
		Email     string     `json:"email"`
		CreatedAt time.Time  `json:"createdAt"`
		UpdatedAt *time.Time `json:"updatedAt"`
	}{u.ID, u.Name, u.Email, u.CreatedAt, u.UpdatedAt})
}

func (u *AuthUser) MarshalJSON() ([]byte, error) {
	value := u.UpdatedAt
	if value == nil {
		// *pgtype.Timestamptz is used so we can set it to nil
		return json.Marshal(struct {
			ID        int        `json:"id"`
			Name      string     `json:"name"`
			Email     string     `json:"email"`
			Admin     bool       `json:"admin"`
			CreatedAt time.Time  `json:"createdAt"`
			UpdatedAt *time.Time `json:"updatedAt"`
		}{u.ID, u.Name, u.Email, u.Admin, u.CreatedAt, nil})
	}
	return json.Marshal(struct {
		ID        int        `json:"id"`
		Name      string     `json:"name"`
		Email     string     `json:"email"`
		Admin     bool       `json:"admin"`
		CreatedAt time.Time  `json:"createdAt"`
		UpdatedAt *time.Time `json:"updatedAt"`
	}{u.ID, u.Name, u.Email, u.Admin, u.CreatedAt, u.UpdatedAt})
}

func (u *User) SetPassword(password string) {
	pwhash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	u.Password = string(pwhash)
}

func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	if err != nil {
		return false
	}

	return true
}

/*
func (u *User) GetHashedPassword() string {
	return u.Password
}

func (u *User) GetCreationTime() time.Time {
	return u.CreatedAt
}
*/
func (u *User) IsAdmin() bool {
	return u.Admin == true
}
