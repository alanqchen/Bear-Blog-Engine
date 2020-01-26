package middleware

import (
	"log"
	"net/http"
	"time"
)

func Logger(next http.HandlerFunc) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		start := time.Now()
		next(res, req)
		log.Printf("[%s] %q %v\n", req.Method, req.URL.String(), time.Since(start))
	}
}
