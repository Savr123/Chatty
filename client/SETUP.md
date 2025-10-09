# Настройка проекта Chatty

## Быстрая настройка

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка OpenSSL (только для Windows)

Скопируйте файл конфигурации OpenSSL в корень проекта:
```bash
Copy-Item "C:\Program Files\OpenSSL-Win64\bin\cnf\openssl.cnf" ".\openssl.cnf"
```

### 3. Настройка переменных окружения

Файл `.env` уже создан и содержит необходимые настройки:
```
# OpenSSL Configuration
OPENSSL_CONF=.\openssl.cnf

# API Configuration
REACT_APP_SERVER_HTTP_ROOT=http://localhost:8000/api
```

### 4. Запуск приложения
```bash
npm start
```

Приложение будет доступно по адресу: http://localhost:3000

## Альтернативная настройка OpenSSL

Если у вас проблемы с OpenSSL, попробуйте один из следующих способов:

### Способ 1: Отключить OpenSSL конфигурацию
```bash
set OPENSSL_CONF=
```

### Способ 2: Указать на системный файл
```bash
set OPENSSL_CONF=C:\Program Files\OpenSSL-Win64\bin\cnf\openssl.cnf
```

### Способ 3: Создать минимальный файл конфигурации
Создайте файл `openssl.cnf` в корне проекта со следующим содержимым:
```
# Minimal OpenSSL configuration
openssl_conf = openssl_init

[openssl_init]
providers = provider_sect

[provider_sect]
default = default_sect
legacy = legacy_sect

[default_sect]
activate = 1

[legacy_sect]
activate = 1
```

## Требования

- Node.js 14 или выше
- npm 6 или выше
- Backend API (ASP.NET Core) на порту 8000

## Устранение неполадок

### Проблема: OpenSSL configuration error
**Решение**: Убедитесь, что файл `openssl.cnf` существует в корне проекта и переменная `OPENSSL_CONF` указывает на него.

### Проблема: Приложение не запускается
**Решение**: 
1. Проверьте, что все зависимости установлены: `npm install`
2. Проверьте, что порт 3000 свободен
3. Проверьте переменные окружения в файле `.env`

### Проблема: API не отвечает
**Решение**: Убедитесь, что backend API запущен на порту 8000 и переменная `REACT_APP_SERVER_HTTP_ROOT` настроена правильно.
