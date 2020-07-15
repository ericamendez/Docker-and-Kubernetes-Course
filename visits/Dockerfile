# This Dockerfile only has to do with setting up our Node container, not the redis container
FROM node:alpine

WORKDIR '/app'

# Only rebuild image anytime we change package.json file. 
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]