FROM node:20-alpine

# Установка зависимостей для сборки
RUN apk add --no-cache python3 make g++

# Создание рабочей директории
WORKDIR /app

# Копирование файлов package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm ci --only=production

# Копирование остальных файлов проекта
COPY . .

# Сборка проекта
RUN npm run build

# Создание пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Создание директории для логов
RUN mkdir -p /app/logs && chown -R nextjs:nodejs /app/logs

# Переключение на пользователя nodejs
USER nextjs

# Открытие порта
EXPOSE 5000

# Запуск приложения
CMD ["npm", "start"]