const mongoose = require('mongoose');
require('dotenv').config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('Подключение к базе данных успешно');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }
};

connect();
