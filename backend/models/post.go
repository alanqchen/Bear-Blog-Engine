package models

import (
	"encoding/json"
	"time"

	"github.com/jackc/pgtype"
)

type Post struct {
	ID            int                `json:"id"`
	Title         string             `json:"title"`
	Slug          string             `json:"slug"`
	Body          string             `json:"body"`
	CreatedAt     time.Time          `json:"createdAt"`
	UpdatedAt     pgtype.Timestamptz `json:"updatedAt"`
	Tags          []string           `json:"tags"`
	Hidden        bool               `json:"hidden"`
	AuthorID      int                `json:"authorid"`
	FeatureImgURL string             `json:"featureImgUrl"`
}

func (p *Post) MarshalJSON() ([]byte, error) {
	// TODO: Find a better way to set updatedAt to nil
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
			AuthorID      int                 `json:"authorid"`
			FeatureImgURL string              `json:"featureImgUrl"`
		}{p.ID, p.Title, p.Slug, p.Body, p.CreatedAt, nil, p.Tags, p.Hidden, p.AuthorID, p.FeatureImgURL})
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
		AuthorID      int       `json:"authorid"`
		FeatureImgURL string    `json:"featureImgUrl"`
	}{p.ID, p.Title, p.Slug, p.Body, p.CreatedAt, p.UpdatedAt.Time, p.Tags, p.Hidden, p.AuthorID, p.FeatureImgURL})
}
