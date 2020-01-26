package database

import (
	"context"
	"fmt"
	"os"

	"github.com/alanqchen/MGBlog/backend/config"
	"github.com/jackc/pgx/v4"
)

type Postgres struct {
	*pgx.Conn
}

func NewPostgres(dbConfig config.PostgreSQLConfig) (*Postgres, error) {
	databaseURL := fmt.Sprintf("%s:%s", dbConfig.Host, dbConfig.Port) //postgresql://localhost:5432
	conn, err := pgx.Connect(context.Background(), databaseURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connection to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(context.Background())

	return &Postgres{conn}, nil
}
