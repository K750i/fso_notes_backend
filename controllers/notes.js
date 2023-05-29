const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', (request, response) => {
  Note.find().then((notes) => response.json(notes));
});

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch(next);
});

notesRouter.post('/', (request, response, next) => {
  const { content, important = false } = request.body;
  const newNote = { content, important };

  Note.create(newNote)
    .then(() => response.json(newNote))
    .catch(next);
});

notesRouter.put('/:id', (request, response, next) => {
  const note = {
    content: request.body.content,
    important: request.body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedNote) => response.json(updatedNote))
    .catch(next);
});

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(next);
});

module.exports = notesRouter;
