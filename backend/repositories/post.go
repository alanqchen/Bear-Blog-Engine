package repositories

import (
	"context"
	"log"
	"strconv"

	"github.com/alanqchen/Bear-Post/backend/database"
	"github.com/alanqchen/Bear-Post/backend/models"
	"github.com/jackc/pgx/v4"
)

type PostRepository interface {
	Create(p *models.Post) error
	GetAll() ([]*models.Post, error)
	FindById(id int) (*models.Post, error)
	FindByIdAdmin(id int) (*models.Post, error)
	FindBySlug(slug string) (*models.Post, error)
	FindBySlugAdmin(slug string) (*models.Post, error)
	Exists(slug string) bool
	Delete(id int) error
	Update(p *models.Post) error
	Paginate(maxID int, perPage int, tags []string) ([]*models.Post, int, error)
	GetTotalPostCount() (int, error)
	GetPublicPostCount() (int, error)
	ResetSeq() error
	GetLastID() (int, error)
	SearchQuery() ([]*models.Post, error)
}

type postRepository struct {
	*database.Postgres
}

func NewPostRepository(db *database.Postgres) PostRepository {
	return &postRepository{db}
}

func (pr *postRepository) Create(p *models.Post) error {
	exists := pr.Exists(p.Slug)
	if exists {
		err := pr.createWithSlugCount(p)
		if err != nil {
			return err
		}

		return nil
	}

	_, err := pr.Conn.Prepare(context.Background(), "post-query", "INSERT INTO post_schema.post VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id")
	if err != nil {
		log.Println(err)
		return err
	}

	var pId int

	err = pr.Conn.QueryRow(context.Background(), "post-query", p.Title, p.Slug, p.Body, p.CreatedAt.UTC(), nil, p.Tags, p.Hidden, p.AuthorID, p.FeatureImgURL, p.Subtitle, p.Views).Scan(&pId)

	if err != nil {
		log.Println(err)
		return err
	}

	p.ID = pId

	return nil
}

func (pr *postRepository) Delete(id int) error {
	_, err := pr.Conn.Prepare(context.Background(), "delete-query", "DELETE FROM post_schema.post WHERE id=$1")
	if err != nil {
		log.Println(err)
		return err
	}

	row, err := pr.Conn.Query(context.Background(), "delete-query", id)
	defer row.Close()
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

// Check if a slug already exists
func (pr *postRepository) Exists(slug string) bool {
	var exists bool
	err := pr.Conn.QueryRow(context.Background(), "SELECT EXISTS (SELECT id FROM post_schema.post WHERE slug=$1)", slug).Scan(&exists)
	if err != nil {
		log.Printf("[POST REPO]: Exists err %v", err)
		return true
	}

	return exists
}

// This is a 'private' function to be used in cases where a slug already exists
func (pr *postRepository) createWithSlugCount(p *models.Post) error {

	var count int
	err := pr.Conn.QueryRow(context.Background(), "SELECT COUNT(*) FROM post_schema.post WHERE slug LIKE $1", p.Slug+"%").Scan(&count)
	if err != nil {
		log.Println(err)
		return err
	}
	counter := strconv.Itoa(count + 1)

	_, err = pr.Conn.Prepare(context.Background(), "slug-query", "INSERT INTO post_schema.post VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id")
	if err != nil {
		log.Println(err)
		return err
	}

	var pId int
	err = pr.Conn.QueryRow(context.Background(), "slug-query", p.Title, p.Slug+"-"+counter, p.Body, p.CreatedAt.UTC(), nil, p.Tags, p.Hidden, p.AuthorID, p.FeatureImgURL, p.Subtitle, p.Views).Scan(&pId)
	if err != nil {
		log.Println(err)
		return err
	}

	p.Slug = p.Slug + "-" + counter

	p.ID = pId
	return nil
}

func (pr *postRepository) FindById(id int) (*models.Post, error) {
	post := models.Post{}

	err := pr.Conn.QueryRow(context.Background(), "SELECT * FROM post_schema.post WHERE NOT hidden AND id = $1", id).Scan(&post.ID, &post.Title, &post.Slug, &post.Body, &post.CreatedAt, &post.UpdatedAt, &post.Tags, &post.Hidden, &post.AuthorID, &post.FeatureImgURL, &post.Subtitle, &post.Views)
	if err != nil {
		return nil, err
	}
	post.Views += 1
	pr.Conn.Prepare(context.Background(), "update-views-query", "UPDATE post_schema.post SET views=$1 WHERE id=$2")
	_, err = pr.Conn.Exec(context.Background(), "update-views-query", post.Views, post.ID)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &post, nil
}

func (pr *postRepository) FindByIdAdmin(id int) (*models.Post, error) {
	post := models.Post{}

	err := pr.Conn.QueryRow(context.Background(), "SELECT * FROM post_schema.post WHERE id = $1", id).Scan(&post.ID, &post.Title, &post.Slug, &post.Body, &post.CreatedAt, &post.UpdatedAt, &post.Tags, &post.Hidden, &post.AuthorID, &post.FeatureImgURL, &post.Subtitle, &post.Views)
	if err != nil {
		return nil, err
	}

	return &post, nil
}

func (pr *postRepository) Update(p *models.Post) error {
	exists := pr.Exists(p.Slug)
	// Check if this is a new slug
	if !exists {
		//
		err := pr.updatePost(p)
		if err != nil {
			return err
		}

		return nil
	}

	// Post do exists
	// Now we want to find out if the slug is the post we are updating
	var postId int
	err := pr.Conn.QueryRow(context.Background(), "SELECT id FROM post_schema.post WHERE slug LIKE $1", p.Slug).Scan(&postId)
	if err != nil && err != pgx.ErrNoRows {
		return err
	}

	if p.ID == postId {
		err := pr.updatePost(p)
		if err != nil {
			return err
		}

		return nil
	}

	// If its not the same post we append the next count number of that slug
	var slugCount int
	err = pr.Conn.QueryRow(context.Background(), "SELECT COUNT(*) FROM post_schema.post where slug LIKE $1", "%"+p.Slug+"%").Scan(&slugCount)
	if err != nil {
		return err
	}
	counter := strconv.Itoa(slugCount + 1)
	p.Slug = p.Slug + "-" + counter

	err = pr.updatePost(p)
	if err != nil {
		return err
	}

	return nil
}

func (pr *postRepository) updatePost(p *models.Post) error {
	_, err := pr.Conn.Prepare(context.Background(), "update-post-query", "UPDATE post_schema.post SET title=$1, slug=$2, body=$3, updated_at=$4, tags=$5, hidden=$6, feature_image_url=$7, subtitle=$8 WHERE id=$9")
	if err != nil {
		log.Println(err)
		return err
	}

	_, err = pr.Conn.Exec(context.Background(), "update-post-query", p.Title, p.Slug, p.Body, p.UpdatedAt, p.Tags, p.Hidden, p.FeatureImgURL, p.Subtitle, p.ID)
	if err != nil {
		log.Println(err)
		return err
	}

	return nil
}

func (pr *postRepository) GetTotalPostCount() (int, error) {
	var count int
	err := pr.Conn.QueryRow(context.Background(), "SELECT COUNT(*) FROM post_schema.post").Scan(&count)
	if err != nil {
		log.Println(err)
		return -1, err
	}

	return count, nil
}

func (pr *postRepository) GetPublicPostCount() (int, error) {
	var count int
	err := pr.Conn.QueryRow(context.Background(), "SELECT COUNT(*) FROM post_schema.post WHERE NOT hidden").Scan(&count)
	if err != nil {
		log.Println(err)
		return -1, err
	}

	return count, nil
}

func (pr *postRepository) FindBySlug(slug string) (*models.Post, error) {
	post := models.Post{}

	err := pr.Conn.QueryRow(context.Background(), "SELECT * FROM post_schema.post WHERE NOT hidden AND slug LIKE $1", slug).Scan(&post.ID, &post.Title, &post.Slug, &post.Body, &post.CreatedAt, &post.UpdatedAt, &post.Tags, &post.Hidden, &post.AuthorID, &post.FeatureImgURL, &post.Subtitle, &post.Views)

	if err != nil {
		log.Println(err)
		return nil, err
	}

	post.Views++

	pr.Conn.Prepare(context.Background(), "update-views-query", "UPDATE post_schema.post SET views=$1 WHERE slug LIKE $2")
	_, err = pr.Conn.Exec(context.Background(), "update-views-query", post.Views, slug)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &post, nil
}

// Returns a single post matching the slug, including hidden posts. There should not be multiple posts with the same slug.
func (pr *postRepository) FindBySlugAdmin(slug string) (*models.Post, error) {
	post := models.Post{}
	err := pr.Conn.QueryRow(context.Background(), "SELECT * FROM post_schema.post WHERE slug LIKE $1", slug).Scan(&post.ID, &post.Title, &post.Slug, &post.Body, &post.CreatedAt, &post.UpdatedAt, &post.Tags, &post.Hidden, &post.AuthorID, &post.FeatureImgURL, &post.Subtitle, &post.Views)

	if err != nil {
		log.Println(err)
		return nil, err
	}
	// Don't increment view count
	//err = pr.Conn.QueryRow(context.Background(), "UPDATE post_schema.post SET views=$1 WHERE slug LIKE $2", post.Views, slug).Scan()

	return &post, nil
}

func (pr *postRepository) GetAll() ([]*models.Post, error) {
	var posts []*models.Post

	rows, err := pr.Conn.Query(context.Background(), "SELECT * FROM post_schema.post")
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		p := new(models.Post)
		err := rows.Scan(&p.ID, &p.Title, &p.Slug, &p.Body, &p.CreatedAt, &p.UpdatedAt, &p.Tags, &p.Hidden, &p.AuthorID, &p.FeatureImgURL, &p.Subtitle, &p.Views)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		posts = append(posts, p)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (pr *postRepository) Paginate(maxID int, perPage int, tags []string) ([]*models.Post, int, error) {
	var posts []*models.Post

	rows, err := pr.Conn.Query(context.Background(), "SELECT * FROM post_schema.post WHERE NOT hidden AND id < $1 AND tags @> $2::text[] ORDER BY created_at DESC, id DESC LIMIT $3", maxID, &tags, perPage)

	if err != nil {
		return nil, -1, err
	}
	defer rows.Close()

	for rows.Next() {
		p := new(models.Post)
		err := rows.Scan(&p.ID, &p.Title, &p.Slug, &p.Body, &p.CreatedAt, &p.UpdatedAt, &p.Tags, &p.Hidden, &p.AuthorID, &p.FeatureImgURL, &p.Subtitle, &p.Views)

		if err != nil {
			log.Println(err)
			return nil, -1, err
		}
		posts = append(posts, p)
	}
	if err := rows.Err(); err != nil {
		return nil, -1, err
	}

	var minID int
	err = pr.QueryRow(context.Background(), "SELECT id FROM (SELECT * FROM post_schema.post WHERE id < $1 AND NOT hidden ORDER BY created_at DESC, id DESC LIMIT $2) AS trash_alias WHERE tags @> $3::text[] ORDER BY created_at LIMIT 1;", maxID, perPage, &tags).Scan(&minID)
	if err != nil {
		log.Println(err)
		return nil, -1, err
	}
	return posts, minID, nil
}

func (pr *postRepository) ResetSeq() error {
	row, err := pr.Conn.Query(context.Background(), "SELECT setval(pg_get_serial_sequence('post_schema.post', 'id'), coalesce(max(id),0)+ 1, false) FROM post_schema.post")

	if err != nil {
		log.Println(err)
		return err
	}
	defer row.Close()
	return nil
}

func (pr *postRepository) GetLastID() (int, error) {
	var lastID int
	err := pr.Conn.QueryRow(context.Background(), "SELECT id FROM post_schema.post WHERE NOT hidden ORDER BY created_at DESC LIMIT 1").Scan(&lastID)
	if err != nil {
		log.Println(err)
		return -1, err
	}

	return lastID, nil
}

// Searches using title and tags. Returns results ordered by view count in descending order.
func (pr *postRepository) SearchQuery(title string, tags []string) ([]*models.Post, error) {
	var posts []*models.Post

	rows, err := pr.Conn.Query(context.Background(), "SELECT * FROM post_schema.post WHERE NOT hidden AND LOWER(title) LIKE LOWER('%' || $1 || '%') AND tags @> '$2' ORDER BY views DESC;", title, tags)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		p := new(models.Post)
		err := rows.Scan(&p.ID, &p.Title, &p.Slug, &p.Body, &p.CreatedAt, &p.UpdatedAt, &p.Tags, &p.Hidden, &p.AuthorID, &p.FeatureImgURL, &p.Subtitle, &p.Views)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		posts = append(posts, p)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}
