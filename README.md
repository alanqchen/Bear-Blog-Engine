**Work-In-Progress**

[![Go Report Card](https://goreportcard.com/badge/github.com/alanqchen/bear-post)](https://goreportcard.com/report/github.com/alanqchen/bear-post)

# Bear Post
A Modern Blog Engine.

Uses Go for the backend and React (Next) for the frontend.
Databases used are PostgreSQL and Redis.

Status:
Styling post cards in index page


### Q: Why not a static blog?
A: A dynamic blog gives me the opportunity to learn working with databases and React. This is my first large project working with these, so while a static blog has lots of advantages, a dynamic blog is better my personal development.

## Compiling and Running

### Docker Compse

Since some files need to be created by you, you'll have to build the api image yourself.

First, navigate to the directory where you'll store the config and docker files:

```
cd /path/to/bearpost
```
Next, copy `Dockerfile` and `docker-compose.yml` into the directory. Then create the `backend` sub-directory and move to it:
```
mkdir backend
cd backend
```
Copy `backend/main.go`, `backend/go.mod`, and `backend/go.sum` into the `backend` directory. Then create the `config` sub-directory in
the `backend` directory and switch to it:
```
mkdir config
cd config
```

Use the given `backend/config/app-template.json` to make `app.json` in the directory and fill it out with the infomation of your own databases. 


Then, create the keys in the `config` directory:
```
openssl genrsa -out api.rsa
openssl rsa -in api.rsa -pubout > api.rsa.pub
```

Now you can go back to `/path/to/bearpost` and build the image using docker-compose:
```
cd /path/to/bearpost
docker-compose up
```

Note that the image for the frontend is still in the works.

### Cloning

Alternatively, you can clone the whole repository. Note that in `backend/config` you still need to fill out `app-template.json` and generate the keys.

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
- Post component styling (In progress)
- Search component (In progress)
- Admin login
- Admin dashboard
- Etc. (lots to do here)

*Later down the line*
- Comment support? (Very low-priority)
- Search by month/year (Need to add backend route)
- Add state persistence (Low-priority)

## Resources
Editor: Atlassian https://www.npmjs.com/package/@atlaskit/editor-core

Highlight.js in react: https://github.com/highlightjs/highlight.js/issues/925

(For my web server): https://www.varnish-software.com/wiki/content/tutorials/varnish/varnish_ubuntu.html
