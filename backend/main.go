package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/alanqchen/Bear-Post/backend/app"
	"github.com/alanqchen/Bear-Post/backend/config"
	"github.com/alanqchen/Bear-Post/backend/database"
	"github.com/alanqchen/Bear-Post/backend/routes"
)

/* Big thanks to steffen for Backend File Structure from https://github.com/steffen25/golang.zone. Used
 * w/ permission through MIT Liscense
 */

func main() {
	fmt.Println("Starting up")
	cfg, err := config.New("config/app.json")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Creating app")
	time := time.Now()
	fmt.Println(time)
	var db *database.Postgres
	app, db := app.New(cfg)
	defer db.Close(context.Background())
	fmt.Println("Creating routes")
	router := routes.NewRouter(app)
	fmt.Println("Running app...")
	app.Run(router)
}
