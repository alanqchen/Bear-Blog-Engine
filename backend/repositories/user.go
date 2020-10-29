package repositories

import (
	"context"
	"log"

	"github.com/alanqchen/Bear-Post/backend/database"
	"github.com/alanqchen/Bear-Post/backend/models"
	"github.com/jackc/pgtype"
	"github.com/jackc/pgx/v4"
)

// UserRepository interface defines all functions that interact with the database
type UserRepository interface {
	Create(u *models.User) error
	CreateFirstAdmin(u *models.User) (bool, error)
	GetAll() ([]*models.User, error)
	GetAllDetailed() ([]*models.AuthUser, error)
	FindByID(id string) (*models.User, error)
	FindByIDDetailed(id string) (*models.User, error)
	FindByEmail(email string) (*models.User, error)
	FindByUsername(username string) (*models.User, error)
	Exists(email string) bool
	ExistsUsername(username string) bool
	Delete(id string) error
	Update(u *models.User) error
}

type userRepository struct {
	*database.Postgres
}

// NewUserRespository returns a new user repository
func NewUserRespository(db *database.Postgres) UserRepository {
	return &userRepository{db}
}

// Create creates a new user in the database for the given user model
func (ur *userRepository) Create(u *models.User) error {

	// Check if an user already exists with the email
	// Prepare statement for inserting data
	/*
		_, err := ur.Conn.Prepare(context.Background(), "user-query", "INSERT INTO user_schema.\"user\"(id, name, email, password, created_at) VALUES ($1, $2, $3, $4, $5)")
		log.Println(err)
		if err != nil {
			return err
		}
	*/

	//defer ur.Conn.Close(context.Background())
	_, err := ur.Pool.Exec(context.Background(),
		"INSERT INTO user_schema.\"user\"(id, name, email, password, created_at, admin, username) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		u.ID, u.Name, u.Email, u.Password, (u.CreatedAt.UTC()), u.Admin, u.Username,
	)

	if err != nil {
		log.Println(err)
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
		log.Println(err)
		return false, err
	}
	// There are no users yet, create admin
	/*
		_, err = ur.Conn.Prepare(context.Background(), "first-admin-query", "INSERT INTO user_schema.\"user\"(id, name, email, password, created_at, admin) VALUES ($1, $2, $3, $4, $5, $6)")
		log.Println(err)
		if err != nil {
			return false, err
		}
	*/

	_, err = ur.Pool.Exec(context.Background(),
		"INSERT INTO user_schema.\"user\"(id, name, email, password, created_at, admin, username) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		u.ID, u.Name, u.Email, u.Password, (u.CreatedAt.UTC()), u.Admin, u.Username,
	)
	if err != nil {
		log.Println(err)
		return false, err
	}

	return true, err

}

// Update a user in the database
func (ur *userRepository) Update(u *models.User) error {
	// Check if an user already exists with the email
	// Prepare statement for inserting data
	/*
		_, err := ur.Conn.Prepare(context.Background(), "update-query", "UPDATE user_schema.user SET name=$1, email=$2, password=$3, updated_at=$4 WHERE id=$5")
		if err != nil {
			log.Println(err)
			return err
		}
	*/
	//defer ur.Conn.Close(context.Background())\
	var err error

	if u.Password == "" {
		_, err = ur.Pool.Exec(context.Background(),
			"UPDATE user_schema.user SET name=$1, email=$2, updated_at=$3, username=$4, admin=$5 WHERE id=$6",
			u.Name, u.Email, u.UpdatedAt, u.Username, u.Admin, u.ID,
		)
	} else {
		_, err = ur.Pool.Exec(context.Background(),
			"UPDATE user_schema.user SET name=$1, email=$2, password=$3, updated_at=$4, username=$5, admin=$6 WHERE id=$7",
			u.Name, u.Email, u.Password, u.UpdatedAt, u.Username, u.Admin, u.ID,
		)
	}
	if err != nil {
		log.Println(err)
		return err
	}

	return nil
}

// GetAll returns all users' basic information from the database
func (ur *userRepository) GetAll() ([]*models.User, error) {
	var users []*models.User

	rows, err := ur.Pool.Query(context.Background(), "SELECT id, name, admin, created_at, updated_at FROM user_schema.\"user\"")
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		u := new(models.User)
		err := rows.Scan(&u.ID, &u.Name, &u.Admin, &u.CreatedAt, &u.UpdatedAt)

		if err != nil {
			log.Println(err)
			return nil, err
		}
		u.Email = ""
		users = append(users, u)
	}

	if err := rows.Err(); err != nil {
		log.Println(err)
		return nil, err
	}

	return users, nil
}

// GetAllDetailed returns all users' information from the database
func (ur *userRepository) GetAllDetailed() ([]*models.AuthUser, error) {
	var users []*models.AuthUser

	rows, err := ur.Pool.Query(context.Background(), "SELECT id, name, email, admin, created_at, updated_at, username FROM user_schema.\"user\"")
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		u := new(models.User)
		authUser := new(models.AuthUser)
		authUser.User = u

		err := rows.Scan(
			&authUser.User.ID, &authUser.User.Name, &authUser.User.Email, &authUser.Admin, &authUser.User.CreatedAt, &authUser.User.UpdatedAt, &authUser.User.Username,
		)

		if err != nil {
			log.Println(err)
			return nil, err
		}
		users = append(users, authUser)
	}

	if err := rows.Err(); err != nil {
		log.Println(err)
		return nil, err
	}

	return users, nil
}

// FindByEmail is not used anymore in latest version. Kept for compatibility
func (ur *userRepository) FindByEmail(email string) (*models.User, error) {
	user := models.User{}

	err := ur.Pool.QueryRow(context.Background(), "SELECT * FROM user_schema.\"user\" WHERE email = $1", email).Scan(
		&user.ID, &user.Name, &user.Email, &user.Password, &user.Admin, &user.CreatedAt, &user.UpdatedAt, &user.Username,
	)

	if err != nil && err != pgx.ErrNoRows {
		return nil, err
	}

	return &user, nil
}

// FindByUsername returns the user's information with the given username from the database
func (ur *userRepository) FindByUsername(username string) (*models.User, error) {
	user := models.User{}

	err := ur.Pool.QueryRow(context.Background(), "SELECT * FROM user_schema.\"user\" WHERE username = $1", username).Scan(
		&user.ID, &user.Name, &user.Email, &user.Password, &user.Admin, &user.CreatedAt, &user.UpdatedAt, &user.Username,
	)

	if err != nil && err != pgx.ErrNoRows {
		return nil, err
	}

	return &user, nil
}

// FindByID returns the user's basic information with the given ID from the database
func (ur *userRepository) FindByID(id string) (*models.User, error) {
	user := models.User{}

	err := ur.Pool.QueryRow(context.Background(),
		"SELECT id, name, admin, created_at, updated_at FROM user_schema.\"user\" WHERE id = $1", id,
	).Scan(&user.ID, &user.Name, &user.Admin, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		log.Println(err)
		return nil, err
	}
	user.Email = ""

	return &user, nil
}

// FindByIDDetailed returns the user's information with the given ID from the database
func (ur *userRepository) FindByIDDetailed(id string) (*models.User, error) {
	user := models.User{}

	err := ur.Pool.QueryRow(context.Background(),
		"SELECT id, name, email, admin, created_at, updated_at, username FROM user_schema.\"user\" WHERE id = $1", id,
	).Scan(&user.ID, &user.Name, &user.Email, &user.Admin, &user.CreatedAt, &user.UpdatedAt, &user.Username)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &user, nil
}

// Exists is not used anymore in latest version. Kept for compatibility
func (ur *userRepository) Exists(email string) bool {
	var exists pgtype.Bool
	err := ur.Pool.QueryRow(context.Background(), "SELECT EXISTS(SELECT user_schema.\"user\".email FROM user_schema.\"user\" WHERE email = $1)", email).Scan(&exists)
	if err != nil && err != pgx.ErrNoRows {
		log.Println(err)
		return true
	}
	return exists.Bool
}

// ExistsUsername checks if a user with the given username exists in the database
func (ur *userRepository) ExistsUsername(username string) bool {
	var exists pgtype.Bool
	err := ur.Pool.QueryRow(context.Background(), "SELECT EXISTS(SELECT user_schema.\"user\".username FROM user_schema.\"user\" WHERE username = $1)", username).Scan(&exists)
	if err != nil && err != pgx.ErrNoRows {
		log.Println(err)
		return true
	}
	return exists.Bool
}

// Delete deletes the user with the given ID from the database
func (ur *userRepository) Delete(id string) error {
	_, err := ur.Pool.Exec(context.Background(), "DELETE FROM user_schema.\"user\" WHERE id = $1", id)
	if err != nil {
		log.Println(err)
		return err
	}

	return nil
}
