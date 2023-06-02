const Note = require('../models/note');

exports.initialNotes = [
  { content: 'HTML is easy', important: false },
  { content: 'Browser can execute only JavaScript', important: true },
];

exports.nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' });
  await note.save();
  await note.deleteOne();

  return note._id.toString();
};

exports.notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map((note) => note.toJSON());
};