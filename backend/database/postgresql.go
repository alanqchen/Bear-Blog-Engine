package database

import (
	"context"
	"fmt"
	"log"
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
		log.Printf("[FATAL] Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	// Set connection timezone to the one in config
	_, err = conn.Prepare(context.Background(), "timezone-query", "DELETE FROM posts_schema.posts WHERE id=$1")
	if err != nil {
		log.Printf("[FATAL] Failed to prepare timezone query: %v\n", err)
		os.Exit(1)
	}
	rows, err := conn.Query(context.Background(), "timezone-query", dbConfig.Timezone)
	defer rows.Close()
	if err != nil {
		log.Printf("[WARN] Failed to set Postgre timezone: %v\n", err)

	}

	return &Postgres{conn}, nil
}
