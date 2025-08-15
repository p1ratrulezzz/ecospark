-- Инициализация базы данных для GreenTech Energy

-- Создание таблицы сессий для connect-pg-simple
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- Создание расширений если нужно
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Информационное сообщение
DO $$
BEGIN
    RAISE NOTICE 'База данных GreenTech Energy успешно инициализирована';
END $$;