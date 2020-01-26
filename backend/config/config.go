package config

import (
	"encoding/json"
	"log"
	"os"
)

type PostgreSQLConfig struct {
	Host string `json:"host"`
	Port string `json:"port"`
}

type JWTConfig struct {
	Secret     string `json:"secret"`
	PublicKey  string `json:"public"`
	PrivateKey string `json:"private"`
}

type RedisConfig struct {
	Host     string `json:"host"`
	Port     int    `json:"port"`
	Password string `json:"password"`
}

type Config struct {
	Env         string           `json:"env"`
	ProstgreSQL PostgreSQLConfig `json:"postgreSQL"`
	JWT         JWTConfig        `json:"jwt"`
	RedisDB     RedisConfig      `json:"RedisDB"`
	Port        int              `json:"port"`
	// TODO
}

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
