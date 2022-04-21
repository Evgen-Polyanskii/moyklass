# Веб-сервер для работы с данными учебных занятий

## Локальная установка

```
# Клонировать проект
git clone git@github.com:Evgen-Polyanskii/moyklass.git

# Перейти в директорию проекта
cd moyklass

# Установка
make setup

```

## Запуск

```
make start

```

## Примеры запросов

```
# GET /

telnet localhost 5000
GET / HTTP/1.1
Host: localhost
Content-Length: 90
Content-Type: application/json

{
"date": "2019-01-02,2019-12-01",
"teacherIds": "3",
"status": "1",
"page": "1"
}

# POST /lessons

telnet localhost 5000
POST /lessons HTTP/1.1
Host: localhost
Content-Length: 130
Content-Type: application/json

{
"title": "Blue Ocean",
"firstDate": "2022-04-19",
"teacherIds": [4,2],
"lastDate": "2022-05-23",
"days": [0, 1, 6]
}
```
 


