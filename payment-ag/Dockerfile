# Stage 1: Build the Angular Universal (SSR) app
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . . 
RUN npm run build:ssr

# Stage 2: Serve App with Nginx
FROM nginx:latest

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the Angular Universal SSR output
COPY --from=build /app/dist/payment-ag/browser /usr/share/nginx/html
COPY --from=build /app/dist/payment-ag/server /app/server

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 7070
CMD ["nginx", "-g", "daemon off;"]
