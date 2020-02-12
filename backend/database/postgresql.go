package database

import (
	"context"
	"fmt"
	"os"

	"github.com/alanqchen/Bear-Post/backend/config"
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
	// Set connection timezone to the one in config
	rows, err := conn.Query(context.Background(), "SET timezone = $1", dbConfig.Timezone)
	defer rows.Close()
	if err != nil {
		fmt.Println("failed to set timezone")
	}

	return &Postgres{conn}, nil
}
