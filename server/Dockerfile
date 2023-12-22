# Use the official Node.js image as the base image
FROM node:21

# Set the working directory in the container
WORKDIR /

COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the application files into the working directory
COPY . .

# TCP port
EXPOSE 3000/tcp

# Define the entry point for the container
CMD ["node", "server.js"]