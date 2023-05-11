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

app.get('/api/notes/:id', (request, response) => {
  // const note = notes.find(note => note.id == request.params.id);
  const note = Note
    .findById(request.params.id)
    .then(note => response.json(note), err => response.status(404).end());
});

app.delete('/api/notes/:id', (request, response) => {
  notes = notes.filter(note => note.id != request.params.id);
  response.status(204).end();
});

app.post('/api/notes', (request, response) => {
  if (!request.body.content) {
    return response.status(400).json({
      error: 'content missing'
    });
  }

  const { content, important = false } = request.body;
  const newNote = { content, important };

  Note
    .create(newNote)
    .then(res => response.json(newNote));
});


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
