// server.js
const path = require('path');
const fastify = require('fastify')({ logger: true });

// Подключение плагинов
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
});
fastify.register(require('fastify-formidable')); // Для обработки POST данных формы
fastify.register(require('fastify-sensible')); // Для удобных ответов и ошибок
fastify.register(require('fastify-views'), {
  engine: { pug: require('pug') },
  templates: path.join(__dirname, 'views'),
});

// Имитация базы данных (массив пользователей)
let users = [
  { id: 1, name: 'Иван Петров', email: 'ivan.petrov@example.com' },
  { id: 2, name: 'Мария Сидорова', email: 'maria.sidorova@example.com' },
];
let nextUserId = 3; // Для генерации уникальных ID

// --- Эндпоинты ---

// GET /users - Отображение списка пользователей
fastify.get('/users', async (request, reply) => {
  return reply.view('./users.pug', { users: users });
});

// GET /users/create - Отображение формы создания пользователя
fastify.get('/users/create', async (request, reply) => {
  return reply.view('./create_user.pug');
});

// POST /users - Создание нового пользователя
fastify.post('/users', async (request, reply) => {
  const { name, email } = request.body;

  if (!name || !email) {
    return reply.status(400).send({ message: 'Имя и email обязательны' });
  }

  const newUser = {
    id: nextUserId++,
    name,
    email,
  };
  users.push(newUser);
  
  // Перенаправляем на список пользователей после успешного добавления
  reply.redirect('/users');
});

// --- Запуск сервера ---
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(`Сервер запущен на http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
