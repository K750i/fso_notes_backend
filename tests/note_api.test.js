const mongoose = require('mongoose');
const supertest = require('supertest');
const Note = require('../models/note');
const app = require('../app');
const api = supertest(app);

const initialNotes = [
  { content: 'HTML is easy', important: false },
  { content: 'Browser can execute only JavaScript', important: true },
];

beforeEach(async () => {
  await Note.deleteMany();
  await Note.create(initialNotes);
});

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all notes are returned', async () => {
  const response = await api.get('/api/notes');

  expect(response.body).toHaveLength(initialNotes.length);
});

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes');
  const contents = response.body.map((r) => r.content);

  expect(contents).toContain('Browser can execute only JavaScript');
});

afterAll(async () => {
  await mongoose.connection.close();
});
