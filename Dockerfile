# ============================
# 1) Dependencies Stage
# ============================
FROM node:20-alpine AS dependencies

RUN apk update && apk upgrade --no-cache

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts

# ============================
# 2) Build Stage
# ============================
FROM dependencies AS build
COPY . .
ARG APP_VERSION=0.0.0
ARG VITE_BASE_URL=/dsp/
ARG VITE_DSP_API_URL=/dsp-backend
ENV APP_VERSION=$APP_VERSION
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_DSP_API_URL=$VITE_DSP_API_URL
# Ensure the artifact env.json uses the build URL (not local-dev localhost)
RUN mkdir -p public/config \
    && printf '{"urlBackend":"%s"}\n' "$VITE_DSP_API_URL" > public/config/env.json
RUN npm run build-only
RUN echo "$APP_VERSION" > dist/version.txt

# ============================
# 3) Runtime Stage
# ============================
FROM nginx:alpine

RUN apk update && apk upgrade --no-cache

# Publica o SPA em /dsp/ (mesmo path do VITE_BASE_URL)
COPY --from=build /app/dist/ /usr/share/nginx/html/dsp/
RUN rm -f /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx && \
    chmod -R 755 /var/cache/nginx && \
    touch /tmp/nginx.pid && \
    chown nginx:nginx /tmp/nginx.pid

EXPOSE 8080
USER nginx
