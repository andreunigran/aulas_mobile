# Dockerfile - serve the static site with nginx
FROM nginx:stable-alpine
LABEL maintainer="andre <andre@example.com>"

# Remove default nginx index to avoid caching surprises (optional)
RUN rm -rf /usr/share/nginx/html/*

# Copy site files
COPY . /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Run nginx in foreground (default in image)
CMD ["nginx", "-g", "daemon off;"]
