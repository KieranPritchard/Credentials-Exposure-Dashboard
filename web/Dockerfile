# 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependency files first to leverage Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the frontend code and build
COPY . .
RUN npm run build

# 2: Serve with Nginx Production Server
FROM nginx:alpine-slim

# Copy the bundled static assets from the builder stage into Nginx's public folder
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]