const express = require('express');
const cors = require('cors');
const app = express();

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(note => note.id))
    : 0;
  return maxId + 1;
};

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
  const note = notes.find(note => note.id == request.params.id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
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
  const newNote = { id: generateId(), content, important };

  notes = [...notes, newNote];
  response.json(newNote);
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
