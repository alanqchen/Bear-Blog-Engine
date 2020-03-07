package database

import (
	"fmt"
	"log"
	"strconv"

	"github.com/alanqchen/Bear-Post/backend/config"
	"github.com/go-redis/redis"
)

type Redis struct {
	*redis.Client
}

func NewRedis(dbConfig config.RedisConfig) (*Redis, error) {
	port := strconv.Itoa(dbConfig.Port)
	//port := dbConfig.Port
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
