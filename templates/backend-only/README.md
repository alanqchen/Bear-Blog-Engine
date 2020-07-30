# Backend Only Docker-Compose Template

**This template is perfect for deploying the frontend to Vercel and hosting the backend on a seperate server**

You have two options, *Internal Databases* (use Postgres and Redis in the docker-compose stack) or *External Databases* (your databases are hosted elsewhere, such as RedisLabs). By default, this template is configured for *Internal Databases*.

### IMPORTANT
Also by default, this template assumes you are using [docker-letsencrypt-nginx-proxy-companion](https://github.com/nginx-proxy/docker-letsencrypt-nginx-proxy-companion), which makes handling SSL certificates and container restarts easier. If you are not using it as your proxy, then you will likely have to manually configure your proxy yourself.

### Internal Databases
1. Copy all files and subdirectories in this directory to your server
2. Copy  `.env.sample` to `.env` and edit the variables
3. Copy the contents of the template `public` folder to the location where you mounted the container's  `public` folder
4. Edit `app-docker.json`, particularly database names and passwords, and `allowedOrigins` (not recommended to change `host` and `port`)
5. Run `docker-compose up` or `docker-compose up -d` to start the backend

### External Databases
Follow the same steps as *Internal Databases*, but for step 4, make sure to edit the databases host, port, username, password, etc. to the correct values.
