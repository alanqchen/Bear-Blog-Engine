package repositories

import (
	"context"
	"log"
	"time"

	"github.com/alanqchen/Bear-Post/backend/database"
	"github.com/alanqchen/Bear-Post/backend/models"
	"github.com/jackc/pgtype"
	"github.com/jackc/pgx/v4"
)

/* TODO: FIX FindById, FindByEmail, Delete, Update
 *
 * FIXED: Create, GetAll, Exists
 *
 */

type UserRepository interface {
	Create(u *models.User) error
	CreateFirstAdmin(u *models.User) (bool, error)
	GetAll() ([]*models.User, error)
	GetAllDetailed() ([]*models.User, error)
	FindById(id string) (*models.User, error)
	FindByIdDetailed(id string) (*models.User, error)
	FindByEmail(email string) (*models.User, error)
	Exists(email string) bool
	Delete(id string) error
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

func (ur *userRepository) CreateFirstAdmin(u *models.User) (bool, error) {
	users, err := ur.GetAll()
	if err != nil {
		log.Println(err)
		return false, err
	}
	numUsers := len(users)
	if numUsers != 0 {
		log.Println("[WARN] Invalid request to create first admin")
		return false, err
	}
	// There are no users yet, create admin
	_, err = ur.Conn.Prepare(context.Background(), "first-admin-query", "INSERT INTO user_schema.\"user\"(id, name, email, password, created_at, admin) VALUES ($1, $2, $3, $4, $5, $6)")
	log.Println(err)
	if err != nil {
		return false, err
	}

	_, err = ur.Conn.Exec(context.Background(), "first-admin-query", u.ID, u.Name, u.Email, u.Password, (u.CreatedAt.UTC()), u.Admin)
	log.Println(err)
	if err != nil {
		return false, err
	}

	return true, err

}

func (ur *userRepository) Update(u *models.User) error {
	// Check if an user already exists with the email
	// Prepare statement for inserting data
	_, err := ur.Conn.Prepare(context.Background(), "update-query", "UPDATE user_schema.user SET name=$1, email=$2, password=$3, updated_at=$4 WHERE id=$5")
	if err != nil {
		log.Println(err)
		return err
	}
	//defer ur.Conn.Close(context.Background())
	_, err = ur.Conn.Exec(context.Background(), "update-query", u.Name, u.Email, u.Password, u.UpdatedAt, u.ID)
	if err != nil {
		log.Println(u.Name)
		log.Println(u.Email)
		log.Println(u.Password)
		log.Println(u.UpdatedAt)
		log.Println(u.ID)
		log.Println(err)
		return err
	}

	return nil
}

func (ur *userRepository) GetAll() ([]*models.User, error) {
	var users []*models.User
	log.Println(time.Now())
	rows, err := ur.Conn.Query(context.Background(), "SELECT id, name, admin, created_at, updated_at FROM user_schema.\"user\"")
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		u := new(models.User)
		err := rows.Scan(&u.ID, &u.Name, &u.Admin, &u.CreatedAt, &u.UpdatedAt)
		log.Println(err)
		if err != nil {
			return nil, err
		}
		u.Email = ""
		users = append(users, u)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	log.Println(err)

	return users, nil
}

func (ur *userRepository) GetAllDetailed() ([]*models.User, error) {
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

	err := ur.Conn.QueryRow(context.Background(), "SELECT * FROM user_schema.\"user\" WHERE email = $1", email).Scan(&user.ID, &user.Name, &user.Email, &user.Password, &user.Admin, &user.CreatedAt, &user.UpdatedAt)
	if err != nil && err != pgx.ErrNoRows {
		return nil, err
	}

	return &user, nil
}

func (ur *userRepository) FindById(id string) (*models.User, error) {
	user := models.User{}

	err := ur.Conn.QueryRow(context.Background(), "SELECT id, name, admin, created_at, updated_at FROM user_schema.\"user\" WHERE id = $1", id).Scan(&user.ID, &user.Name, &user.Admin, &user.CreatedAt, &user.UpdatedAt)
	log.Println(err)
	if err != nil {
		return nil, err
	}
	user.Email = ""

	return &user, nil
}

func (ur *userRepository) FindByIdDetailed(id string) (*models.User, error) {
	user := models.User{}

	err := ur.Conn.QueryRow(context.Background(), "SELECT id, name, email, admin, created_at, updated_at FROM user_schema.\"user\" WHERE id = $1", id).Scan(&user.ID, &user.Name, &user.Email, &user.Admin, &user.CreatedAt, &user.UpdatedAt)
	log.Println(err)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (ur *userRepository) Exists(email string) bool {

	// Check if an user already exists with the email
	_, err := ur.Conn.Prepare(context.Background(), "email-exists-query", "SELECT EXISTS(SELECT user_schema.\"user\".email FROM user_schema.\"user\" WHERE email = $1);")
	if err != nil {
		log.Println(err)
		return true
	}

	var exists pgtype.Bool
	err = ur.Conn.QueryRow(context.Background(), "email-exists-query", email).Scan(&exists)
	if err != nil && err != pgx.ErrNoRows {
		log.Println(err)
		return true
	}
	return exists.Bool
}

func (ur *userRepository) Delete(id string) error {
	_, err := ur.Conn.Prepare(context.Background(), "delete-user-query", "DELETE FROM user_schema.\"user\" WHERE id = $1")
	if err != nil {
		log.Println(err)
		return err
	}

	_, err = ur.Conn.Exec(context.Background(), "delete-user-query", id)
	if err != nil {
		log.Println(err)
		return err
	}

	return nil
}
