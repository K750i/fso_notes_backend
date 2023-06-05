const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./utils/config');
const logger = require('./utils/logger');
const notesRouter = require('./controllers/notes');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect(config.MONGODB_URI).catch(logger.info);
mongoose.connection.on('connected', () => logger.info('Connected to MongoDB'));
mongoose.connection.on('error', (error) =>
  logger.error('error connecting to MongoDB:', error.message)
);

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);
app.use(middleware.requestLogger);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
