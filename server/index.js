require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const corsMiddleware = require('./middleware/cors.middleware');

const connect = require('./connect');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use(corsMiddleware);
app.use('/api', routes);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
