const notesRouter = require('express').Router();
const Note = require('../models/note');

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find();
  response.json(notes);
});

notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id);
    if (note) {
      response.json(note);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

notesRouter.post('/', async (request, response, next) => {
  const { content, important = false } = request.body;
  const newNote = { content, important };

  try {
    await Note.create(newNote);
    response.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
});

notesRouter.put('/:id', async (request, response, next) => {
  const note = {
    content: request.body.content,
    important: request.body.important,
  };

  try {
    const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
      new: true,
      runValidators: true,
      context: 'query',
    });
    response.json(updatedNote);
  } catch (error) {
    next(error);
  }
});

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = notesRouter;
