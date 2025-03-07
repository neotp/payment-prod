# Stage 1: Build Angular Universal App
FROM node:19 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build:ssr

# Stage 2: Serve App with Nginx
FROM nginx:latest

# Copy Angular SSR output
COPY --from=build /app/dist/payment-ag/browser /usr/share/nginx/html
COPY --from=build /app/dist/payment-ag/server /app/server

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
