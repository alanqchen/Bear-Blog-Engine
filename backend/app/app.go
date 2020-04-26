package app

import (
	"fmt"
	"log"
	"net/http"

	"github.com/alanqchen/Bear-Post/backend/config"
	"github.com/alanqchen/Bear-Post/backend/database"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type App struct {
	Config   config.Config
	Database *database.Postgres
	Redis    *database.Redis
}

func New(appConfig config.Config) (*App, *database.Postgres) {
	log.Println("Starting Postgres")
	db, err := database.NewPostgres(appConfig.PostgreSQL)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Starting Redis")
	redis, err := database.NewRedis(appConfig.RedisDB)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Databases started succesfully")
	return &App{appConfig, db, redis}, db
}

func (a *App) Run(r *mux.Router) {
	headersOk := handlers.AllowedHeaders([]string{"Authorization", "Content-Type", "X-Requested-With"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})
	port := a.Config.Port
	addr := fmt.Sprintf(":%v", port)
	fmt.Printf("APP is listening on port: %d\n", port)
	log.Fatal(http.ListenAndServe(addr, handlers.CORS(originsOk, headersOk, methodsOk)(r)))
}

func (a *App) IsProd() bool {
	return a.Config.Env == "prod"
}
