package middleware

import (
	"net/http"
)

func SetCache(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "max-age=120") // 2 min
		next.ServeHTTP(w, r)
	})
}
