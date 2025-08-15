#!/bin/bash

echo "🚀 Запуск GreenTech Energy с Docker Compose..."

# Проверяем наличие Docker и Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Пожалуйста, установите Docker."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Пожалуйста, установите Docker Compose."
    exit 1
fi

# Создание файла .env если он не существует
if [ ! -f .env ]; then
    echo "📝 Создание файла .env из шаблона..."
    cp .env.example .env
    echo "⚠️  ВАЖНО: Отредактируйте файл .env и установите безопасные пароли!"
    echo "   Особенно важно изменить DB_PASSWORD и SESSION_SECRET"
    read -p "Нажмите Enter после редактирования .env файла..."
fi

# Создание директории для логов
mkdir -p logs

# Запуск контейнеров
echo "🐳 Запуск контейнеров..."
docker-compose -f docker-compose.prod.yml up -d --build

# Ожидание запуска базы данных
echo "⏳ Ожидание запуска базы данных..."
for i in {1..30}; do
    if docker-compose -f docker-compose.prod.yml exec -T db pg_isready -U greentech_user -d greentech_db &> /dev/null; then
        echo "✅ База данных запущена"
        break
    fi
    echo "Ожидание... ($i/30)"
    sleep 2
done

# Выполнение миграций
echo "🗄️ Выполнение миграций базы данных..."
docker-compose -f docker-compose.prod.yml exec app npm run db:push

# Создание пользователя администратора
echo "👤 Создание пользователя администратора..."
docker-compose -f docker-compose.prod.yml exec app tsx server/seed.ts

echo ""
echo "🎉 GreenTech Energy успешно запущен!"
echo ""
echo "📱 Основной сайт: http://localhost:5000"
echo "🔧 Админ-панель: http://localhost:5000/admin/login"
echo ""
echo "👤 Данные для входа в админ-панель:"
echo "   Логин: admin"
echo "   Пароль: admin"
echo ""
echo "📊 Для просмотра логов: docker-compose -f docker-compose.prod.yml logs -f"
echo "🛑 Для остановки: docker-compose -f docker-compose.prod.yml down"