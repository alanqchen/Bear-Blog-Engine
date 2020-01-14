package main

import (
    "fmt"
    "net/http"
)

func setupRoutes() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Simple Server")
    })
}

func main() {
    setupRoutes()
    http.ListenAndServe(":8080", nil)
}

