**Work-In-Progress**

<p align="center">
    <a href="https://goreportcard.com/report/github.com/alanqchen/bear-post">
        <img alt="Go Report Card" src="https://goreportcard.com/badge/github.com/alanqchen/bear-post" />
    </a>
    <a href="https://hub.docker.com/repository/docker/aqchen/bearpost-api">
        <img alt="Docker Cloud Build Status (API)" src="https://img.shields.io/docker/cloud/build/aqchen/bearpost-api?label=docker%20build%20api" />
    </a>
    <img alt="CI status" src="https://github.com/alanqchen/Bear-Post/workflows/CI%20Production/badge.svg" />
    <img alt="prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" />
</p>

# Bear Blog Engine / Bear Post
A Modern Blog Engine. Backend server required, not JAMStack.

## [Example Site](https://example.aqchen.com)

Uses Go (mux) for the backend and React (Next) for the frontend.
Databases used are PostgreSQL and Redis (auth & caching).

All you need to use Bear-Post is a server to host the backend API. The frontend CDN and SSL certs can be handled by Vercel with your own domain for free!

## Features

* SEO and performance optimized
* Backend uses Go for fast performance coupled with Redis for authentication and caching PostgreSQL requests
* WYSIWYG online markdown-based editor that also supports embeds
  * Same base editor used in [Outline](https://www.getoutline.com/)
  * Added custom ability to restore unsaved changes in the editor
  * Added custom embeds
  * Added raw markdown edit mode for compatibility with spell-checkers (like Grammarly)
* Support for multiple admin and editor users
* Support for hidden/draft posts
* Progressive Web Application (service-worker, offline cache, etc.)
* Support for permalinks
* Uses metadata for rich content in applications (such as Discord links)
* Keyset pagination to support infinite scrolling
* Login protected with reCaptcha
* Easy startup with docker-compose and Vercel

<strong>For images of the admin dashboard, go to [this pull request](https://github.com/alanqchen/Bear-Blog-Engine/pull/140)</strong>

<img src="https://user-images.githubusercontent.com/18543142/89113712-70958a80-d442-11ea-8e79-f373feb44990.png" width="50%" />

Lighthouse stats of index page:

<img src="https://i.imgur.com/q82nUYX.png" width="40%" />

Lighthouse stats of a post page:

<img src="https://i.imgur.com/hHMmZrj.png" width="40%" />

# Using Bear-Post

Find the start up information in the [`templates/backend-only` directory](templates/backend-only).
It will guide you through starting the API and deploying the frontend to Vercel.

### Q: Why not a static blog (Gatsby, Hugo, etc.)?
A: A dynamic, non-JAMStack, blog gives me the opportunity to learn working with databases and React. This is my first large project working with databases, React, Go, Docker, and such much more! So while a static blog has lots of advantages, a dynamic blog gives lots of opportunities to learn more. 

> What I cannot create, I do not understand - Richard Feynman

### Mockups

<p align="center">
    <img src="https://i.imgur.com/GD6TqiV.png" width="35%" />
    <img src="https://i.imgur.com/GuoFXNO.png" width="60%" />
</p>

<img src="https://i.imgur.com/zws45yA.png" width="40%" />
