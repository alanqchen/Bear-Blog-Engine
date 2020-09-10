# Backend

*This is information regarding development. If you're looking for information regarding production setup, see [templates](/templates).*

## Endpoints

The Postman API documentation can be found by [clicking here](https://documenter.getpostman.com/view/9220938/T17Aiqfc#6719391d-3a88-4a70-974b-52c1eeb51e42).

The Postman collection template for the API is provided in [bearblogengine.postman_collection.json](bearblogengine.postman_collection.json) located in this directory.


## docker-compose
This includes the backend API with databases

#### Requires
* docker
* docker-compose

1. Clone the repository if it hasn't been done yet
2. Navigate to the `backend` directory (the one this README is in)
3. Copy  `.env.sample` to `.env` and edit the variables
4. Copy the contents of the template `public` folder to the location where you mounted the container's  `public` folder
5. Run `docker-compose build`
6. Run `docker-compose up` or `docker-compose up -d`

Note that after any changes made to the API, you'll have to run `docker-compose build` again (not neccesary if you don't use the databases in docker-compose).
