package main

import (
	"context"
	"fmt"
	"log"

	"github.com/alanqchen/MGBlog/backend/app"
	"github.com/alanqchen/MGBlog/backend/config"
	"github.com/alanqchen/MGBlog/backend/database"
	"github.com/alanqchen/MGBlog/backend/routes"
)

func main() {
	fmt.Println("Starting up")
	cfg, err := config.New("config/app.json")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Creating app")
	var db *database.Postgres
	app, db := app.New(cfg)
	defer db.Close(context.Background())
	fmt.Println("Creating routes")
	router := routes.NewRouter(app)
	fmt.Println("Running app...")
	app.Run(router)
}
