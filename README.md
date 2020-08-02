**Work-In-Progress**

<p align="center">
    <a href="https://goreportcard.com/report/github.com/alanqchen/bear-post">
        <img alt="Go Report Card" src="https://goreportcard.com/badge/github.com/alanqchen/bear-post" />
    </a>
    <a href="https://hub.docker.com/repository/docker/aqchen/bearpost-api">
        <img alt="Docker Cloud Build Status (API)" src="https://img.shields.io/docker/cloud/build/aqchen/bearpost-api?label=docker%20build%20api" />
    </a>
    <a href="https://hub.docker.com/repository/docker/aqchen/bearpost-frontend">
        <img alt="Docker Cloud Build Status (Frontend)" src="https://img.shields.io/docker/cloud/build/aqchen/bearpost-frontend?label=docker%20build%20frontend" />
    </a>
    <a href="https://example.aqchen.com">
        <img alt="Example Website" src="https://img.shields.io/website?label=example%20site&up_message=Online&url=https%3A%2F%2Fexample.aqchen.com" />
    </a>
</p>

# Bear Post
A Modern Blog Engine. Server-side, not JAMStack.

Uses Go for the backend and React (Next) for the frontend.
Databases used are PostgreSQL and Redis.

All you need to use Bear-Post is a server to host the backend API. The frontend CDN and SSL certs can be handled by Vercel with your own domain for free!

![image](https://user-images.githubusercontent.com/18543142/89113712-70958a80-d442-11ea-8e79-f373feb44990.png)

Current lighthouse stats(PWA hopefully soon):

![image](https://user-images.githubusercontent.com/18543142/87865583-293cd380-c945-11ea-9aaa-4e58bdafa203.png)

## Features

* SEO and performance optimized
* WYSIWYG online mardown-based editor 
* Support for one admin user and multiple editor users
* Support for hidden/draft posts

# Using Bear-Post

Find the start up information in the [`templates/backend-only` directory](templates/backend-only).
It will guide you through starting the API and deploying the frontend to Vercel.

### Q: Why not a static blog?
A: A dynamic blog gives me the opportunity to learn working with databases and React. This is my first large project working with these, so while a static blog has lots of advantages, a dynamic blog is better my personal development.

*Later down the line*
- Comment support? (Very low-priority)
- Search by month/year (Need to add backend route)
