package controllers

import (
	"bytes"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/nickalie/go-webpbin"

	"github.com/alanqchen/Bear-Post/backend/util"
)

const (
	MB = 1 << 20
)

type UploadController struct{}
type UploadImageResponse struct {
	ImageURL string `json:"imageUrl"`
}
type UploadVideoResponse struct {
	VideoURL string `json:"videoUrl"`
}

func NewUploadController() *UploadController {
	return &UploadController{}
}

func (uc *UploadController) UploadImage(w http.ResponseWriter, r *http.Request) {
	contentType := r.Header.Get("Content-type")
	if !strings.Contains(contentType, "multipart/form-data") {
		NewAPIError(&APIError{false, "Invalid request body. Request body must be of type multipart/form-data", http.StatusBadRequest}, w)
		return
	}
	// Limit upload size
	r.Body = http.MaxBytesReader(w, r.Body, 2*MB)

	if err := r.ParseMultipartForm(2 * MB); err != nil {
		NewAPIError(&APIError{false, "The file you are uploading is too big. Maximum file size is 2MB", http.StatusBadRequest}, w)
		return
	}

	var Buf bytes.Buffer
	file, _, err := r.FormFile("image")
	if err != nil {
		if err == http.ErrMissingFile {
			NewAPIError(&APIError{false, "Image is required", http.StatusBadRequest}, w)
			return
		}
		NewAPIError(&APIError{false, "Error processing multipart data", http.StatusBadRequest}, w)
		return
	}
	defer file.Close()
	// Copy the file data to my buffer
	io.Copy(&Buf, file)

	// trash initilizations so that packages don't get removed. (Needed to decode images)
	_ = png.Encoder{}
	_ = jpeg.Options{}

	fileExtension := http.DetectContentType(Buf.Bytes())
	validFileExtensions := map[string]string{
		"image/jpeg": ".jpg",
		"image/png":  ".png",
		"image/gif":  ".gif",
		"image/webp": ".webp",
	}

	if _, ok := validFileExtensions[fileExtension]; !ok {
		NewAPIError(&APIError{false, "Invalid mime type, file must be of image/jpeg, image/png, image/gif, or image/webp", http.StatusBadRequest}, w)
		return
	}

	ext := validFileExtensions[fileExtension]

	now := time.Now()
	fileName := now.Format("2006-01-02_15-04-05") + "_" + util.GetMD5Hash(now.String())

	// .webp will only be saved in the /webp directory
	if ext == ".webp" {
		err = ioutil.WriteFile("./public/images/webp/"+fileName+ext, Buf.Bytes(), 0644)
		if err != nil {
			log.Println(err)
			NewAPIError(&APIError{false, "Could not write webp image", http.StatusInternalServerError}, w)
			return
		}
	} else {

		// .png and .jpeg images will be also saved as webp
		if ext != ".gif" {
			// Decode to get image type
			img, _, err := image.Decode(bytes.NewReader(Buf.Bytes()))
			if err != nil {
				NewAPIError(&APIError{false, "Failed to decode original image", http.StatusBadRequest}, w)
				log.Println(err)
				return
			}

			// Create webp image writer
			outWebp, err := os.Create("./public/images/webp/" + fileName + ".webp")
			if err != nil {
				NewAPIError(&APIError{false, "Failed to create webp image", http.StatusBadRequest}, w)
				return
			}
			defer outWebp.Close()

			// Encode image to webp
			err = webpbin.Encode(outWebp, img)
			if err != nil {
				NewAPIError(&APIError{false, "Failed to encode original image", http.StatusBadRequest}, w)
				err = os.Remove("./public/images/webp/" + fileName + ".webp")
				if err != nil {
					log.Println("[WARN] Failed to delete webp image after failed encoding")
				}
				return
			}

		}

		err = ioutil.WriteFile("./public/images/original/"+fileName+ext, Buf.Bytes(), 0644)
		if err != nil {
			log.Println(err)
			NewAPIError(&APIError{false, "Could not write original image", http.StatusInternalServerError}, w)
			return
		}

	}

	Buf.Reset()

	// TODO: Check if wildcard routes are possible - .webp should go to /public/images/webp while
	//   all other extensions should go to /public/images/original

	// TODO: Remove hardcoded url
	// imageSrc := util.GetRequestScheme(r) + r.Host + "/assets/images/" + fileName + ext
	imageSrc := "/assets/images/" + fileName + ext

	data := UploadImageResponse{imageSrc}

	NewAPIResponse(&APIResponse{Success: true, Message: "Image uploaded successfully", Data: data}, w, http.StatusOK)
}

func (uc *UploadController) UploadVideo(w http.ResponseWriter, r *http.Request) {
	contentType := r.Header.Get("Content-type")
	if !strings.Contains(contentType, "multipart/form-data") {
		NewAPIError(&APIError{false, "Invalid request body. Request body must be of type multipart/form-data", http.StatusBadRequest}, w)
		return
	}
	// Limit upload size
	r.Body = http.MaxBytesReader(w, r.Body, 500*MB)

	if err := r.ParseMultipartForm(500 * MB); err != nil {
		NewAPIError(&APIError{false, "The video you are uploading is too big. Maximum video size is 500MB", http.StatusBadRequest}, w)
		return
	}

	var Buf bytes.Buffer
	file, _, err := r.FormFile("video")
	if err != nil {
		if err == http.ErrMissingFile {
			NewAPIError(&APIError{false, "Video is required", http.StatusBadRequest}, w)
			return
		}
		NewAPIError(&APIError{false, "Error processing multipart data", http.StatusBadRequest}, w)
		return
	}
	defer file.Close()
	// Copy the file data to my buffer
	io.Copy(&Buf, file)

	fileExtension := http.DetectContentType(Buf.Bytes())
	validFileExtensions := map[string]string{
		"video/mp4": ".mp4",
	}

	if _, ok := validFileExtensions[fileExtension]; !ok {
		NewAPIError(&APIError{false, "Invalid video type, file must be of video/mp4", http.StatusBadRequest}, w)
		return
	}

	ext := validFileExtensions[fileExtension]

	now := time.Now()
	fileName := now.Format("2006-01-02_15-04-05") + "_" + util.GetMD5Hash(now.String())

	err = ioutil.WriteFile("./public/videos/"+fileName+ext, Buf.Bytes(), 0644)
	if err != nil {
		log.Println(err)
		NewAPIError(&APIError{false, "Could not write file to disk", http.StatusInternalServerError}, w)
		return
	}

	Buf.Reset()

	// TODO: Remove hardcoded url
	imageSrc := util.GetRequestScheme(r) + r.Host + "/assets/videos/" + fileName + ext

	data := UploadImageResponse{imageSrc}

	NewAPIResponse(&APIResponse{Success: true, Message: "Video uploaded successfully", Data: data}, w, http.StatusOK)
}
