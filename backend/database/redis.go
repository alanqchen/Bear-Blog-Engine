package database

import (
	"fmt"
	"log"

	"github.com/alanqchen/Bear-Post/backend/config"
	"github.com/go-redis/redis"
)

// Redis stores the connection to Redis
type Redis struct {
	*redis.Client
}

// NewRedis creates a connection to Redis using the given connection config
func NewRedis(dbConfig config.RedisConfig) (*Redis, error) {
	port := dbConfig.Port
	client := redis.NewClient(&redis.Options{
		Addr:     dbConfig.Host + ":" + port,
		Password: dbConfig.Password,
		DB:       0,
	})
	log.Println("Pinging redis...")
	_, err := client.Ping().Result()
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	log.Println("Ping Successful")
	return &Redis{client}, err
}
