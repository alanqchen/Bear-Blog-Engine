package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"time"

	"github.com/alanqchen/Bear-Post/backend/app"
	"github.com/alanqchen/Bear-Post/backend/models"
	"github.com/alanqchen/Bear-Post/backend/repositories"
	"github.com/alanqchen/Bear-Post/backend/services"
	"github.com/alanqchen/Bear-Post/backend/util"
	"github.com/go-redis/redis"
	"github.com/gorilla/mux"
	"github.com/jackc/pgtype"
	"github.com/jackc/pgx/v4"
)

// PostController stores the App config and repositories
type PostController struct {
	*app.App
	repositories.PostRepository
	repositories.UserRepository
}

// NewPostController creates a new post controller
func NewPostController(a *app.App, pr repositories.PostRepository, ur repositories.UserRepository) *PostController {
	return &PostController{a, pr, ur}
}

// GetPage returns a keyset pagaination page based on the given post maxID in the page
func (pc *PostController) GetPage(w http.ResponseWriter, r *http.Request) {
	total, _ := pc.PostRepository.GetPublicPostCount()

	q := r.URL.Query()
	maxIDString := q.Get("maxID")
	maxID, err := strconv.Atoi(maxIDString)

	log.Println(maxID)
	if err != nil {
		NewAPIError(&APIError{false, "Max ID is required (or -1 if first page)", http.StatusBadRequest}, w)
		return
	}

	tagsSlice := q["tags"]
	if len(tagsSlice) == 0 {
		log.Println("No tags slice")
	}

	perPageString := q.Get("num")
	perPage := 5

	if perPageString != "" {
		perPage, err := strconv.Atoi(perPageString)
		if err != nil {
			NewAPIError(&APIError{false, "Invalid num type", http.StatusBadRequest}, w)
			return
		}
		if perPage < 1 || perPage > 10 {
			NewAPIError(&APIError{false, "Query string num is not within bounds [1, 10]", http.StatusBadRequest}, w)
			return
		}
	}

	getAuthorIDString := q.Get("getAuthorID")
	getAuthorID := false
	if getAuthorIDString != "" {
		getAuthorID = true
	}

	if maxID == -1 {
		maxID, _ = pc.PostRepository.GetLastID()
		maxID++
	}

	if !getAuthorID && perPage == 5 {
		if len(tagsSlice) == 0 {
			resStatus, resCache := pc.checkCache(maxIDString)
			if resStatus {
				var res APIResponse
				err := json.Unmarshal(resCache, &res)
				if err != nil {
					log.Fatal(err)
				}
				log.Println("[INFO] Returned result from cache")
				NewAPIResponse(&res, w, http.StatusOK)
				return
			}
		} else if len(tagsSlice) == 1 {
			resStatus, resCache := pc.checkCategoryCache(tagsSlice[0], maxIDString)
			if resStatus {
				var res APIResponse
				err := json.Unmarshal(resCache, &res)
				if err != nil {
					log.Fatal(err)
				}
				log.Println("[INFO] Returned result from category cache")
				NewAPIResponse(&res, w, http.StatusOK)
				return
			}
		}
	}

	posts, minID, err := pc.PostRepository.Paginate(maxID, perPage, tagsSlice)

	if err != nil && err != pgx.ErrNoRows {
		log.Println(err)
		NewAPIError(&APIError{false, "Could not fetch posts", http.StatusBadRequest}, w)
		return
	}

	if len(posts) == 0 {
		log.Println("Could not find more posts")
		posts = make([]*models.Post, 0)
		NewAPIResponse(&APIResponse{Success: true, Message: "Could not find more posts", Data: posts}, w, http.StatusOK)
		return
	}

	if !getAuthorID {
		for _, post := range posts {
			author, err := pc.UserRepository.FindByID(post.AuthorID)
			if err != nil {
				post.AuthorID = "Unknown"
			} else {
				post.AuthorID = author.Name
			}
		}
	}

	postPaginator := APIPagination{
		total,
		perPage,
		minID,
		tagsSlice,
	}

	// Only add to cache when the author ID was not requested
	if !getAuthorID && perPage == 5 {
		if len(tagsSlice) == 0 {
			//Add query result to Redis cache, only if no tags is searched for
			jPosts, err := json.Marshal(&APIResponse{Success: true, Data: posts, Pagination: &postPaginator})
			if err != nil {
				log.Println("[WARN] Failed to add posts to cache")
				log.Println(err)
				// Still send result, but failed to add to cache
				NewAPIResponse(&APIResponse{Success: true, Data: posts, Pagination: &postPaginator}, w, http.StatusOK)
				return
			}
			// Add query result to Redis cache, only if no tags were searched for
			//pc.App.Redis.Set(maxIDString, []byte(jPosts), 0)
			val := pc.App.Redis.HSet("page-hash", maxIDString, []byte(jPosts))
			if val.Err() != nil {
				log.Println("[WARN] Failed to add posts to cache")
				log.Println(err)
			}
			log.Println("Query result added to cache")
		} else if len(tagsSlice) == 1 {
			// Add query result to Redis cache, only if a single tag (category) is searched for
			jPosts, err := json.Marshal(&APIResponse{Success: true, Data: posts, Pagination: &postPaginator})
			if err != nil {
				log.Println("[WARN] Failed to add category posts to cache")
				log.Println(err)
				// Still send result, but failed to add to cache
				NewAPIResponse(&APIResponse{Success: true, Data: posts, Pagination: &postPaginator}, w, http.StatusOK)
				return
			}
			val := pc.App.Redis.HSet(tagsSlice[0], maxIDString, []byte(jPosts))
			if val.Err() != nil {
				log.Println("[WARN] Failed to add category posts to cache")
				log.Println(err)
			}
			log.Println("Category query result added to cache")
		}
	}

	NewAPIResponse(&APIResponse{Success: true, Data: posts, Pagination: &postPaginator}, w, http.StatusOK)
}

// GetPageAdmin returns a keyset pagaination page based on the given post maxID in the page
// including hidden posts
func (pc *PostController) GetPageAdmin(w http.ResponseWriter, r *http.Request) {
	//httpScheme := "https://"
	total, _ := pc.PostRepository.GetPublicPostCount()
	//page := r.URL.Query().Get("page")
	//log.Println("Page: ", page)
	//pageInt, err := strconv.Atoi(page)
	//if err != nil {
	//	pageInt = 1
	//}

	q := r.URL.Query()
	maxIDString := q.Get("maxID")
	maxID, err := strconv.Atoi(maxIDString)

	log.Println(maxID)
	if err != nil {
		NewAPIError(&APIError{false, "Max ID is required (or -1 if first page)", http.StatusBadRequest}, w)
		return
	}

	tagsSlice := q["tags"]
	if len(tagsSlice) == 0 {
		log.Println("No tags slice")
	}

	perPageString := q.Get("num")
	perPage := 10

	if perPageString != "" {
		perPage, err := strconv.Atoi(perPageString)
		if err != nil {
			NewAPIError(&APIError{false, "Invalid num type", http.StatusBadRequest}, w)
			return
		}
		if perPage < 1 || perPage > 10 {
			NewAPIError(&APIError{false, "Query string num is not within bounds [1, 10]", http.StatusBadRequest}, w)
			return
		}
	}

	getAuthorIDString := q.Get("getAuthorID")
	getAuthorID := false
	if getAuthorIDString != "" {
		getAuthorID = true
	}

	if maxID == -1 {
		maxID, _ = pc.PostRepository.GetLastIDAdmin()
		maxID++
	}

	if !getAuthorID && len(tagsSlice) == 0 && perPage == 10 {
		resStatus, resCache := pc.checkAdminCache(maxIDString)
		if resStatus {
			var res APIResponse
			err := json.Unmarshal(resCache, &res)
			if err != nil {
				log.Fatal(err)
			}
			log.Println("[INFO] Returned result from cache")
			NewAPIResponse(&res, w, http.StatusOK)
			return
		}
	}

	posts, minID, err := pc.PostRepository.PaginateAdmin(maxID, perPage, tagsSlice)

	if err != nil && err != pgx.ErrNoRows {
		log.Println(err)
		NewAPIError(&APIError{false, "Could not fetch posts", http.StatusBadRequest}, w)
		return
	}

	if len(posts) == 0 {
		log.Println("Could not find more posts")
		posts = make([]*models.Post, 0)
		NewAPIResponse(&APIResponse{Success: true, Message: "Could not find more posts", Data: posts}, w, http.StatusOK)
		return
	}

	if !getAuthorID {
		for _, post := range posts {
			author, err := pc.UserRepository.FindByID(post.AuthorID)
			if err != nil {
				post.AuthorID = "Unknown"
			} else {
				post.AuthorID = author.Name
			}
		}
	}

	postPaginator := APIPagination{
		total,
		perPage,
		minID,
		tagsSlice,
	}

	// Only add to cache when the author ID was not requested
	if !getAuthorID && len(tagsSlice) == 0 && perPage == 10 {
		//Add query result to Redis cache, only if no tags is searched for
		jPosts, err := json.Marshal(&APIResponse{Success: true, Data: posts, Pagination: &postPaginator})
		if err != nil {
			log.Println("[WARN] Failed to add posts to admin cache")
			log.Println(err)
			// Still send result, but failed to add to cache
			NewAPIResponse(&APIResponse{Success: true, Data: posts, Pagination: &postPaginator}, w, http.StatusOK)
			return
		}
		// Add query result to Redis cache, only if no tags were searched for
		//pc.App.Redis.Set(maxIDString, []byte(jPosts), 0)
		val := pc.App.Redis.HSet("admin-page-hash", maxIDString, []byte(jPosts))
		if val.Err() != nil {
			log.Println("[WARN] Failed to add posts to admin cache")
			log.Println(err)
		}
		log.Println("Query result added to admin cache")
	}

	NewAPIResponse(&APIResponse{Success: true, Data: posts, Pagination: &postPaginator}, w, http.StatusOK)
}

// GetByID returns the post with the given ID
func (pc *PostController) GetByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}
	post, err := pc.PostRepository.FindByID(id)
	if err != nil {
		NewAPIError(&APIError{false, "Could not find post", http.StatusNotFound}, w)
		return
	}

	NewAPIResponse(&APIResponse{Success: true, Data: post}, w, http.StatusOK)
}

// GetByIDAdmin returns the post with the given ID including hidden posts
func (pc *PostController) GetByIDAdmin(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}
	post, err := pc.PostRepository.FindByIDAdmin(id)
	if err != nil {
		NewAPIError(&APIError{false, "Could not find post", http.StatusNotFound}, w)
		return
	}

	NewAPIResponse(&APIResponse{Success: true, Data: post}, w, http.StatusOK)
}

// GetBySlug returns the post with the given slug
func (pc *PostController) GetBySlug(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]
	//slug := r.URL.EscapedPath()
	//slugRune := []rune(slug)
	//slug = string(slugRune[14:])
	q := r.URL.Query()
	getAuthorIDString := q.Get("getAuthorID")
	getAuthorID := false
	if getAuthorIDString != "" {
		getAuthorID = true
	}

	if !getAuthorID {
		resStatus, resCache := pc.checkSlugCache(slug)
		if resStatus {
			var res APIResponse
			err := json.Unmarshal(resCache, &res)
			if err != nil {
				log.Fatal(err)
			}
			log.Println("[INFO] Returned result from cache")
			NewAPIResponse(&res, w, http.StatusOK)
			return
		}
	}

	post, err := pc.PostRepository.FindBySlug(slug)
	if err != nil {
		NewAPIError(&APIError{false, "Could not find post", http.StatusNotFound}, w)
		return
	}

	if !getAuthorID {
		// Get author name
		author, err := pc.UserRepository.FindByID(post.AuthorID)
		if err != nil {
			post.AuthorID = "Unknown"
		} else {
			post.AuthorID = author.Name
		}

		// Cache result if author ID is not returned
		jPost, err := json.Marshal(&APIResponse{Success: true, Data: post})
		if err != nil {
			log.Println("[WARN] Failed to add post to cache")
			log.Println(err)
			// Still send result, but failed to add to cache
			NewAPIResponse(&APIResponse{Success: true, Data: post}, w, http.StatusOK)
			return
		}
		// Add query result to Redis cache
		val := pc.App.Redis.Set(slug, []byte(jPost), 0)
		if val.Err() != nil {
			log.Println("[WARN] Failed to add posts to cache")
			log.Println(err)
		}
		log.Println("Query result added to cache")
	}

	NewAPIResponse(&APIResponse{Success: true, Data: post}, w, http.StatusOK)
}

// GetBySlugAdmin returns the post with the given slug including hidden posts
func (pc *PostController) GetBySlugAdmin(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	slug := vars["slug"]

	q := r.URL.Query()
	getAuthorIDString := q.Get("getAuthorID")
	getAuthorID := false
	if getAuthorIDString != "" {
		getAuthorID = true
	}

	if !getAuthorID {
		resStatus, resCache := pc.checkAdminSlugCache(slug)
		if resStatus {
			var res APIResponse
			err := json.Unmarshal(resCache, &res)
			if err != nil {
				log.Fatal(err)
			}
			log.Println("[INFO] Returned result from admin cache")
			NewAPIResponse(&res, w, http.StatusOK)
			return
		}
	}

	post, err := pc.PostRepository.FindBySlugAdmin(slug)
	if err != nil {
		NewAPIError(&APIError{false, "Could not find post", http.StatusNotFound}, w)
		return
	}

	if !getAuthorID {
		// Get author name
		author, err := pc.UserRepository.FindByID(post.AuthorID)
		if err != nil {
			post.AuthorID = "Unknown"
		} else {
			post.AuthorID = author.Name
		}

		// Cache result if author ID is not returned
		jPost, err := json.Marshal(&APIResponse{Success: true, Data: post})
		if err != nil {
			log.Println("[WARN] Failed to add posts to admin cache")
			log.Println(err)
			// Still send result, but failed to add to cache
			NewAPIResponse(&APIResponse{Success: true, Data: post}, w, http.StatusOK)
			return
		}

		val := pc.App.Redis.HSet("admin-slug-hash", slug, []byte(jPost))
		if val.Err() != nil {
			log.Println("[WARN] Failed to add posts to admin cache")
			log.Println(err)
		}
		log.Println("Query result added to admin cache")
	}

	NewAPIResponse(&APIResponse{Success: true, Data: post}, w, http.StatusOK)
}

// Create creates a new post and returns its details
func (pc *PostController) Create(w http.ResponseWriter, r *http.Request) {
	uid, err := services.UserIDFromContext(r.Context())
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

	subtitle, err := j.GetString("subtitle")
	if err != nil {
		NewAPIError(&APIError{false, "Subtitle is required", http.StatusBadRequest}, w)
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

	if len(title) == 0 {
		NewAPIError(&APIError{false, "Title is invalid", http.StatusBadRequest}, w)
		return
	}

	body, err := j.GetString("body")
	if err != nil {
		NewAPIError(&APIError{false, "Content is required", http.StatusBadRequest}, w)
		return
	}

	//body = util.CleanZalgoText(body)

	if len(body) < 1 {
		NewAPIError(&APIError{false, "Body is too short", http.StatusBadRequest}, w)
		return
	}
	hidden, err := j.GetBool("hidden")
	if err != nil {
		hidden = false
	}

	tags, err := j.GetStringArray("tags")
	if err != nil {
		NewAPIError(&APIError{false, "Missing tags key", http.StatusBadRequest}, w)
		return
	}

	tags = rmDuplicateTags(tags)

	if !checkTags(tags) {
		NewAPIError(&APIError{false, "Contains bad tag", http.StatusBadRequest}, w)
	}

	imgURL, err := j.GetString("featureImgUrl")
	if err != nil || imgURL == "" {
		imgURL = "/assets/images/feature-default.png"
	}

	views := 0

	post := &models.Post{
		Title:         title,
		Slug:          slug,
		Body:          body,
		CreatedAt:     time.Now(),
		Tags:          tags,
		Hidden:        hidden,
		AuthorID:      uid,
		FeatureImgURL: imgURL,
		Subtitle:      subtitle,
		Views:         views,
	}

	err = pc.PostRepository.Create(post)
	if err != nil {
		NewAPIError(&APIError{false, "Could not create post", http.StatusBadRequest}, w)
		return
	}

	// TODO: Change this maybe put the user object into a context and get the author from there.
	//u, err := pc.UserRepository.FindById(uid)
	/*
		if err != nil {
			NewAPIError(&APIError{false, "Content is required", http.StatusBadRequest}, w)
			return
		}
	*/
	pc.flushCache()
	pc.flushTagsCache(tags)
	pc.flushSlugCache(slug)
	pc.flushAdminCache()
	pc.flushAdminSlugCache(slug)

	defer r.Body.Close()
	NewAPIResponse(&APIResponse{Success: true, Message: "Post created", Data: post}, w, http.StatusOK)
}

// Update updates the post with the given id and returns its new details
func (pc *PostController) Update(w http.ResponseWriter, r *http.Request) {
	_, err := services.UserIDFromContext(r.Context())
	if err != nil {
		NewAPIError(&APIError{false, "Something went wrong", http.StatusInternalServerError}, w)
		return
	}
	vars := mux.Vars(r)
	postID, err := strconv.Atoi(vars["id"])
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}
	post, err := pc.PostRepository.FindByIDAdmin(postID)
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

	slug := post.Slug[:8] + util.GenerateSlug(title)
	if len(slug) == 0 {
		NewAPIError(&APIError{false, "Title is invalid", http.StatusBadRequest}, w)
		return
	}

	subtitle, err := j.GetString("subtitle")
	if err != nil {
		NewAPIError(&APIError{false, "Subtitle is required", http.StatusBadRequest}, w)
		return
	}

	body, err := j.GetString("body")
	if err != nil {
		NewAPIError(&APIError{false, "Content is required", http.StatusBadRequest}, w)
		return
	}

	//body = util.CleanZalgoText(body)

	if len(body) < 1 {
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

	tags = rmDuplicateTags(tags)

	if !checkTags(tags) {
		NewAPIError(&APIError{false, "Contains bad tag", http.StatusBadRequest}, w)
	}

	imgURL, err := j.GetString("featureImgUrl")
	if err != nil || imgURL == "" {
		imgURL = "/assets/images/feature-default.png"
	}

	//post.UserID = uid
	post.UpdatedAt = pgtype.Timestamptz{Time: time.Now(), Status: pgtype.Present}
	post.Title = title
	post.Subtitle = subtitle
	post.Body = body
	post.Slug = slug
	post.Hidden = hidden
	post.Tags = tags
	post.FeatureImgURL = imgURL
	//post.ID = postId

	err = pc.PostRepository.Update(post)
	if err != nil {
		NewAPIError(&APIError{false, "Could not update post", http.StatusBadRequest}, w)
		return
	}
	pc.flushCache()
	pc.flushTagsCache(tags)
	pc.flushSlugCache(slug)
	pc.flushAdminCache()
	pc.flushAdminSlugCache(slug)

	NewAPIResponse(&APIResponse{Success: true, Message: "Post updated", Data: post}, w, http.StatusOK)
}

// Delete deletes the post with the given id
func (pc *PostController) Delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		NewAPIError(&APIError{false, "Invalid request", http.StatusBadRequest}, w)
		return
	}
	post, err := pc.PostRepository.FindByIDAdmin(id)
	if err != nil {
		log.Println(err)
		NewAPIError(&APIError{false, "Could not find post to delete", http.StatusNotFound}, w)
		return
	}
	err = pc.PostRepository.Delete(id)
	if err != nil {
		log.Println(err)
		NewAPIError(&APIError{false, "Could not find post to delete", http.StatusNotFound}, w)
		return
	}
	pc.flushCache()
	pc.flushTagsCache(post.Tags)
	pc.flushSlugCache(post.Slug)
	pc.flushAdminCache()
	pc.flushAdminSlugCache(post.Slug)

	NewAPIResponse(&APIResponse{Success: true, Data: id}, w, http.StatusOK)
}

// Search for posts using title and tags. Will not return nil data if search is successful.
func (pc *PostController) Search(w http.ResponseWriter, r *http.Request) {

	q := r.URL.Query()

	title := q.Get("title")

	if title == "" {
		NewAPIError(&APIError{false, "Title to search for is required", http.StatusBadRequest}, w)
		return
	}

	tags := q["tags"]
	if len(tags) == 0 {
		log.Println("No tags slice")
	}

	results, err := pc.PostRepository.SearchQuery(title, tags)

	if err != nil {
		NewAPIError(&APIError{false, "Failed to search", http.StatusBadRequest}, w)
		return
	}

	// If result is nil, set to empty array
	if results == nil {
		results = []*models.Post{}
	}

	NewAPIResponse(&APIResponse{Success: true, Message: "Successful search", Data: results}, w, http.StatusOK)

	return
}

// False -> pagination not in cache
// True -> pagination in cache
func (pc *PostController) checkCache(key string) (bool, []byte) {

	val := pc.App.Redis.HGet("page-hash", key)
	if val.Val() == "" {
		log.Println("[INFO] Key " + key + " not found in cache")
		return false, []byte("")
	} else if val.Err() != nil {
		panic(val.Err())
	}
	log.Println("[INFO] Key " + key + " found in cache")
	return true, []byte(val.Val())
}

// Returns if given slug is in slug cache
func (pc *PostController) checkSlugCache(slug string) (bool, []byte) {

	val, err := pc.App.Redis.Get(slug).Result()
	if err != nil && err != redis.Nil {
		log.Println(err)
		log.Println("[WARN] Failed to check slug cache")
		return false, []byte("")
	}
	if err == redis.Nil || val == "" {
		log.Println("[INFO] Slug " + slug + " not found in cache")
		return false, []byte("")
	}
	log.Println("[INFO] Slug " + slug + " found in cache")
	return true, []byte(val)
}

// Returns if given category is in category cache
func (pc *PostController) checkCategoryCache(category string, key string) (bool, []byte) {

	val := pc.App.Redis.HGet(category, key)
	if val.Val() == "" {
		log.Println("[INFO] Key " + key + " not found in cache")
		return false, []byte("")
	} else if val.Err() != nil {
		log.Println(val.Err())
	}
	log.Println("[INFO] Key " + key + " found in cache")
	return true, []byte(val.Val())
}

// False -> pagination not in admin cache
// True -> pagination in admin cache
func (pc *PostController) checkAdminCache(key string) (bool, []byte) {

	val := pc.App.Redis.HGet("admin-page-hash", key)
	if val.Val() == "" {
		log.Println("[INFO] Key " + key + " not found in admin hash")
		return false, []byte("")
	} else if val.Err() != nil {
		panic(val.Err())
	}
	log.Println("[INFO] Key " + key + " found in admin hash")
	return true, []byte(val.Val())
}

// Returns if given slug is in admin slug cache
func (pc *PostController) checkAdminSlugCache(slug string) (bool, []byte) {

	val := pc.App.Redis.HGet("admin-slug-hash", slug)
	if val.Val() == "" {
		log.Println("[INFO] Key " + slug + " not found in admin hash")
		return false, []byte("")
	} else if val.Err() != nil {
		panic(val.Err())
	}
	log.Println("[INFO] Key " + slug + " found in admin hash")
	return true, []byte(val.Val())
}

// Flushes pagination cache
func (pc *PostController) flushCache() {
	err := pc.App.Redis.Del("page-hash")
	if err.Err() != nil {
		log.Println(err.Err())
	}
	log.Println("[INFO] Flushed pagination hash")
	return
}

// Flushes slug cache
func (pc *PostController) flushSlugCache(slug string) {
	err := pc.App.Redis.Del(slug)
	if err.Err() != nil {
		log.Println(err.Err())
		log.Println("[WARN] Failed to flush slug cache")
		return
	}
	log.Println("[INFO] Flushed tags slug cache")
	return
}

// Flushes tags (category) cache
func (pc *PostController) flushTagsCache(tags []string) {
	for _, tag := range tags {
		err := pc.App.Redis.Del(tag)
		if err.Err() != nil {
			log.Println(err.Err())
		}
	}
	log.Println("[INFO] Flushed tags pagination hash")
	return
}

// Flushes admin pagination cache
func (pc *PostController) flushAdminCache() {
	err := pc.App.Redis.Del("admin-page-hash")
	if err.Err() != nil {
		log.Println(err.Err())
	}
	log.Println("[INFO] Flushed admin pagination hash")
	return
}

// Flushes admin slug cache
func (pc *PostController) flushAdminSlugCache(slug string) {
	err := pc.App.Redis.Del("admin-slug-hash", slug)
	if err.Err() != nil {
		log.Println(err.Err())
	}
	log.Println("[INFO] Flushed admin slug cache")
	return
}

// Removes any duplicate tags
func rmDuplicateTags(tags []string) []string {
	// Remove any duplicate tags by using them as a key in a map
	tagsMap := make(map[string]bool, len(tags))
	for _, tag := range tags {
		tagsMap[tag] = true
	}

	tags = make([]string, len(tagsMap))
	index := 0
	for tag := range tagsMap {
		tags[index] = tag
		index++
	}
	return tags
}

// Returns true if tags contains no keywords, false otherwise
func checkTags(tags []string) bool {
	for _, tag := range tags {
		// Check if page-hash
		if tag == "page-hash" {
			return false
		}
		// Check if slug
		matched, err := regexp.Match(`^\d{4}[\/]\d{2}[\/].`, []byte(tag))
		if err != nil {
			log.Println(err)
			log.Println("[WARN] Failed to check tags using regexp")
			return false
		}
		if matched {
			return false
		}
	}
	return true
}
