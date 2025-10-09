# Этап 1: Сборка приложения
FROM node:18-alpine AS build

# Установка рабочей директории
WORKDIR /app

# Копирование файлов зависимостей
COPY package.json package-lock.json ./

# Установка зависимостей
RUN npm ci --silent

# Копирование исходного кода
COPY . .

# Сборка приложения для production
RUN npm run build

# Этап 2: Production образ с nginx
FROM nginx:alpine

# Копирование собранного приложения из этапа build
COPY --from=build /app/build /usr/share/nginx/html

# Копирование конфигурации nginx для React Router
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Открытие порта
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]

