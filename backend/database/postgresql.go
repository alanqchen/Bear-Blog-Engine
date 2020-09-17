package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/alanqchen/Bear-Post/backend/config"
	"github.com/jackc/pgx/v4/pgxpool"
)

// Postgres stores the connection to the connection pool
type Postgres struct {
	*pgxpool.Pool
}

// NewPostgres creates new Postgres connection using connection config
func NewPostgres(dbConfig config.PostgreSQLConfig) (*Postgres, error) {
	databaseDSN := fmt.Sprintf("user=%s password=%s host=%s port=%s dbname=%s", dbConfig.User, dbConfig.Password, dbConfig.Host, dbConfig.Port, dbConfig.Database)
	connConfig, err := pgxpool.ParseConfig(databaseDSN)
	if err != nil {
		log.Printf("[FATAL] Unable to parse to DSN: %v\n", err)
		os.Exit(1)
	}
	conn, err := pgxpool.ConnectConfig(context.Background(), connConfig)
	if err != nil {
		log.Printf("[FATAL] Unable to connect to database: %v\n", err)
		os.Exit(1)
	}

	return &Postgres{conn}, nil
}

func quoteIdentifier(s string) string {
	return `"` + strings.Replace(s, `"`, `""`, -1) + `"`
}
