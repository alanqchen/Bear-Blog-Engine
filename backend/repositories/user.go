package repositories

import (
	"context"
	"errors"
	"log"
	"time"

	"github.com/alanqchen/MGBlog/backend/database"
	"github.com/alanqchen/MGBlog/backend/models"
	"github.com/jackc/pgx/v4"
)

/* TODO: FIX FindById, FindByEmail, Delete, Update
 *
 * FIXED: Create, GetAll, Exists
 *
 */

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
	_, err := ur.Conn.Prepare(context.Background(), "user-query", "INSERT INTO user_schema.\"user\"(id, name, email, password, created_at) VALUES ($1, $2, $3, $4, $5)")
	log.Println(err)
	if err != nil {
		return err
	}

	//defer ur.Conn.Close(context.Background())
	_, err = ur.Conn.Exec(context.Background(), "user-query", u.ID, u.Name, u.Email, u.Password, (u.CreatedAt.UTC()))
	log.Println(err)
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
	_, err = ur.Conn.Exec(context.Background(), "update-query", u.Name, u.Email, u.Password, u.UpdatedAt, u.ID)
	if err != nil {
		return err
	}

	return nil
}

func (ur *userRepository) GetAll() ([]*models.User, error) {
	var users []*models.User
	log.Println(time.Now())
	rows, err := ur.Conn.Query(context.Background(), "SELECT id, name, email, admin, created_at, updated_at FROM user_schema.\"user\"")
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		u := new(models.User)
		err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.Admin, &u.CreatedAt, &u.UpdatedAt)
		log.Println(err)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	log.Println(err)

	return users, nil
}

func (ur *userRepository) FindByEmail(email string) (*models.User, error) {
	user := models.User{}

	err := ur.Conn.QueryRow(context.Background(), "SELECT id, name, email, password, admin, created_at, updated_at FROM users WHERE email = '?'", email).Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Admin, &user.CreatedAt, &user.UpdatedAt)
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
	_, err := ur.Conn.Prepare(context.Background(), "email-exists-query", "SELECT user_schema.\"user\".email FROM user_schema.\"user\" WHERE email = $1;")
	log.Println(err)
	if err != nil {
		return true
	}
	log.Println("Passed prepare")
	//defer ur.Conn.Close(context.Background())

	err = ur.Conn.QueryRow(context.Background(), "email-exists-query", email).Scan(exists)
	log.Println(err)
	if err != nil && err != pgx.ErrNoRows {
		return true
	}
	log.Println("email does not exist")
	return exists
}

func (ur *userRepository) Delete(id int) error {

	return errors.New("hej")
}
