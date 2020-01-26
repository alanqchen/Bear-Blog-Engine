package main

import (
	"fmt"
	"log"

	"github.com/alanqchen/MGBlog/backend/app"
	"github.com/alanqchen/MGBlog/backend/config"
	"github.com/alanqchen/MGBlog/backend/routes"
)

func main() {
	fmt.Println("Starting up")
	cfg, err := config.New("config/app.json")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Creating app")
	app := app.New(cfg)
	fmt.Println("Creating routes")
	router := routes.NewRouter(app)
	fmt.Println("Running app...")
	app.Run(router)
}
