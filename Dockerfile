#
# NEW FILE: noor-frontend/Dockerfile
# This file builds the React app and serves it with NGINX.
#

# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the app
# The API URL will be injected at runtime by NGINX
RUN npm run build

# Stage 2: Serve the app with NGINX
FROM nginx:1.27-alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom NGINX config
# This config does two things:
# 1. Serves the React app (index.html) for any path
# 2. Proxies /api/ requests to the backend service
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]