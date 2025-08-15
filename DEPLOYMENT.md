# Развертывание GreenTech Energy с Docker

Это руководство описывает, как развернуть приложение GreenTech Energy на сервере с помощью Docker Compose.

## Требования

- Docker (версия 20.10 или выше)
- Docker Compose (версия 2.0 или выше)
- Минимум 2GB RAM
- Минимум 10GB свободного места на диске

## Быстрый запуск

1. **Клонирование репозитория**
   ```bash
   git clone <repository-url>
   cd greentech-energy
   ```

2. **Настройка переменных окружения**
   
   Скопируйте и отредактируйте файл `docker-compose.yml`:
   ```bash
   cp docker-compose.yml docker-compose.prod.yml
   ```
   
   **ВАЖНО:** Измените следующие переменные в `docker-compose.prod.yml`:
   - `SESSION_SECRET` - установите уникальный секретный ключ
   - `POSTGRES_PASSWORD` и `PGPASSWORD` - установите надежный пароль
   - `POSTGRES_USER` и `PGUSER` - при необходимости измените имя пользователя

3. **Запуск приложения**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Инициализация базы данных**
   ```bash
   # Подождите 30 секунд, пока база данных запустится
   sleep 30
   
   # Запустите миграции базы данных
   docker-compose -f docker-compose.prod.yml exec app npm run db:push
   ```

5. **Создание администратора**
   ```bash
   # Выполните команду для создания пользователя администратора
   docker-compose -f docker-compose.prod.yml exec app npm run seed
   ```

## Проверка работы

После запуска приложение будет доступно по адресу:
- **Основной сайт**: http://localhost:5000
- **Админ-панель**: http://localhost:5000/admin/login

**Данные для входа в админ-панель:**
- Логин: `admin`
- Пароль: `admin`

## Управление

### Просмотр логов
```bash
docker-compose -f docker-compose.prod.yml logs -f app
```

### Остановка приложения
```bash
docker-compose -f docker-compose.prod.yml down
```

### Обновление приложения
```bash
# Остановка
docker-compose -f docker-compose.prod.yml down

# Обновление кода
git pull

# Пересборка и запуск
docker-compose -f docker-compose.prod.yml up -d --build
```

### Резервное копирование базы данных
```bash
docker-compose -f docker-compose.prod.yml exec db pg_dump -U greentech greentech > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Восстановление из резервной копии
```bash
docker-compose -f docker-compose.prod.yml exec -T db psql -U greentech greentech < backup.sql
```

## Производственная настройка

### SSL/HTTPS

Для использования в продакшене рекомендуется настроить обратный прокси (например, Nginx) с SSL сертификатами:

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Мониторинг

Для мониторинга состояния контейнеров:
```bash
docker-compose -f docker-compose.prod.yml ps
```

### Настройка автозапуска

Добавьте следующий сервис в systemd:

```ini
# /etc/systemd/system/greentech.service
[Unit]
Description=GreenTech Energy Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/path/to/greentech-energy
ExecStart=/usr/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Затем:
```bash
sudo systemctl enable greentech.service
sudo systemctl start greentech.service
```

## Решение проблем

### Приложение не запускается
1. Проверьте логи: `docker-compose logs app`
2. Убедитесь, что порт 5000 не занят другим приложением
3. Проверьте, что достаточно памяти

### База данных не подключается
1. Проверьте логи базы данных: `docker-compose logs db`
2. Убедитесь, что контейнер базы данных запущен: `docker-compose ps`
3. Проверьте переменные окружения для подключения к БД

### Админ-панель недоступна
1. Убедитесь, что база данных инициализирована
2. Проверьте, что пользователь admin создан: `docker-compose exec app npm run seed`

## Поддержка

При возникновении проблем:
1. Проверьте логи всех сервисов
2. Убедитесь, что все переменные окружения настроены правильно
3. Проверьте состояние всех контейнеров

Для получения дополнительной помощи обратитесь к документации Docker и PostgreSQL.