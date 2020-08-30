package middleware

import (
	"log"
	"net/http"
	"time"

	"github.com/alanqchen/Bear-Post/backend/util"
)

// Logger is the middleware function for logging requests
func Logger(next http.HandlerFunc) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		start := time.Now()
		next(res, req)
		ip := util.GetIP(req)
		if ip != "" {
			log.Printf("[%s] [%v] %q %v\n", req.Method, ip, req.URL.String(), time.Since(start))
		} else {
			log.Printf("[%s] [IP unknown] %q %v\n", req.Method, req.URL.String(), time.Since(start))
		}
	}
}
