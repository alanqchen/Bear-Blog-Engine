package controllers

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/alanqchen/MGBlog/backend/app"
	"github.com/alanqchen/MGBlog/backend/models"
	"github.com/alanqchen/MGBlog/backend/repositories"
	"github.com/alanqchen/MGBlog/backend/services"
	"github.com/alanqchen/MGBlog/backend/util"
	"github.com/gorilla/mux"
	"github.com/jackc/pgtype"
)

type PostController struct {
	*app.App
	repositories.PostRepository
	repositories.UserRepository
}

type PostPaginator struct {
	Total        int     `json:"total"`
	PerPage      int     `json:"perPage"`
	CurrentPage  int     `json:"currentPage"`
	LastPage     int     `json:"lastPage"`
	From         int     `json:"from"`
	To           int     `json:"to"`
	FirstPageUrl string  `json:"firstPageUrl"`
	LastPageUrl  string  `json:"lastPageUrl"`
	NextPageUrl  *string `json:"nextPageUrl"`
	PrevPageUrl  *string `json:"prevPageUrl"`
}

func NewPostController(a *app.App, pr repositories.PostRepository, ur repositories.UserRepository) *PostController {
	return &PostController{a, pr, ur}
}

func (pc *PostController) GetAll(w http.ResponseWriter, r *http.Request) {
	//httpScheme := "https://"
	total, _ := pc.PostRepository.GetTotalPostCount()

	//page := r.URL.Query().Get("page")
	//log.Println("Page: ", page)
	//pageInt, err := strconv.Atoi(page)
	//if err != nil {
	//	pageInt = 1
	//}
	j, err := GetJSON(r.Body)
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}

	maxIDString, err := j.GetString("maxID")
	maxID, err := strconv.Atoi(maxIDString)

	log.Println(maxID)
	if err != nil {
		NewAPIError(&APIError{false, "Max ID is required (or -1 if first page)", http.StatusBadRequest}, w)
		return
	}
	if maxID == -1 {
		maxID, _ = pc.PostRepository.GetLastID()
		maxID += 1
	}

	// May add changing num posts per page in the future
	perPageInt := 10
	posts, minID, err := pc.PostRepository.Paginate(maxID, perPageInt)

	if err != nil {
		log.Println(err)
		NewAPIError(&APIError{false, "Could not fetch posts", http.StatusBadRequest}, w)
		return
	}

	if len(posts) == 0 {
		NewAPIResponse(&APIResponse{Success: false, Message: "Could not find posts", Data: posts}, w, http.StatusNotFound)
		return
	}

	postPaginator := APIPagination{
		total,
		perPageInt,
		minID,
	}

	NewAPIResponse(&APIResponse{Success: true, Data: posts, Pagination: &postPaginator}, w, http.StatusOK)
}

func (pc *PostController) GetById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}
	post, err := pc.PostRepository.FindById(id)
	if err != nil {
		NewAPIError(&APIError{false, "Could not find post", http.StatusNotFound}, w)
		return
	}

	NewAPIResponse(&APIResponse{Success: true, Data: post}, w, http.StatusOK)
}

func (pc *PostController) GetBySlug(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]
	post, err := pc.PostRepository.FindBySlug(slug)
	if err != nil {
		NewAPIError(&APIError{false, "Could not find post", http.StatusNotFound}, w)
		return
	}

	NewAPIResponse(&APIResponse{Success: true, Data: post}, w, http.StatusOK)
}

func (pc *PostController) Create(w http.ResponseWriter, r *http.Request) {
	uid, err := services.UserIdFromContext(r.Context())
	if err != nil {
		NewAPIError(&APIError{false, "Something went wrong", http.StatusInternalServerError}, w)
		return
	}

	j, err := GetJSON(r.Body)
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}

	title, err := j.GetString("title")
	if err != nil {
		NewAPIError(&APIError{false, "Title is required", http.StatusBadRequest}, w)
		return
	}

	//title = util.CleanZalgoText(title)

	if len(title) < 4 {
		NewAPIError(&APIError{false, "Title is too short", http.StatusBadRequest}, w)
		return
	}

	slug := strconv.Itoa(time.Now().Year()) + "/"
	monthNum := int(time.Now().Month())
	if monthNum < 10 {
		slug = slug + "0" + strconv.Itoa(monthNum)
	} else {
		slug = slug + strconv.Itoa(monthNum)
	}
	slug = slug + "/" + util.GenerateSlug(title)

	if len(slug) == 0 {
		NewAPIError(&APIError{false, "Title is invalid", http.StatusBadRequest}, w)
		return
	}

	body, err := j.GetString("body")
	if err != nil {
		NewAPIError(&APIError{false, "Content is required", http.StatusBadRequest}, w)
		return
	}

	//body = util.CleanZalgoText(body)

	if len(body) < 10 {
		NewAPIError(&APIError{false, "Body is too short", http.StatusBadRequest}, w)
		return
	}

	tags, err := j.GetStringArray("tags")
	if err != nil {
		NewAPIError(&APIError{false, "Missing tags key", http.StatusBadRequest}, w)
		return
	}

	imgURL, err := j.GetString("image-url")
	if err != nil {
		imgURL = ""
	}

	post := &models.Post{
		Title:         title,
		Slug:          slug,
		Body:          body,
		CreatedAt:     time.Now(),
		Tags:          tags,
		Hidden:        false,
		AuthorID:      uid,
		FeatureImgURL: imgURL,
	}

	err = pc.PostRepository.Create(post)
	if err != nil {
		NewAPIError(&APIError{false, "Could not create post", http.StatusBadRequest}, w)
		return
	}

	// TODO: Change this maybe put the user object into a context and get the author from there.
	//u, err := pc.UserRepository.FindById(uid)
	if err != nil {
		NewAPIError(&APIError{false, "Content is required", http.StatusBadRequest}, w)
		return
	}

	defer r.Body.Close()
	NewAPIResponse(&APIResponse{Success: true, Message: "Post created", Data: post}, w, http.StatusOK)
}

func (pc *PostController) Update(w http.ResponseWriter, r *http.Request) {
	_, err := services.UserIdFromContext(r.Context())
	if err != nil {
		NewAPIError(&APIError{false, "Something went wrong", http.StatusInternalServerError}, w)
		return
	}
	vars := mux.Vars(r)
	postId, err := strconv.Atoi(vars["id"])
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}
	post, err := pc.PostRepository.FindById(postId)
	if err != nil {
		// post was not found
		NewAPIError(&APIError{false, "Could not find post", http.StatusNotFound}, w)
		return
	}

	j, err := GetJSON(r.Body)
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}

	title, err := j.GetString("title")
	if err != nil {
		NewAPIError(&APIError{false, "Title is required", http.StatusBadRequest}, w)
		return
	}

	//title = util.CleanZalgoText(title)

	if len(title) < 10 {
		NewAPIError(&APIError{false, "Title is too short", http.StatusBadRequest}, w)
		return
	}

	slug := util.GenerateSlug(title)
	if len(slug) == 0 {
		NewAPIError(&APIError{false, "Title is invalid", http.StatusBadRequest}, w)
		return
	}

	body, err := j.GetString("body")
	if err != nil {
		NewAPIError(&APIError{false, "Content is required", http.StatusBadRequest}, w)
		return
	}

	//body = util.CleanZalgoText(body)

	if len(body) < 10 {
		NewAPIError(&APIError{false, "Body is too short", http.StatusBadRequest}, w)
		return
	}

	hidden, err := j.GetBool("hidden")
	if err != nil {
		NewAPIError(&APIError{false, "Missing hidden key", http.StatusBadRequest}, w)
		return
	}

	tags, err := j.GetStringArray("tags")
	if err != nil {
		NewAPIError(&APIError{false, "Missing tags key", http.StatusBadRequest}, w)
		return
	}

	//post.UserID = uid
	post.UpdatedAt = pgtype.Timestamptz{Time: time.Now(), Status: pgtype.Present}
	post.Title = title
	post.Body = body
	post.Slug = slug
	post.Hidden = hidden
	post.Tags = tags
	//post.ID = postId

	err = pc.PostRepository.Update(post)
	if err != nil {
		NewAPIError(&APIError{false, "Could not update post", http.StatusBadRequest}, w)
		return
	}

	NewAPIResponse(&APIResponse{Success: true, Message: "Post updated", Data: post}, w, http.StatusOK)
}

func (pc *PostController) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}
	err = pc.PostRepository.Delete(id)
	if err != nil {
		NewAPIError(&APIError{false, "Could not find post to delete", http.StatusNotFound}, w)
		return
	}
	/*
		err = pc.PostRepository.ResetSeq()
		if err != nil {
			NewAPIError(&APIError{false, "Could not reset sequence", http.StatusNotFound}, w)
			return
		}
	*/
	NewAPIResponse(&APIResponse{Success: true, Data: id}, w, http.StatusOK)
}
