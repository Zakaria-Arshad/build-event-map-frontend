# Use an official Node.js runtime as a parent image, specifically version 18.17.1
FROM node:18.17.1

# Set the working directory in the container
WORKDIR /app

# Copy package.json (and package-lock.json if present)
COPY package*.json ./

# Clear out existing node_modules and package-lock.json, then install dependencies
RUN rm -rf node_modules package-lock.json && npm i

# Copy the rest of your frontend code
COPY . .

# Make port 5173 available to the world outside this container
EXPOSE 5173

# Run npm run dev when the container launches
CMD ["npm", "run", "dev"]


