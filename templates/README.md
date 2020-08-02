# Template files for docker-compose

The recommended option of using Bear-Post is to host the frontend on Vercel and host the backend on your server.
Vercel handles CDN and SSL certs for you, has a free plan, and you can add your custom domain.
Follow the instructions in the `backend-only` directory to deploy.


If you want to host the frontend on your own server, a docker image `aqchen/bearpost-frontend` is hosted on Docker Hub which you can add to the `docker-compose.yml` file.
However, keep in mind that you'll have to manage SSL certs and any neccessay proxies for the frontend yourself.
