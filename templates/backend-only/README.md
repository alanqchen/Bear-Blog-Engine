# Backend Only Docker-Compose Template

**This template is perfect for deploying the frontend to Vercel and hosting the backend on a seperate server**

You have two options, *Internal Databases* (use Postgres and Redis in the docker-compose stack) or *External Databases* (your databases are hosted elsewhere, such as RedisLabs). By default, this template is configured for *Internal Databases*.

### IMPORTANT
Also by default, this template assumes you are using [docker-letsencrypt-nginx-proxy-companion](https://github.com/nginx-proxy/docker-letsencrypt-nginx-proxy-companion), which makes handling SSL certificates and container restarts easier. If you are not using it as your proxy, then you will likely have to manually configure your proxy yourself.

### Internal Databases Backend
1. Copy all files and subdirectories in this directory to your server
2. Copy  `.env.sample` to `.env` and edit the variables
3. Copy the contents of the template `public` folder to the location where you mounted the container's  `public` folder
4. [Get recaptcha v2 keys from google](https://developers.google.com/recaptcha/intro)
5. Edit `app-docker.json`, particularly database names and passwords, `allowedOrigins`, and `captchaSecret`(not recommended to change `host` and `port`)
6. Run `docker-compose up` or `docker-compose up -d` to start the backend

Note: If you ever need to dump a backup of the postgres db, run this command in the terminal:
```bash
docker exec  -e PGPASSWORD=<pg password> <pg container name> pg_dump -U <pg user> <pg database name> > backup.sql
```

### External Databases
Follow the same steps as *Internal Databases*, but for step 4, make sure to edit the databases host, port, username, password, etc. to the correct values.

### Frontend
1. Fork the repo on GitHub add edit `frontend/config.json` and `.env.local` to fit the backend parameters and customization options
2. Add your PWA icons in `frontend/public/static/icons` and update `frontend/public/static/manifest.json` accordingly. Note that you don't have to replace them all (more a given than neccessary), but you should remove the icons you don't replace.
3. [Follow the instructions for connecting Vercel to your forked repo](https://vercel.com/docs/v2/git-integrations/vercel-for-github#connecting-with-github)
4. Your first deployment on Vercel may fail, this is expected. Add the following environment variables in the Vercel deployment and redeploy:
   - <strong>NEXT_PUBLIC_CAPTCHA_KEY</strong>: this should have the value of a site (not secret) ReCaptcha v2 key
   - <strong>NEXT_PUBLIC_API_URL</strong>: this should have the value of your API url (including https://)
   - <strong>NEXT_PUBLIC_GA_TRACKING_ID</strong>: this should have the value of your Google Analytics tracking ID
5. Once your vercel deployment is up, goto `WEBSITE_URL/auth/portal/login` which show give you a setup page for your first admin:
<img src="https://i.imgur.com/OQil44L.png" width="50%" />

### CDN
Consider using Cloudflare as a CDN for your API assests route. If you do decide to use Cloudflare, remember to [follow Cloudflare's recommended page rules](https://support.cloudflare.com/hc/en-us/articles/200504045-Using-Cloudflare-with-your-API) (apply these page rules to `API_URL/api`). If you also add the domain to your Vercel (frontend) deployment to Cloudflare as a DNS record, make sure it's set to "DNS Only", not "Proxied".
