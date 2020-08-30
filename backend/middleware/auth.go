package middleware

import (
	"bufio"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/alanqchen/Bear-Post/backend/app"
	"github.com/alanqchen/Bear-Post/backend/controllers"
	"github.com/alanqchen/Bear-Post/backend/services"
	"github.com/dgrijalva/jwt-go"
	"github.com/dgrijalva/jwt-go/request"
)

// RequireAuthentication is the middleware function for routes that require a bearer token
func RequireAuthentication(a *app.App, next http.HandlerFunc, admin bool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		t, err := request.ParseFromRequest(r, request.AuthorizationHeaderExtractor,
			func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					log.Println("[BAD AUTH] Unexpected signing method:", token.Header["alg"])
					return nil, fmt.Errorf("[ERROR] Unexpected signing method: %v", token.Header["alg"])
				}

				return []byte(a.Config.JWT.Secret), nil
			})

		if err != nil {
			if err == request.ErrNoTokenInRequest {
				log.Println("[BAD AUTH] Missing token")
				controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Missing token", Status: http.StatusUnauthorized}, w)
				return
			}
			log.Println("[BAD AUTH] Invalid token")
			controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Invalid token", Status: http.StatusUnauthorized}, w)
			return
		}

		if claims, ok := t.Claims.(jwt.MapClaims); ok && t.Valid {
			jti, ok := claims["jti"].(string)
			if !ok {
				log.Println("[BAD AUTH] Bad jti type")
				controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Bad jti type", Status: http.StatusBadRequest}, w)
				return
			}
			tokenHash, ok := claims["tokenHash"].(string)
			if !ok {
				log.Println("[BAD AUTH] Bad token hash type")
				controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Bad token hash type", Status: http.StatusBadRequest}, w)
				return
			}
			val, err := a.Redis.Get(tokenHash + "." + jti).Result()
			if err != nil || val == "" {
				log.Println("[BAD AUTH] Invalid token v2")
				controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Invalid token", Status: http.StatusUnauthorized}, w)
				return
			}
			// TODO: Put the user into the context instead of the user id? Right now we only need to reference to the id of the user that is logged in
			// maybe put the json representation of the user inside redis and use the 'val' here
			/*user := &models.User{}
			err = json.Unmarshal([]byte(val), &user)
			if err != nil {
				controllers.NewAPIError(&controllers.APIError{false, "Something went wrong", http.StatusInternalServerError}, w)
				return
			}
			ctx := services.ContextWithUser(r.Context(), user)*/
			uid, ok := claims["id"].(string)
			if !ok {
				log.Println("[BAD AUTH] Bad id type")
				controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Bad id type", Status: http.StatusBadRequest}, w)
				return
			}
			/*db, err := database.NewDB(cfg.Database)
			if err != nil {
				controllers.NewAPIError(&controllers.APIError{false, "Something went wrong", http.StatusInternalServerError}, w)
				return
			}
			userRepo := repositories.NewUserRespository(db)
			user, err := userRepo.FindById(uid)
			if err != nil {
				controllers.NewAPIError(&controllers.APIError{false, "Something went wrong", http.StatusInternalServerError}, w)
				return
			}
			ctx := services.ContextWithUser(r.Context(), user)*/
			ctx := services.ContextWithUserID(r.Context(), uid)
			if !admin {
				next(w, r.WithContext(ctx))
				return
			}
			// Check if the user's token has admin true
			isAdmin := claims["admin"].(bool)
			if !isAdmin {
				log.Println("[BAD AUTH] Not an admin - uid:", uid)
				controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Admin required", Status: http.StatusForbidden}, w)
				return
			}
			next(w, r.WithContext(ctx))
		}
	}
}

// RequireRefreshToken is the middleware function for routes that require a refresh token
func RequireRefreshToken(a *app.App, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		publicKeyFile, err := os.Open(a.Config.JWT.PublicKey)
		if err != nil {
			log.Println(err)
			controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Failed to verify token", Status: http.StatusInternalServerError}, w)
			return
		}

		pemfileinfo, _ := publicKeyFile.Stat()
		var size int64 = pemfileinfo.Size()
		pembytes := make([]byte, size)

		buffer := bufio.NewReader(publicKeyFile)
		_, err = buffer.Read(pembytes)
		if err != nil {
			log.Println(err)
			controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Failed to verify token", Status: http.StatusInternalServerError}, w)
			return
		}

		data, _ := pem.Decode([]byte(pembytes))

		publicKeyFile.Close()

		publicKeyImported, err := x509.ParsePKIXPublicKey(data.Bytes)

		if err != nil {
			log.Println(err)
			controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Failed to verify token", Status: http.StatusInternalServerError}, w)
			return
		}

		rsaPub, ok := publicKeyImported.(*rsa.PublicKey)

		if !ok {
			log.Println("Failed to import public key")
			controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Failed to verify token", Status: http.StatusInternalServerError}, w)
			return
		}

		t, err := request.ParseFromRequest(r, request.AuthorizationHeaderExtractor,
			func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
					return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
				}

				return rsaPub, nil
			})

		if err != nil {
			if err == request.ErrNoTokenInRequest {
				controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Missing token", Status: http.StatusUnauthorized}, w)
				return
			}

			controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Invalid token", Status: http.StatusUnauthorized}, w)
			return
		}

		if claims, ok := t.Claims.(jwt.MapClaims); ok && t.Valid {
			jti, ok := claims["jti"].(string)
			if !ok {
				controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Bad jti type", Status: http.StatusBadRequest}, w)
				return
			}
			tokenHash, ok := claims["tokenHash"].(string)
			if !ok {
				controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Bad token hash type", Status: http.StatusBadRequest}, w)
				return
			}
			val, err := a.Redis.Get(tokenHash + "." + jti).Result()
			if err != nil || val == "" {
				controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Invalid token", Status: http.StatusUnauthorized}, w)
				return
			}

			uid, ok := claims["id"].(string)
			if !ok {
				controllers.NewAPIError(&controllers.APIError{Success: false, Message: "Bad id type", Status: http.StatusBadRequest}, w)
				return
			}
			ctx := services.ContextWithUserID(r.Context(), uid)
			next(w, r.WithContext(ctx))
		}
	}
}
