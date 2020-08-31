package app

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/alanqchen/Bear-Post/backend/config"
	"github.com/alanqchen/Bear-Post/backend/database"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"gopkg.in/ezzarghili/recaptcha-go.v4"
)

// App holds the Config struct, database connections for Postgres and Redis
// and the reCaptcha configuration
type App struct {
	Config    config.Config
	Database  *database.Postgres
	Redis     *database.Redis
	Recaptcha recaptcha.ReCAPTCHA
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

	log.Println("Setting up ReCaptcha...")
	captcha, err := recaptcha.NewReCAPTCHA(appConfig.CaptchaSecret, recaptcha.V2, 10*time.Second)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Successfully set ReCaptcha secret")

	return &App{appConfig, db, redis, captcha}
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
