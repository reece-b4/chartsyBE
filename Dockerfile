# # Dockerfile
# # combined with .dockerignore file
# 
# # set node version via argument with default if none passed
# ARG NODE_VERSION=20.19.4
# # create base image with node version
# FROM node:${NODE_VERSION}-alpine
# 
# # Use the node user instead of root or your host's User ID
# # Running as node reduces security risks (e.g. accidentally changing root-owned files).
# # is consistent with FE in the project
# USER node
# 
# #set working directory in the container
# # this is user: nodes' home directory in our use case
# WORKDIR /home/node/app
# 
# # Install Neon CLI globally
# # RUN npm i -g neonctl
# 
# # copy all files from the current directory to the working directory in the container
# # this includes package.json and package-lock.json
# # Set ownership to the 'node' user to avoid permission issues during install
# # change ownership to node user
# # Copies package.json and package-lock.json from your host into the current container WORKDIR initially then copy all other files minus docker ignored files over (best practice this way as each instruction/layer is cached and so if no changes to a layer then it is not re-run ie, is faster)
# COPY --chown=node:node package*.json ./
# COPY --chown=node:node . .
# 
# # we are not installing dependencies or building here as we will use jenkins secrets to handle needed env vars
