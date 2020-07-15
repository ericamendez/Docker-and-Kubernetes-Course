# Specify a base imae
FROM node:alpine

# This will copy files in the COPY instruction into the working directory we specify
WORKDIR /usr/app

# Install some dependencies, need npm installed to install node dependencies
COPY ./ ./
RUN npm install

# Default Command that runs when server is started
CMD ["npm", "start"]