package middleware

import (
	"net/http"
)

// SetCache is the middleware function for setting the cache header on file requests
func SetCache(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "max-age=120") // 2 min
		next.ServeHTTP(w, r)
	})
}
