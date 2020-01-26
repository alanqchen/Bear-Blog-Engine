package repositories

import (
	"context"
	"log"
	"strconv"

	"github.com/alanqchen/MGBlog/backend/database"
	"github.com/alanqchen/MGBlog/backend/models"
	"github.com/jackc/pgx/v4"
)

type PostRepository interface {
	Create(p *models.Post) error
	GetAll() ([]*models.Post, error)
	FindById(id int) (*models.Post, error)
	FindBySlug(slug string) (*models.Post, error)
	Exists(slug string) bool
	Delete(id int) error
	Update(p *models.Post) error
	Paginate(perpage int, offset int) ([]*models.Post, error)
	GetTotalPostCount() (int, error)
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
	// ("INSERT INTO posts SET title=?, slug=?, body=?, created_at=?, user_id=?")

	_, err := pr.Conn.Prepare(context.Background(), "post-query", "INSERT INTO posts SET tile=?, slug=?, body=?, created_at=?, user_id=? RETURNING id")
	if err != nil {
		return err
	}
	defer pr.Conn.Close(context.Background())
	//result, err := pr.Conn.Exec(context.Background(), p.Title, p.Slug, p.Body, p.CreatedAt.Format("20060102150405"))
	var pId int
	err = pr.Conn.QueryRow(context.Background(), p.Title, p.Slug, p.Body, p.CreatedAt.Format("20060102150405")).Scan(&pId)
	if err != nil {
		return err
	}

	//pId, err := result.LastInsertId()
	//if err != nil {
	//	return err
	//}
	//p.ID = int(pId)
	p.ID = pId

	return nil
}

func (pr *postRepository) Delete(id int) error {
	return nil
}

// Check if a slug already exists
func (pr *postRepository) Exists(slug string) bool {
	var exists bool
	err := pr.Conn.QueryRow(context.Background(), "SELECT EXISTS (SELECT id FROM posts WHERE slug=?)", slug).Scan(&exists)
	if err != nil {
		log.Printf("[POST REPO]: Exists err %v", err)
		return true
	}

	return exists
}

// This is a 'private' function to be used in cases where a slug already exists
func (pr *postRepository) createWithSlugCount(p *models.Post) error {
	var count int
	err := pr.Conn.QueryRow(context.Background(), "SELECT COUNT(*) FROM posts where slug LIKE ?", "%"+p.Slug+"%").Scan(&count)
	if err != nil {
		return err
	}
	counter := strconv.Itoa(count)

	_, err = pr.Conn.Prepare(context.Background(), "slug-query", "INSERT INTO posts SET title=?, slug=?, body=?, created_at=?, user_id=? RETURNING id")
	if err != nil {
		return err
	}
	defer pr.Conn.Close(context.Background())
	// result, err := pr.Conn.QueryRow(p.Title, p.Slug+"-"+counter, p.Body, p.CreatedAt.Format("20060102150405"))
	var pId int
	err = pr.Conn.QueryRow(context.Background(), p.Title, p.Slug+"-"+counter, p.Body, p.CreatedAt.Format("20060102150405")).Scan(&pId)
	if err != nil {
		return err
	}

	p.Slug = p.Slug + "-" + counter
	/*
		pId, err := result.LastInsertId()
		if err != nil {
			return err
		}
		p.ID = int(pId)
	*/
	p.ID = pId
	return nil
}

func (pr *postRepository) FindById(id int) (*models.Post, error) {
	post := models.Post{}

	err := pr.Conn.QueryRow(context.Background(), "SELECT p.`id`, p.`title`, p.`slug`, p.`body`, p.`created_at`, p.`updated_at`, p.`user_id`, u.`name` as author FROM posts p INNER JOIN `users` as u on p.`user_id`=u.`id` WHERE p.`id`=?", id).Scan(&post.ID, &post.Title, &post.Slug, &post.Body, &post.CreatedAt, &post.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return &post, nil
}

func (pr *postRepository) Update(p *models.Post) error {
	exists := pr.Exists(p.Slug)
	if !exists {
		err := pr.updatePost(p)
		if err != nil {
			return err
		}

		return nil
	}

	// Post do exists
	// Now we want to find out if the slug is the post we are updating
	var postId int
	err := pr.Conn.QueryRow(context.Background(), "SELECT id FROM posts WHERE slug=?", p.Slug).Scan(&postId)
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
	err = pr.Conn.QueryRow(context.Background(), "SELECT COUNT(*) FROM posts where slug LIKE ?", "%"+p.Slug+"%").Scan(&slugCount)
	if err != nil {
		return err
	}
	counter := strconv.Itoa(slugCount)
	p.Slug = p.Slug + "-" + counter

	err = pr.updatePost(p)
	if err != nil {
		return err
	}

	return nil
}

func (pr *postRepository) updatePost(p *models.Post) error {
	_, err := pr.Conn.Prepare(context.Background(), "update-post-query", "UPDATE posts SET title=?, slug=?, body=?, updated_at=?, user_id=? WHERE id = ?")
	if err != nil {
		return err
	}
	defer pr.Conn.Close(context.Background())
	_, err = pr.Conn.Exec(context.Background(), p.Title, p.Slug, p.Body, p.UpdatedAt, p.ID)
	if err != nil {
		return err
	}

	return nil
}

func (pr *postRepository) GetTotalPostCount() (int, error) {
	var count int
	err := pr.Conn.QueryRow(context.Background(), "SELECT COUNT(*) FROM posts").Scan(&count)
	if err != nil {
		return -1, err
	}

	return count, nil
}

func (pr *postRepository) FindBySlug(slug string) (*models.Post, error) {
	post := models.Post{}
	err := pr.Conn.QueryRow(context.Background(), "SELECT p.`id`, p.`title`, p.`slug`, p.`body`, p.`created_at`, p.`updated_at`, p.`user_id`, u.`name` as author FROM posts p INNER JOIN `users` as u on p.`user_id`=u.`id` WHERE slug LIKE ?", "%"+slug+"%").Scan(&post.ID, &post.Title, &post.Slug, &post.Body, &post.CreatedAt, &post.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return &post, nil
}

func (pr *postRepository) GetAll() ([]*models.Post, error) {
	var posts []*models.Post

	rows, err := pr.Conn.Query(context.Background(), "SELECT id, title, slug, body, created_at, updated_at, user_id from posts")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		p := new(models.Post)
		err := rows.Scan(&p.ID, &p.Title, &p.Slug, &p.Body, &p.CreatedAt, &p.UpdatedAt)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (pr *postRepository) Paginate(perpage int, offset int) ([]*models.Post, error) {
	var posts []*models.Post

	rows, err := pr.Conn.Query(context.Background(), "SELECT p.`id`, p.`title`, p.`slug`, p.`body`, p.`created_at`, p.`updated_at`, p.`user_id`, u.`name` as author FROM posts p INNER JOIN `users` as u on p.`user_id`=u.`id` LIMIT ? OFFSET ?", perpage, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		p := new(models.Post)
		err := rows.Scan(&p.ID, &p.Title, &p.Slug, &p.Body, &p.CreatedAt, &p.UpdatedAt)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}
