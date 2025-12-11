const express = require('express');
const cors = require('cors');
const contactsRouter = require('./routes/contacts');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'));
app.use(logger);

// Маршруты
app.use('/api/contacts', contactsRouter);

// Старт сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
});