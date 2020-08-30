package controllers

import (
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
)

// BaseController is the common interface for all controllers
// https://github.com/sjoshi6/go-rest-api-boilerplate/blob/master/controllers/base.go
/*type ControllerServiceProvider interface {
	Get(w http.ResponseWriter, r *http.Request)
	GetAll(w http.ResponseWriter, r *http.Request)
	Post(w http.ResponseWriter, r *http.Request)
	Put(w http.ResponseWriter, r *http.Request)
	Delete(w http.ResponseWriter, r *http.Request)
}*/

// APIResponse is the struct to use when sending an API response
type APIResponse struct {
	Success    bool           `json:"success"`
	Message    string         `json:"message,omitempty"`
	Data       interface{}    `json:"data,omitempty"`
	Pagination *APIPagination `json:"pagination,omitempty"`
}

// APIError is the struct the struct to use when sending an API error
type APIError struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Status  int    `json:"status"`
}

// JSONData stores a representation of JSON data
type JSONData struct {
	data map[string]interface{}
}

// APIPagination stores the extra data to return in a pagination response
type APIPagination struct {
	Total   int      `json:"total"`
	PerPage int      `json:"perPage"`
	MinID   int      `json:"minID"`
	Tags    []string `json:"tags"`
}

// MarshalJSON marshals a APIPagination struct
func (p *APIPagination) MarshalJSON() ([]byte, error) {

	return json.Marshal(struct {
		Total   int `json:"total"`
		PerPage int `json:"perPage"`
		MinID   int `json:"minID"`
	}{p.Total, p.PerPage, p.MinID})
}

// GetJSON returns the JSON data from a given io reader
func GetJSON(reader io.Reader) (*JSONData, error) {
	j := new(JSONData)
	d := json.NewDecoder(reader)
	d.UseNumber()
	err := d.Decode(&j.data)
	if err != nil {
		log.Print(err)
		return nil, err
	}

	return j, err
}

// GetString gets the string value of a key in the given JSON data
func (d *JSONData) GetString(key string) (string, error) {
	keys := d.data
	err := errors.New("Could not find key: " + key)
	if v, ok := keys[key].(string); ok {
		return v, nil
	}

	return "", err
}

// GetInt gets the int value of a key in the given JSON data
func (d *JSONData) GetInt(key string) (int, error) {
	keys := d.data
	err := errors.New("Could not find key: " + key)
	if v, ok := keys[key].(int); ok {
		return v, nil
	}

	return -1, err
}

// GetBool gets the bool value of a key in the given JSON data
func (d *JSONData) GetBool(key string) (bool, error) {
	keys := d.data
	err := errors.New("Could not find key: " + key)
	if v, ok := keys[key].(bool); ok {
		return v, nil
	}

	return false, err
}

// GetStringArray gets the string array value of a key in the given JSON data
func (d *JSONData) GetStringArray(key string) ([]string, error) {
	keys := d.data
	err := errors.New("Could not find key: " + key)
	if v, ok := keys[key].([]interface{}); ok {

		keySlice := make([]string, len(v))

		for i, vIn := range v {
			keySlice[i] = vIn.(string)
		}
		return keySlice, nil
	}

	return []string{}, err
}

// NewAPIError creates and sends a error response
func NewAPIError(e *APIError, w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(e.Status)

	err := json.NewEncoder(w).Encode(e)
	if err != nil {
		log.Println("[API ERROR]: The server encountered an unexpected error.")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// NewAPIResponse creates and sends a normal API response
func NewAPIResponse(res *APIResponse, w http.ResponseWriter, code int) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)

	err := json.NewEncoder(w).Encode(res)
	if err != nil {
		log.Println("[API RESPONSE]: The website encountered an unexpected error.")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
