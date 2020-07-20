**Work-In-Progress**

<p align="center">
  
[![Go Report Card](https://goreportcard.com/badge/github.com/alanqchen/bear-post)](https://goreportcard.com/report/github.com/alanqchen/bear-post)
![Docker Cloud Build Status (API)](https://img.shields.io/docker/cloud/build/aqchen/bearpost-api?label=docker%20build%20api)
![Docker Cloud Build Status (Frontend)](https://img.shields.io/docker/cloud/build/aqchen/bearpost-frontend?label=docker%20build%20frontend)
![Website](https://img.shields.io/website?label=example%20site&up_color=green&up_message=Online&url=https%3A%2F%2Fexample.aqchen.com)

</p>

# Bear Post
A Modern Blog Engine.

Uses Go for the backend and React (Next) for the frontend.
Databases used are PostgreSQL and Redis.

Status:
Working on login

Current lighthouse stats(PWA hopefully soon):

![image](https://user-images.githubusercontent.com/18543142/87865583-293cd380-c945-11ea-9aaa-4e58bdafa203.png)


### Q: Why not a static blog?
A: A dynamic blog gives me the opportunity to learn working with databases and React. This is my first large project working with these, so while a static blog has lots of advantages, a dynamic blog is better my personal development.

## Compiling and Running (Needs to be updated)

### Docker Compse (Recommened)

First, navigate to the directory where you'll store the docker files:

```
cd /path/to/bearpost
```

Then download/copy the files in the [templates directory](templates), except for README.md, into the same directory. Make sure
to change the url `frontend/api.json` to the base api url you'll be using. In a standard development environment this will most likely
be `"http://localhost:8080"`.

Run `docker-compose up` and the backend should start.

Note that the image for the frontend is still in the works.

### Cloning / External Databases

Clone the repository. Rename `backend/config/app.json` to `backend/config/app-production.json`. Fill it out with the information of your databases, if external.

Navigate to `backend/config/` and generate the keys:

```
openssl genrsa -out api.rsa
openssl rsa -in api.rsa -pubout > api.rsa.pub
```

In the `backend` directory, run
```go run main.go```

In the `frontend` directory, run
```npm run dev```
for development mode.

## TODO (An incomplete list):
### Backend
- ~~Change post slugs to include year and month (Ex. blog.com/2020/02/post-title)~~
- ~~Add asset image url for both header and preview for posts~~
- ~~Add search by tags~~
- ~~Add support for hidden posts~~
- ~~Add cache in Redis for pagination pages (high-priority)~~

### Frontend
- ~~Post component data~~
- ~~Post component styling~~
- ~~Add state persistence~~
- Search component (In progress)
- Admin login (In progress)
- Admin dashboard
- Etc. (lots to do here)

*Later down the line*
- Comment support? (Very low-priority)
- Search by month/year (Need to add backend route)

## Resources
Editor: Atlassian https://www.npmjs.com/package/@atlaskit/editor-core

Highlight.js in react: https://github.com/highlightjs/highlight.js/issues/925
