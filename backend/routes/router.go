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

// NewRouter creates the routes for the API
// See the API documentation on the GitHub repo wiki for a user-friendly list
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
	ec := controllers.NewErrorController(a)
	log.Println("Loaded Contollers")
	r.HandleFunc("/", middleware.Logger(uc.HelloWorld)).Methods(http.MethodGet)

	// Public assets
	r.Path("/assets/images/{format:.*\\.webp$}").Handler(http.StripPrefix("/assets/images/", middleware.SetCache(http.FileServer(http.Dir("./public/images/webp")))))
	r.PathPrefix("/assets/images").Handler(http.StripPrefix("/assets/images", middleware.SetCache(http.FileServer(http.Dir("./public/images/original")))))
	r.PathPrefix("/assets/videos").Handler(http.StripPrefix("/assets/videos", middleware.SetCache(http.FileServer(http.Dir("./public/videos/")))))
	//r.PathPrefix("/public").Handler(http.StripPrefix("/public/", http.FileServer(http.Dir("./public/images/"))))

	api := r.PathPrefix("/api/v1").Subrouter()

	// Uploads
	api.HandleFunc("/images/upload", middleware.Logger(middleware.RequireAuthentication(a, uploadController.UploadImage, false))).Methods(http.MethodPost)
	api.HandleFunc("/videos/upload", middleware.Logger(middleware.RequireAuthentication(a, uploadController.UploadVideo, false))).Methods(http.MethodPost)
	log.Println("Created media uploads route")
	// Users
	api.HandleFunc("/users", middleware.Logger(middleware.RequireAuthentication(a, uc.GetAll, false))).Methods(http.MethodGet)
	api.HandleFunc("/users/detailed", middleware.Logger(middleware.RequireAuthentication(a, uc.GetAllDetailed, true))).Methods(http.MethodGet)
	api.HandleFunc("/users", middleware.Logger(middleware.RequireAuthentication(a, uc.Create, true))).Methods(http.MethodPost)
	api.HandleFunc("/users/setup", middleware.Logger(uc.CreateFirstAdmin)).Methods(http.MethodPost)
	api.HandleFunc("/users/{id}", middleware.Logger(uc.GetByID)).Methods(http.MethodGet)
	api.HandleFunc("/users/{id}/detailed", middleware.Logger(middleware.RequireAuthentication(a, uc.GetByIDDetailed, true))).Methods(http.MethodGet)
	api.HandleFunc("/users/{id}", middleware.Logger(middleware.RequireAuthentication(a, uc.Delete, true))).Methods(http.MethodDelete)
	//api.HandleFunc("/users/{id}/posts", middleware.Logger(uc.FindPostsByUser)).Methods(http.MethodGet)
	api.HandleFunc("/protected", middleware.Logger(middleware.RequireAuthentication(a, uc.Profile, false))).Methods(http.MethodGet)
	log.Println("Created users routes")
	// Posts
	api.HandleFunc("/posts/get", middleware.Logger(pc.GetPage)).Methods(http.MethodGet)
	api.HandleFunc("/posts/admin/get", middleware.Logger(middleware.RequireAuthentication(a, pc.GetPageAdmin, false))).Methods(http.MethodGet)
	api.HandleFunc("/posts/search", middleware.Logger(pc.Search)).Methods(http.MethodGet)
	api.HandleFunc("/posts/{id:[0-9]+}", middleware.Logger(pc.GetByID)).Methods(http.MethodGet)
	api.HandleFunc("/posts/admin/{id:[0-9]+}", middleware.Logger(middleware.RequireAuthentication(a, pc.GetByIDAdmin, false))).Methods(http.MethodGet)
	api.HandleFunc("/posts/admin/{slug:[a-zA-Z0-9=\\-\\/]+}", middleware.Logger(middleware.RequireAuthentication(a, pc.GetBySlugAdmin, false))).Methods(http.MethodGet)
	api.HandleFunc("/posts/{slug:[a-zA-Z0-9=\\-\\/]+}", middleware.Logger(pc.GetBySlug)).Methods(http.MethodGet)
	api.HandleFunc("/posts", middleware.Logger(middleware.RequireAuthentication(a, pc.Create, false))).Methods(http.MethodPost)
	api.HandleFunc("/posts/{id:[0-9]+}", middleware.Logger(middleware.RequireAuthentication(a, pc.Update, false))).Methods(http.MethodPut)
	api.HandleFunc("/posts/delete/{id:[0-9]+}", middleware.Logger(middleware.RequireAuthentication(a, pc.Delete, false))).Methods(http.MethodDelete)
	log.Println("Created posts routes")
	// Authentication
	auth := api.PathPrefix("/auth").Subrouter()
	auth.HandleFunc("/login", middleware.Logger(ac.Authenticate)).Methods(http.MethodPost)
	auth.HandleFunc("/refresh", middleware.Logger(middleware.RequireRefreshToken(a, ac.RefreshTokens))).Methods(http.MethodGet)
	auth.HandleFunc("/update", middleware.Logger(middleware.RequireAuthentication(a, uc.Update, true))).Methods(http.MethodPut)
	auth.HandleFunc("/logout", middleware.Logger(middleware.RequireAuthentication(a, ac.Logout, false))).Methods(http.MethodGet)
	auth.HandleFunc("/logout/all", middleware.Logger(middleware.RequireAuthentication(a, ac.LogoutAll, true))).Methods(http.MethodGet)
	auth.HandleFunc("/verify", middleware.Logger(ac.VerifyCaptcha)).Methods(http.MethodPost)
	// No Match
	r.NotFoundHandler = http.HandlerFunc(middleware.Logger(ec.NotFound))
	log.Println("Created authentication routes")
	return r
}
