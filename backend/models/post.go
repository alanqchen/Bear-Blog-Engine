package models

import (
	"encoding/json"
	"time"

	"github.com/jackc/pgtype"
)

// Post stores the data of a post
type Post struct {
	ID            int                `json:"id"`
	Title         string             `json:"title"`
	Slug          string             `json:"slug"`
	Body          string             `json:"body"`
	CreatedAt     time.Time          `json:"createdAt"`
	UpdatedAt     pgtype.Timestamptz `json:"updatedAt"`
	Tags          []string           `json:"tags"`
	Hidden        bool               `json:"hidden"`
	AuthorID      string             `json:"authorid"`
	FeatureImgURL string             `json:"featureImgUrl"`
	Subtitle      string             `json:"subtitle"`
	Views         int                `json:"views"`
}

// MarshalJSON marshals post data
func (p *Post) MarshalJSON() ([]byte, error) {
	value, _ := p.UpdatedAt.Value()
	if value == nil {
		return json.Marshal(struct {
			ID            int                 `json:"id"`
			Title         string              `json:"title"`
			Slug          string              `json:"slug"`
			Body          string              `json:"body"`
			CreatedAt     time.Time           `json:"createdAt"`
			UpdatedAt     *pgtype.Timestamptz `json:"updatedAt"`
			Tags          []string            `json:"tags"`
			Hidden        bool                `json:"hidden"`
			AuthorID      string              `json:"authorid"`
			FeatureImgURL string              `json:"featureImgUrl"`
			Subtitle      string              `json:"subtitle"`
			Views         int                 `json:"views"`
		}{p.ID, p.Title, p.Slug, p.Body, p.CreatedAt, nil, p.Tags, p.Hidden, p.AuthorID, p.FeatureImgURL, p.Subtitle, p.Views})
	}

	return json.Marshal(struct {
		ID            int       `json:"id"`
		Title         string    `json:"title"`
		Slug          string    `json:"slug"`
		Body          string    `json:"body"`
		CreatedAt     time.Time `json:"createdAt"`
		UpdatedAt     time.Time `json:"updatedAt"`
		Tags          []string  `json:"tags"`
		Hidden        bool      `json:"hidden"`
		AuthorID      string    `json:"authorid"`
		FeatureImgURL string    `json:"featureImgUrl"`
		Subtitle      string    `json:"subtitle"`
		Views         int       `json:"views"`
	}{p.ID, p.Title, p.Slug, p.Body, p.CreatedAt, p.UpdatedAt.Time, p.Tags, p.Hidden, p.AuthorID, p.FeatureImgURL, p.Subtitle, p.Views})
}
