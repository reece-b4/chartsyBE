# Dockerfile

# set node version. 18-alpine is a lightweight version of node
ARG NODE_VERSION=20.19.4
FROM node:${NODE_VERSION}-alpine

# Use the node user instead of root or your host's UID
USER node

#set working directory in the container
WORKDIR /home/node/app
# copy all files from the current directory to the working directory in the container
# this includes package.json and package-lock.json
# Set ownership to the 'node' user to avoid permission issues during install
COPY --chown=node:node . .

# combined with .dockerignore file