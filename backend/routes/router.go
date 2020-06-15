package routes

import (
	"log"
	"net/http"

	"github.com/alanqchen/Bear-Post/backend/app"
	"github.com/alanqchen/Bear-Post/backend/controllers"
	"github.com/alanqchen/Bear-Post/backend/middleware"
	"github.com/alanqchen/Bear-Post/backend/repositories"
	"github.com/alanqchen/Bear-Post/backend/services"
	"github.com/gorilla/mux"
)

const (
	AssetFolder = "/public/"
)

func NewRouter(a *app.App) *mux.Router {
	r := mux.NewRouter()
	log.Println("Loaded router")
	// Repositories
	ur := repositories.NewUserRespository(a.Database)
	pr := repositories.NewPostRepository(a.Database)
	log.Println("Loaded Repositories")
	// Services
	jwtAuth := services.NewJWTAuthService(&a.Config.JWT, a.Redis)
	log.Println("Loaded Services")
	// Controllers
	ac := controllers.NewAuthController(a, ur, jwtAuth)
	uc := controllers.NewUserController(a, ur, pr)
	pc := controllers.NewPostController(a, pr, ur)
	uploadController := controllers.NewUploadController()
	log.Println("Loaded Contollers")
	r.HandleFunc("/", middleware.Logger(uc.HelloWorld)).Methods(http.MethodGet)

	// media routes, might change later
	r.PathPrefix("/assets/images").Handler(http.StripPrefix("/assets/images", http.FileServer(http.Dir("./public/images/"))))
	r.PathPrefix("/assets/videos").Handler(http.StripPrefix("/assets/videos", http.FileServer(http.Dir("./public/videos/"))))
	//r.PathPrefix("/public").Handler(http.StripPrefix("/public/", http.FileServer(http.Dir("./public/images/"))))

	api := r.PathPrefix("/api/v1").Subrouter()

	// Uploads
	api.HandleFunc("/images/upload", middleware.Logger(middleware.RequireAuthentication(a, uploadController.UploadImage, true))).Methods(http.MethodPost)
	api.HandleFunc("/videos/upload", middleware.Logger(middleware.RequireAuthentication(a, uploadController.UploadVideo, true))).Methods(http.MethodPost)
	log.Println("Created media uploads route")
	// Users
	api.HandleFunc("/users", middleware.Logger(uc.GetAll)).Methods(http.MethodGet)
	api.HandleFunc("/users", middleware.Logger(uc.Create)).Methods(http.MethodPost)
	api.HandleFunc("/users/{id}", middleware.Logger(uc.GetById)).Methods(http.MethodGet)
	//api.HandleFunc("/users/{id}/posts", middleware.Logger(uc.FindPostsByUser)).Methods(http.MethodGet)
	api.HandleFunc("/protected", middleware.Logger(middleware.RequireAuthentication(a, uc.Profile, false))).Methods(http.MethodGet)
	log.Println("Created users routes")
	// Posts
	api.HandleFunc("/posts/get", middleware.Logger(pc.GetAll)).Methods(http.MethodPost)
	api.HandleFunc("/posts/{id:[0-9]+}", middleware.Logger(pc.GetById)).Methods(http.MethodGet)
	api.HandleFunc("/posts/admin/{id:[0-9]+}", middleware.Logger(middleware.RequireAuthentication(a, pc.GetByIdAdmin, true))).Methods(http.MethodGet)
	api.HandleFunc("/posts/{slug:[a-zA-Z0-9=\\-\\/]+}", middleware.Logger(pc.GetBySlug)).Methods(http.MethodGet)
	api.HandleFunc("/posts/admin/{slug:[a-zA-Z0-9=\\-\\/]+}", middleware.Logger(middleware.RequireAuthentication(a, pc.GetBySlugAdmin, true))).Methods(http.MethodGet)
	api.HandleFunc("/posts", middleware.Logger(middleware.RequireAuthentication(a, pc.Create, true))).Methods(http.MethodPost)
	api.HandleFunc("/posts/{id}", middleware.Logger(middleware.RequireAuthentication(a, pc.Update, true))).Methods(http.MethodPut)
	api.HandleFunc("/posts/delete/{id}", middleware.Logger(middleware.RequireAuthentication(a, pc.Delete, true))).Methods(http.MethodPost)
	//api.HandleFunc("/posts/search", middleware.Logger(pc.Search)).Methods(http.MethodGet)
	log.Println("Created posts routes")
	// Authentication
	auth := api.PathPrefix("/auth").Subrouter()
	auth.HandleFunc("/login", middleware.Logger(ac.Authenticate)).Methods(http.MethodPost)
	auth.HandleFunc("/refresh", middleware.Logger(middleware.RequireRefreshToken(a, ac.RefreshTokens))).Methods(http.MethodGet)
	auth.HandleFunc("/update", middleware.Logger(middleware.RequireAuthentication(a, uc.Update, false))).Methods(http.MethodPut)
	auth.HandleFunc("/logout", middleware.Logger(middleware.RequireAuthentication(a, ac.Logout, false))).Methods(http.MethodGet)
	auth.HandleFunc("/logout/all", middleware.Logger(middleware.RequireAuthentication(a, ac.LogoutAll, false))).Methods(http.MethodGet)
	log.Println("Created authentication routes")
	return r
}
