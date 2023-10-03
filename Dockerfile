# Use the official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the local Node.js script to the container
COPY list-gcs-objects.js ./

# Run the Node.js script when the container starts
CMD ["node", "list-gcs-objects.js"]
