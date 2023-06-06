require('dotenv').config();
const mongoose = require('mongoose');
const Note = require('./models/note');
const logger = require('./utils/logger');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.TEST_MONGODB_URI).catch(logger.info);

const note1 = { content: 'Example note 1', important: true };
const note2 = { content: 'Example note 2', important: false };

Note.create([note1, note2]).then((res) => {
  logger.info(res);
  mongoose.connection.close();
});
