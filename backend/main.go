package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/alanqchen/Bear-Post/backend/app"
	"github.com/alanqchen/Bear-Post/backend/config"
	"github.com/alanqchen/Bear-Post/backend/graph"
	"github.com/alanqchen/Bear-Post/backend/graph/generated"
	"github.com/alanqchen/Bear-Post/backend/routes"
)

/*
 * BEARPOST API - main.go
 * @author Alan Chen
 *
 * This handles calling the initialization steps and starting the API
 *
 * Big thanks to sjoshi6 and steffen for Backend File Structure from
 * https://github.com/sjoshi6/go-rest-api-boilerplate/ and
 * https://github.com/steffen25/golang.zone.
 *
 * See the API documentation on the GitHub repo wiki for a list of the API
 * routes.
 */

func main() {
	Reference()
	return
	log.Println("Starting up API...")
	var cfg config.Config
	var err error
	log.Println("Looking for a config file")

	if _, err := os.Stat("config/app-custom.json"); !os.IsNotExist(err) {
		log.Println("Using config/app-custom.json")
		cfg, err = config.New("config/app-custom.json")
	} else if _, err := os.Stat("config/app.json"); !os.IsNotExist(err) {
		log.Println("Using config/app.json")
		cfg, err = config.New("config/app.json")
	} else if _, err := os.Stat("../app.json"); !os.IsNotExist(err) {
		log.Println("Using ../app.json")
		cfg, err = config.New("../app.json")
	} else if _, err := os.Stat("config/app-docker.json"); !os.IsNotExist(err) {
		log.Println("Using config/app-docker.json")
		cfg, err = config.New("config/app-docker.json")
	} else {
		log.Fatal("[FATAL] Failed to find config/app-custom.json or config/app.json or config/app-docker or ../app.json")
	}
	if err != nil {
		log.Fatal("Failed to create config:", err)
	}

	log.Println("Creating api")

	app := app.New(cfg)
	defer app.Database.Close()
	log.Println("Creating routes")
	router := routes.NewRouter(app)
	log.Println("Running api...")
	app.Run(router)
}

const defaultPort = "8090"

func Reference() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
