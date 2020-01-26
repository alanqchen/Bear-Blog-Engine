package util

import (
	"crypto/md5"
	"encoding/hex"
	"net/http"
	"regexp"
	"strings"

	"github.com/rainycape/unidecode"
)

func GenerateSlug(title string) string {
	slug := unidecode.Unidecode(title)
	slug = strings.ToLower(slug)
	re := regexp.MustCompile("[^a-z0-9]+")
	slug = re.ReplaceAllString(slug, "-")
	slug = strings.Trim(slug, "-")

	return slug
}

func GetMD5Hash(text string) string {
	hasher := md5.New()
	hasher.Write([]byte(text))
	return hex.EncodeToString(hasher.Sum(nil))
}

func GetRequestScheme(r *http.Request) string {
	isHTTPS := r.Header.Get("X-Forwarded-Proto") == "https"
	if isHTTPS {
		return "https://"
	}

	return "http://"
}

func IsEmail(email string) bool {
	const emailRegex = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
	if m, _ := regexp.MatchString(emailRegex, email); !m {
		return false
	}

	return true
}
