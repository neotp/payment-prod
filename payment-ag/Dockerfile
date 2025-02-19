# Step 1: Use Node.js image to build the Angular app
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the Angular app
RUN npm run build --prod

# Step 2: Use Node.js to serve the Angular app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built files
COPY --from=build /app/dist/payment-ag ./dist

# Copy server files
COPY server.js ./
COPY package*.json ./
RUN npm install --only=production

# Copy SSL Certificatesอ
COPY cert.pem key.pem ./

# Expose HTTPS port
EXPOSE 443

# Start the Node.js HTTPS server
CMD ["node", "server.js"]