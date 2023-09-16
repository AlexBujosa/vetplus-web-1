# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the entire React project to the container
COPY . .

# Build the React app for production
RUN npm run build

# Expose a port (e.g., 3000) for the React app to run
EXPOSE 3000

# Start the React app when the container is run
CMD ["npm", "run", "dev"]
