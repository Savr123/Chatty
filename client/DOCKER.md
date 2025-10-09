# Docker инструкции для Chatty Client

## Сборка и запуск

### Использование Docker

#### Сборка образа
```bash
docker build -t chatty-client .
```

#### Запуск контейнера
```bash
docker run -d -p 3000:80 --name chatty-client chatty-client
```

Приложение будет доступно по адресу: http://localhost:3000

#### Остановка контейнера
```bash
docker stop chatty-client
```

#### Удаление контейнера
```bash
docker rm chatty-client
```

### Использование Docker Compose (рекомендуется)

#### Запуск Production версии
```bash
docker-compose up -d client
```

#### Запуск Development версии (с hot-reload)
```bash
docker-compose up -d client-dev
```

Development версия будет доступна по адресу: http://localhost:3001

Изменения в коде будут автоматически применяться без пересборки образа.

#### Просмотр логов
```bash
docker-compose logs -f client
# или для dev версии
docker-compose logs -f client-dev
```

#### Остановка
```bash
docker-compose down
```

#### Пересборка после изменений в зависимостях
```bash
docker-compose up -d --build client
# или для dev версии
docker-compose up -d --build client-dev
```

## Особенности Dockerfile

### Production (Dockerfile)

1. **Многоступенчатая сборка**: Использует два этапа
   - Этап 1: Node.js для сборки React приложения
   - Этап 2: Nginx для раздачи статических файлов

2. **Оптимизация размера**: Финальный образ основан на Alpine Linux (~50-100 MB)

3. **React Router поддержка**: Nginx настроен для корректной работы с client-side routing

4. **Production готовность**: Использует `npm ci` для детерминированной установки зависимостей

### Development (Dockerfile.dev)

1. **Hot Reload**: Автоматическая перезагрузка при изменении файлов

2. **Volumes**: Исходный код монтируется как volume, изменения применяются мгновенно

3. **Development сервер**: Использует `react-scripts start` с dev server

4. **Отладка**: Полный доступ к source maps и dev tools

## Переменные окружения

Если нужно передать переменные окружения в React-приложение, создайте `.env` файл и измените `docker-compose.yml`:

```yaml
services:
  client:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - REACT_APP_API_URL=${REACT_APP_API_URL}
    environment:
      - REACT_APP_API_URL=${REACT_APP_API_URL}
```

## Troubleshooting

### Проверка работы контейнера
```bash
docker ps
```

### Доступ к логам
```bash
docker logs chatty-client
```

### Вход внутрь контейнера
```bash
docker exec -it chatty-client sh
```

