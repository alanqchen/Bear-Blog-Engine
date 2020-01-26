package models

import (
	"encoding/json"
	"time"

	"github.com/jackc/pgtype"
)

type Post struct {
	ID        int                `json:"id"`
	Title     string             `json:"title"`
	Slug      string             `json:"slug"`
	Body      string             `json:"body"`
	CreatedAt time.Time          `json:"createdAt"`
	UpdatedAt pgtype.Timestamptz `json:"updatedAt"`
}

func (p *Post) MarshalJSON() ([]byte, error) {
	// TODO: Find a better way to set updatedAt to nil
	value, _ := p.UpdatedAt.Value()
	if value == nil {
		return json.Marshal(struct {
			ID        int                 `json:"id"`
			Title     string              `json:"title"`
			Slug      string              `json:"slug"`
			Body      string              `json:"body"`
			CreatedAt time.Time           `json:"createdAt"`
			UpdatedAt *pgtype.Timestamptz `json:"updatedAt"`
		}{p.ID, p.Title, p.Slug, p.Body, p.CreatedAt, nil})
	}

	return json.Marshal(struct {
		ID        int       `json:"id"`
		Title     string    `json:"title"`
		Slug      string    `json:"slug"`
		Body      string    `json:"body"`
		CreatedAt time.Time `json:"createdAt"`
		UpdatedAt time.Time `json:"updatedAt"`
	}{p.ID, p.Title, p.Slug, p.Body, p.CreatedAt, p.UpdatedAt.Time})
}
