# Запуск приложения

1. Перейти в папку backend
`cd backend`
2. Запустить сборку контейнера с Redis
`docker build -t myredis .`
3. Запустить контейнер 
`docker run -d --name myredis -p 6379:6379 myredis`
4. Запустить сервер 
`npm run dev`
5. Открыть второй терминал и перейти в папку frontend
`cd frontend`
6. Запустить приложение
`npm run dev`