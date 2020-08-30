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

// App holds the Config struct and database connections for Postgres and Redis
type App struct {
	Config   config.Config
	Database *database.Postgres
	Redis    *database.Redis
}

// New connects to the databases and stores the connection in the returned
// App struct
func New(appConfig config.Config) *App {
	log.Println("Connecting to Postgres...")
	db, err := database.NewPostgres(appConfig.PostgreSQL)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connecting to Redis...")
	redis, err := database.NewRedis(appConfig.RedisDB)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Successfully connected to databases")
	return &App{appConfig, db, redis}
}

// Run sets up CORS policy and allows the API listen and serve
func (a *App) Run(r *mux.Router) {
	headersOk := handlers.AllowedHeaders([]string{"Authorization", "Content-Type", "X-Requested-With"})
	originsOk := handlers.AllowedOrigins(a.Config.AllowedOrigins)
	log.Println("Allowed origins:", a.Config.AllowedOrigins)
	methodsOk := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"})
	port := a.Config.Port
	addr := fmt.Sprintf(":%v", port)

	fmt.Printf("API is listening on port: %v\n", port)
	log.Fatal(http.ListenAndServe(addr, handlers.CORS(originsOk, headersOk, methodsOk, handlers.AllowCredentials())(r)))
}

// IsProd returns if the App struct is configured for production
func (a *App) IsProd() bool {
	return a.Config.Env == "prod"
}
