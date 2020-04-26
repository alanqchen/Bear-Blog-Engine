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
	databaseDSN := fmt.Sprintf("user=%s password=%s host=%s port=%s dbname=%s", dbConfig.User, dbConfig.Password, dbConfig.Host, dbConfig.Port, dbConfig.Database)
	connConfig, err := pgx.ParseConfig(databaseDSN)
	if err != nil {
		log.Printf("[FATAL] Unable to parse to DSN: %v\n", err)
		os.Exit(1)
	}
	conn, err := pgx.ConnectConfig(context.Background(), connConfig)
	if err != nil {
		log.Printf("[FATAL] Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	// Set connection timezone to the one in config
	_, err = conn.Prepare(context.Background(), "timezone-query", "DELETE FROM post_schema.post WHERE id=$1")
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
