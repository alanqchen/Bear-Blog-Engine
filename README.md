**Work-In-Progress**

# Bear Post
A Modern Blog Engine.

Uses Go for the backend and React (Next) for the frontend.
Databases used are PostgreSQL and Redis.

Status:
Styling post cards in index page


### Q: Why not a static blog?
### A: A dynamic blog allows me to learn more.
A dynamic blog gives me the opportunity to learn working with databases and React. This is my first large project working with these, so while a static blog has lots of advantages, a dynamic blog is better my personal development.

## Compiling and Running
In the backend directory, run
```go run main.go```

In the frontend directory, run
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
