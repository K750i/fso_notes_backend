require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Note = require('./models/note');
const app = express();

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
  Note
    .find()
    .then(notes => response.json(notes));
});

app.get('/api/notes/:id', (request, response, next) => {
  Note
    .findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch(next);
});

app.delete('/api/notes/:id', (request, response, next) => {
  Note
    .findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(next);
});

app.post('/api/notes', (request, response, next) => {
  const { content, important = false } = request.body;
  const newNote = { content, important };

  Note
    .create(newNote)
    .then(res => response.json(newNote))
    .catch(next);
});

app.put('/api/notes/:id', (request, response, next) => {
  const note = {
    content: request.body.content,
    important: request.body.important
  };

  Note
    .findByIdAndUpdate(
      request.params.id,
      note,
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedNote => response.json(updatedNote))
    .catch(next);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

// Error handler
app.use((error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  next(error);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
