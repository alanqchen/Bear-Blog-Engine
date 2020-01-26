package repositories

import (
	"context"
	"database/sql"
	"errors"

	"github.com/alanqchen/MGBlog/backend/database"
	"github.com/alanqchen/MGBlog/backend/models"
)

type UserRepository interface {
	Create(u *models.User) error
	GetAll() ([]*models.User, error)
	FindById(id int) (*models.User, error)
	FindByEmail(email string) (*models.User, error)
	Exists(email string) bool
	Delete(id int) error
	Update(u *models.User) error
}

type userRepository struct {
	*database.Postgres
}

func NewUserRespository(db *database.Postgres) UserRepository {
	return &userRepository{db}
}

func (ur *userRepository) Create(u *models.User) error {

	// Check if an user already exists with the email
	// Prepare statement for inserting data
	_, err := ur.Conn.Prepare(context.Background(), "user-query", "INSERT INTO users SET name=?, email=?, password=?, created_at=?")
	if err != nil {
		return err
	}
	defer ur.Conn.Close(context.Background())
	_, err = ur.Conn.Exec(context.Background(), u.Name, u.Email, u.Password, u.CreatedAt.Format("20060102150405"))
	if err != nil {
		return err
	}

	return nil
}

func (ur *userRepository) Update(u *models.User) error {
	// Check if an user already exists with the email
	// Prepare statement for inserting data
	_, err := ur.Conn.Prepare(context.Background(), "update-query", "UPDATE users SET name=?, email=?, password=?, updated_at=? WHERE id = ?")
	if err != nil {
		return err
	}
	defer ur.Conn.Close(context.Background())
	_, err = ur.Conn.Exec(context.Background(), u.Name, u.Email, u.Password, u.UpdatedAt, u.ID)
	if err != nil {
		return err
	}

	return nil
}

func (ur *userRepository) GetAll() ([]*models.User, error) {
	var users []*models.User

	rows, err := ur.Conn.Query(context.Background(), "SELECT id, name, email, admin, created_at, updated_at FROM users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		u := new(models.User)
		err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.Admin, &u.CreatedAt, &u.UpdatedAt)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (ur *userRepository) FindByEmail(email string) (*models.User, error) {
	user := models.User{}

	err := ur.Conn.QueryRow(context.Background(), "SELECT id, name, email, password, admin, created_at, updated_at FROM users WHERE email = ?", email).Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Admin, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (ur *userRepository) FindById(id int) (*models.User, error) {
	user := models.User{}

	err := ur.Conn.QueryRow(context.Background(), "SELECT id, name, email, password, admin, created_at, updated_at FROM users WHERE id = ?", id).Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Admin, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (ur *userRepository) Exists(email string) bool {

	// Check if an user already exists with the email
	var exists bool
	_, err := ur.Conn.Prepare(context.Background(), "email-exists-query", "SELECT email FROM users WHERE email = ?")
	if err != nil {
		return true
	}
	defer ur.Conn.Close(context.Background())
	err = ur.Conn.QueryRow(context.Background(), email).Scan(exists)
	if err != nil && err != sql.ErrNoRows {
		return true
	}

	return exists
}

func (ur *userRepository) Delete(id int) error {

	return errors.New("hej")
}
