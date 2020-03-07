package main

import (
	"context"
	"log"

	"github.com/alanqchen/Bear-Post/backend/app"
	"github.com/alanqchen/Bear-Post/backend/config"
	"github.com/alanqchen/Bear-Post/backend/database"
	"github.com/alanqchen/Bear-Post/backend/routes"
)

/* Big thanks to steffen for Backend File Structure from https://github.com/steffen25/golang.zone. Used
 * w/ permission through MIT Liscense
 */

func main() {
	log.Println("Starting up")
	cfg, err := config.New("config/app.json")
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Creating app")

	var db *database.Postgres
	app, db := app.New(cfg)
	defer db.Close(context.Background())
	log.Println("Creating routes")
	router := routes.NewRouter(app)
	log.Println("Running app...")
	app.Run(router)
}
