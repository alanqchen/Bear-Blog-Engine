**Work-In-Progress**

<p align="center">
    <a href="https://goreportcard.com/report/github.com/alanqchen/bear-post">
        <img alt="Go Report Card" src="https://goreportcard.com/badge/github.com/alanqchen/bear-post" />
    </a>
    <a href="https://hub.docker.com/repository/docker/aqchen/bearpost-api">
        <img alt="Docker Cloud Build Status (API)" src="https://img.shields.io/docker/cloud/build/aqchen/bearpost-api?label=docker%20build%20api" />
    </a>
    <img alt="CI status" src="https://github.com/alanqchen/Bear-Post/workflows/CI%20Production/badge.svg" />
    <a href="https://example.aqchen.com">
        <img alt="Example Website" src="https://img.shields.io/website?label=example%20site&up_message=Online&url=https%3A%2F%2Fexample.aqchen.com" />
    </a>
</p>

# Bear Blog Engine / Bear Post
A Modern Blog Engine. Backend server required, not JAMStack.

<strong>[Example Site](https://example.aqchen.com)</strong>

Uses Go (mux) for the backend and React (Next) for the frontend.
Databases used are PostgreSQL and Redis (auth & caching).

All you need to use Bear-Post is a server to host the backend API. The frontend CDN and SSL certs can be handled by Vercel with your own domain for free!

![image](https://user-images.githubusercontent.com/18543142/89113712-70958a80-d442-11ea-8e79-f373feb44990.png)

Current lighthouse stats(PWA hopefully soon):

![image](https://user-images.githubusercontent.com/18543142/87865583-293cd380-c945-11ea-9aaa-4e58bdafa203.png)

## Features

* SEO and performance optimized
* WYSIWYG online markdown-based editor that also supports embeds
* Support for multiple admin and editor users
* Support for hidden/draft posts
* Progressive Web Application (service-worker, offline cache, etc.)

<strong>For images of the admin dashboard, go to [this pull request](https://github.com/alanqchen/Bear-Blog-Engine/pull/140)</strong>

# Using Bear-Post

Find the start up information in the [`templates/backend-only` directory](templates/backend-only).
It will guide you through starting the API and deploying the frontend to Vercel.

### Q: Why not a static blog?
A: A dynamic blog gives me the opportunity to learn working with databases and React. This is my first large project working with these, so while a static blog has lots of advantages, a dynamic blog gives lots of opportunities to learn more.

> What I cannot create, I do not understand - Richard Feynman

*Later down the line*
- Comment support
- Search by month/year
