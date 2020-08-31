package config

import (
	"encoding/json"
	"log"
	"os"
)

// PostgreSQLConfig holds the configuration for the Postgres database
type PostgreSQLConfig struct {
	Host     string `json:"host"`
	Port     string `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
	Database string `json:"database"`
	Timezone string `json:"timezone"`
}

// JWTConfig holds the configuration for the JWT authentication
type JWTConfig struct {
	Secret     string `json:"secret"`
	PublicKey  string `json:"public_key"`
	PrivateKey string `json:"private_key"`
}

// RedisConfig holds the configuration for the Redis database
type RedisConfig struct {
	Host     string `json:"host"`
	Port     string `json:"port"`
	Password string `json:"password"`
}

// Config holds the configuration for the whole API
type Config struct {
	Env            string           `json:"env"`
	PostgreSQL     PostgreSQLConfig `json:"postgreSQL"`
	JWT            JWTConfig        `json:"jwt"`
	RedisDB        RedisConfig      `json:"RedisDB"`
	Port           string           `json:"port"`
	AllowedOrigins []string         `json:"allowedOrigins"`
	CaptchaSecret  string           `json:"captchaSecret"`
}

// New returns a Config struct based on a given JSON file
func New(path string) (Config, error) {
	file, err := os.Open(path)
	defer file.Close()
	if err != nil {
		log.Fatal(err)
	}
	decoder := json.NewDecoder(file)
	cfg := Config{}
	err = decoder.Decode(&cfg)
	if err != nil {
		log.Fatal(err)
	}

	return cfg, nil
}
