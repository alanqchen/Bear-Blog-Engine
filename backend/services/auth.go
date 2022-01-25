package services

import (
	"bufio"
	"context"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/alanqchen/Bear-Post/backend/config"
	"github.com/alanqchen/Bear-Post/backend/database"
	"github.com/alanqchen/Bear-Post/backend/models"
	"github.com/alanqchen/Bear-Post/backend/util"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt/v4"
	"github.com/golang-jwt/jwt/v4/request"
)

// KAuthTokenClaims stores the claims associated with a token
type KAuthTokenClaims struct {
	jwt.StandardClaims
	UID       string `json:"id"`
	Admin     bool   `json:"admin"`
	TokenHash string `json:"tokenHash"`
}

// AccessToken stores the access token
type AccessToken struct {
	AccessToken string `json:"accessToken"`
}

// RefreshToken stores the refresh token
type RefreshToken struct {
	RefreshToken string `json:"refreshToken"`
}

// Tokens stores the access and refresh tokens, experation, and type
type Tokens struct {
	AccessToken  string  `json:"accessToken"`
	RefreshToken string  `json:"refreshToken"`
	ExpiresIn    float64 `json:"expiresIn"`
	TokenType    string  `json:"tokenType"`
}

type userCtxKeyType string

// Various token constants
const (
	TokenDuration                       = time.Hour
	RefreshTokenDuration                = time.Hour * 72
	TokenType                           = "Bearer"
	userCtxKey           userCtxKeyType = "user"
	userIDCtxKey         userCtxKeyType = "userId"
)

// JWTAuthService is the public interface for auth services
type JWTAuthService interface {
	GenerateTokens(u *models.User) (*Tokens, error)
}

// Stores the HMAC secret, RSA keys, and Redis connection
// Note that HMAC is used for the access token, RSA for the refresh token
type jwtAuthService struct {
	secret     string
	privateKey *rsa.PrivateKey
	PublicKey  *rsa.PublicKey
	Redis      *database.Redis
}

// NewJWTAuthService returns a new JWT auth service
func NewJWTAuthService(jwtCfg *config.JWTConfig, redis *database.Redis) JWTAuthService {
	return &jwtAuthService{
		jwtCfg.Secret,
		getPrivateKey(jwtCfg),
		getPublicKey(jwtCfg),
		redis,
	}
}

// GenerateTokens returns new tokens for the given user
func (jwtService *jwtAuthService) GenerateTokens(u *models.User) (*Tokens, error) {
	uid := u.ID.String()
	now := time.Now()
	// Gen UUID for JWT
	uuidJWT, err := uuid.NewV4()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	tokenHash := util.GetMD5Hash(now.String() + uid)
	authClaims := KAuthTokenClaims{
		jwt.StandardClaims{
			Id:        uid + "." + uuidJWT.String(),
			ExpiresAt: now.Add(TokenDuration).Unix(), // 1 Hour
			IssuedAt:  now.Unix(),
		},
		u.ID.String(),
		u.Admin,
		tokenHash,
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, authClaims)

	accessTokenString, err := accessToken.SignedString([]byte(jwtService.secret))
	if err != nil {
		log.Println(err)
		return nil, err
	}

	err = jwtService.Redis.Set(tokenHash+"."+authClaims.Id, u.ID, TokenDuration).Err()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	// Gen UUID for refresh token
	uuidJWT, err = uuid.NewV4()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	refreshToken := jwt.New(jwt.SigningMethodRS512)
	authClaims.Id = uid + "." + uuidJWT.String()
	authClaims.ExpiresAt = now.Add(RefreshTokenDuration).Unix()
	refreshToken.Claims = authClaims
	refreshTokenString, err := refreshToken.SignedString(jwtService.privateKey)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	err = jwtService.Redis.Set(tokenHash+"."+authClaims.Id, u.ID, RefreshTokenDuration).Err()
	if err != nil {
		log.Println(err)
		return nil, err
	}

	tokens := &Tokens{
		accessTokenString,
		refreshTokenString,
		3600,
		TokenType,
	}

	return tokens, nil
}

/*
func (jwtService *jwtAuthService) GenerateResetToken(u *models.User) (*Tokens, error) {
	hashPassword := u.GetHashedPassword()
	dateString := u.GetCreationTime().String()
	secretKey := hashPassword + dateString
	uid := strconv.Itoa(u.ID) // payload
	now := time.Now()
	tokenHash := util.GetMD5Hash(now.String() + uid)
	authClaims := KAuthTokenClaims{
		jwt.StandardClaims{
			Id:        uid + "." + uuid.NewV4().String(),
			ExpiresAt: now.Add(TokenDuration).Unix(), // 1 Hour
			IssuedAt:  now.Unix(),
		},
		u.ID,
		u.Admin,
		tokenHash,
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, authClaims)

	accessTokenString, err := accessToken.SignedString([]byte(secretKey))
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	err = jwtService.Redis.Set(tokenHash+"."+authClaims.Id, u.ID, TokenDuration).Err()
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	refreshToken := jwt.New(jwt.SigningMethodRS512)
	authClaims.Id = uid + "." + uuid.NewV4().String()
	authClaims.ExpiresAt = now.Add(RefreshTokenDuration).Unix()
	refreshToken.Claims = authClaims
	refreshTokenString, err := refreshToken.SignedString(jwtService.privateKey)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	err = jwtService.Redis.Set(tokenHash+"."+authClaims.Id, u.ID, RefreshTokenDuration).Err()
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	tokens := &Tokens{
		accessTokenString,
		refreshTokenString,
		3600,
		TokenType,
	}

	return tokens, nil
}
*/

// ExtractTokenHash returns the access token hash from the given signed token string
// Signing method is HMAC
func ExtractTokenHash(cfg *config.Config, tokenStr string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		// check token signing method etc
		return []byte(cfg.JWT.Secret), nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims["tokenHash"].(string), nil
	}

	return "", err
}

// ExtractRefreshTokenHash returns the refresh token hash from the given signed token string
// Signing method is RSA
func ExtractRefreshTokenHash(cfg *config.Config, tokenStr string) (string, error) {
	publicKeyFile, err := os.Open(cfg.JWT.PublicKey)
	if err != nil {
		panic(err)
	}

	pemfileinfo, _ := publicKeyFile.Stat()
	var size int64 = pemfileinfo.Size()
	pembytes := make([]byte, size)

	buffer := bufio.NewReader(publicKeyFile)
	_, err = buffer.Read(pembytes)
	if err != nil {
		return "", err
	}

	data, _ := pem.Decode([]byte(pembytes))

	publicKeyFile.Close()

	publicKeyImported, err := x509.ParsePKIXPublicKey(data.Bytes)

	if err != nil {
		return "", err
	}

	rsaPub, ok := publicKeyImported.(*rsa.PublicKey)
	if !ok {
		return "", fmt.Errorf("Failed to import public key")
	}

	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		// check token signing method etc
		return rsaPub, nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims["tokenHash"].(string), nil
	}

	return "", err
}

// GetTokenFromRequest returns the access token string from the request header
// Signing method is HMAC
func GetTokenFromRequest(cfg *config.Config, r *http.Request) (string, error) {
	token, err := request.ParseFromRequest(r, request.AuthorizationHeaderExtractor,
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}

			return []byte(cfg.JWT.Secret), nil
		})

	if err != nil || !token.Valid {
		return "", err
	}

	return token.Raw, nil

}

// GetRefreshTokenFromRequest returns the refresh token string from the request header
// Signing method is RSA
func GetRefreshTokenFromRequest(cfg *config.Config, r *http.Request) (string, error) {
	publicKeyFile, err := os.Open(cfg.JWT.PublicKey)
	if err != nil {
		panic(err)
	}

	pemfileinfo, _ := publicKeyFile.Stat()
	var size int64 = pemfileinfo.Size()
	pembytes := make([]byte, size)

	buffer := bufio.NewReader(publicKeyFile)
	_, err = buffer.Read(pembytes)
	if err != nil {
		return "", err
	}

	data, _ := pem.Decode([]byte(pembytes))

	publicKeyFile.Close()

	publicKeyImported, err := x509.ParsePKIXPublicKey(data.Bytes)

	if err != nil {
		return "", err
	}

	rsaPub, ok := publicKeyImported.(*rsa.PublicKey)

	if !ok {
		return "", fmt.Errorf("Failed to import public key")
	}
	token, err := request.ParseFromRequest(r, request.AuthorizationHeaderExtractor,
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}

			return rsaPub, nil
		})

	if err != nil || !token.Valid {
		return "", err
	}

	return token.Raw, nil

}

// ContextWithUserID returns the copy of the given context with the id key value being the uid
func ContextWithUserID(ctx context.Context, uID string) context.Context {
	return context.WithValue(ctx, userIDCtxKey, uID)
}

// UserIDFromContext returns the uid from the context id key
func UserIDFromContext(ctx context.Context) (string, error) {
	uID, ok := ctx.Value(userIDCtxKey).(string)
	if !ok {
		log.Println("Context missing userID")
		return "", errors.New("[SERVICE]: Context missing userID")
	}

	return uID, nil
}

// ContextWithUser returns the copy of the given context with the user key value being the user
func ContextWithUser(ctx context.Context, u *models.User) context.Context {
	return context.WithValue(ctx, userCtxKey, u)
}

// UserFromContext returns the uid from the context user key
func UserFromContext(ctx context.Context) (*models.User, error) {
	u, ok := ctx.Value(userCtxKey).(*models.User)
	if !ok {
		log.Println("Context missing user")
		return nil, errors.New("[SERVICE]: Context missing user")
	}

	return u, nil
}

// Parses the RSA private key
func getPrivateKey(jwtConfig *config.JWTConfig) *rsa.PrivateKey {
	privateKeyFile, err := os.Open(jwtConfig.PrivateKey)
	if err != nil {
		log.Fatal("Failed to open private key:", err)
	}

	pemfileinfo, _ := privateKeyFile.Stat()
	var size int64 = pemfileinfo.Size()
	pembytes := make([]byte, size)
	// Read file
	buffer := bufio.NewReader(privateKeyFile)
	_, err = buffer.Read(pembytes)
	if err != nil {
		log.Fatal("Failed to read private key file:", err)
	}
	// Decode
	data, _ := pem.Decode([]byte(pembytes))
	// Close file
	privateKeyFile.Close()
	//Parse key
	privateKeyImported, err := x509.ParsePKCS1PrivateKey(data.Bytes)

	if err != nil {
		log.Fatal(err)
	}
	//rsaPrivate, ok := privateKeyImported.(*rsa.PrivateKey)
	//if !ok {
	//	log.Fatal(err)
	//}
	log.Println("Private key imported successfully")
	return privateKeyImported
}

// Parses the RSA public key
func getPublicKey(jwtConfig *config.JWTConfig) *rsa.PublicKey {
	publicKeyFile, err := os.Open(jwtConfig.PublicKey)
	if err != nil {
		log.Fatal("Failed to open public key:", err)
	}

	pemfileinfo, _ := publicKeyFile.Stat()
	var size int64 = pemfileinfo.Size()
	pembytes := make([]byte, size)

	buffer := bufio.NewReader(publicKeyFile)
	_, err = buffer.Read(pembytes)
	if err != nil {
		log.Fatal("Failed to read public key file:", err)
	}

	data, _ := pem.Decode([]byte(pembytes))

	publicKeyFile.Close()

	// Parse public key

	publicKeyImported, err := x509.ParsePKIXPublicKey(data.Bytes)

	if err != nil {
		log.Fatal(err)
	}
	log.Println("Public key imported successfully")

	rsaPub, ok := publicKeyImported.(*rsa.PublicKey)

	if !ok {
		log.Fatal(err)
	}

	return rsaPub
}
