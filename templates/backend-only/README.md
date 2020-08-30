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
6. Fork the repo on GitHub add edit `frontend/config.json` and `.env.local` to fit the backend parameters and customization options
7. Add your PWA icons in `frontend/public/static/icons` and update `frontend/public/static/manifest.json` accordingly. Note that you don't have to replace them all (more a given than neccessary), but you should remove the icons you don't replace.
8. [Follow the instructions for connecting Vercel to your forked repo](https://vercel.com/docs/v2/git-integrations/vercel-for-github#connecting-with-github)
9. Your first deployment on Vercel may fail, this is expected. Add the following environment variables in the Vercel deployment and redeploy:
   - <strong>NEXT_PUBLIC_CAPTCHA_KEY</strong>: this should have the value of a ReCaptcha v2 key
   - <strong>NEXT_PUBLIC_API_URL</strong>: this should have the value of your API url (including https://)
10. Once your vercel deployment is up, goto `WEBSITE_URL/auth/portal/login` which show give you a setup page for your first admin:
<img src="https://i.imgur.com/OQil44L.png" width="50%" />

### External Databases
Follow the same steps as *Internal Databases*, but for step 4, make sure to edit the databases host, port, username, password, etc. to the correct values.
