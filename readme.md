# Сервис для сбора данных о тарифах из WB API

## Описание

Данный сервис предназначен для сбора данных о тарифах коробов из WB API и их обновления в указанных Google-таблицах.

## Подготовка к запуску

Для запуска сервиса необходимо иметь ключ от Google Service Account, идентификаторы Google таблиц, а также ключ от WB API.

### Google Service Account

1. В Google Cloud создать сервис-аккаунт (IAM & Admin > Service Accounts).
2. Для созданного аккаунта сгенерировать и локально сохранить ключ с именем `google_key.json` (IAM & Admin > Service Accounts > Manage keys > Add key > JSON). Данный ключ поместить в корневую директорию проекта.
3. Создать требуемое количество Google таблиц, в них создать лист `stocks_coefs`. ID таблицы можно взять из URL-адреса страницы.

### .env

В корневой директории необходимо создать файл `.env` и скопировать в него содержимое файла `example.env`. Этот файл содержит полный список параметров окружения для запуска приложения с примерами. Необходимо заполнить файл своими данными.

Необходимо указать `WB_API_KEY` и `GOOGLE_APPLICATION_SHEET_IDS`.

Данные для аутентификации в БД.

```
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

Порт, на котором запущено приложение.

```
APP_PORT=5000
```

URL-адрес WB API.

```
WB_API_URL=https://common-api.wildberries.ru/api/v1
```

Ключ для доступа к WB API.

```
WB_API_KEY=your_wb_api_key
```

Интервал опроса данных о тарифах (в секундах).

```
WB_QUERY_INTERVAL=3600
```

Путь до ключа от Google Service Account.

```
GOOGLE_APPLICATION_CREDENTIALS=./google_key.json
```

Список ID Google-таблиц, указанных через запятую

```
GOOGLE_APPLICATION_SHEET_IDS=spreadsheet_id1,spreadsheet_id2
```

## Запуск сервиса

Для запуска контейнера сервиса нужно использовать команду:

```
docker compose up
```

Для сборки и запуска контейнера сервиса нужно использовать команду:

```
docker compose up --build
```
