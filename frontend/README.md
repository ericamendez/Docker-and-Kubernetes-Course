This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Creating Production Grade Workflow

## Thinngs I Learned:
### Containerizing React App
- How to build image in React app by adding a `Dockerfile.dev` file in root directory and running the command `docker build -f Dockerfile.dev .` with the flag -f specifying the file we will use to build out the image.

### Docker Volumes
- Setting up Docker volumes to allow the docker container to reference files in my local machine, (and update changes immediately when made on my local machine). First build the image `docker build -f Dockerfile.dev` then run command `docker run -it -p 3000:3000 -v /app/node_modules -v ${pwd}:/app CONTAINER_ID`
    - `-v /app/node_modules` putting a bookmark on the node_modules folder (placeholder for a folder that is inside the container)
    - `-v ${pwd}:/app`
        - `-v` used to set up a volume
        - `$(pwd)` shortcut to the path of present working directory in machine
        - `:` we are saying we want to map up a folder outside a container to a folder inside a container
- How configure docker volumes in `docker-compose.yml` file so that we won't have to run the long command mentioned above. We could just do that all in docker-compose and run `docker-compose up` to build image and run it.

### Running React Test
- Run React test in Docker with `docker -it <CONTAINER_ID> npm run test` command