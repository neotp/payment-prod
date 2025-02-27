# Use Node.js as base image
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the entire project
COPY . .

# Increase Angular budget limits automatically
RUN sed -i 's/"maximumError": "1.05mb"/"maximumError": "3mb"/g' angular.json

# Build the Angular app
RUN npx ng build --configuration=production

# Use Nginx for serving the app
FROM nginx:alpine

# Copy built Angular files to Nginx
COPY --from=build /app/dist/payment-ag /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf


# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
