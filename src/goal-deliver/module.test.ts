import { test } from 'tap';
import Fastify from 'fastify';
import noteService from './module';

const fastify = Fastify({ logger: false });

// Register the plugin
fastify.register(noteService);

// Test data
const testNote = {
  title: 'Test Note',
  content: 'This is a test note content',
};

test('GET /notes should return empty array when no notes exist', async (t) => {
  const response = await fastify.inject({
    method: 'GET',
    url: '/notes',
  });

  t.equal(response.statusCode, 200);
  t.same(JSON.parse(response.payload), []);
  t.end();
});

test('POST /notes should create a new note', async (t) => {
  const response = await fastify.inject({
    method: 'POST',
    url: '/notes',
    payload: testNote,
  });

  const note = JSON.parse(response.payload);
  t.equal(response.statusCode, 200);
  t.equal(note.title, testNote.title);
  t.equal(note.content, testNote.content);
  t.ok(note.id);
  t.ok(note.createdAt);
  t.ok(note.updatedAt);
  t.end();
});

test('GET /notes/:id should return a specific note', async (t) => {
  // First create a note to get its ID
  const createResponse = await fastify.inject({
    method: 'POST',
    url: '/notes',
    payload: testNote,
  });

  const createdNote = JSON.parse(createResponse.payload);
  
  const response = await fastify.inject({
    method: 'GET',
    url: `/notes/${createdNote.id}`,
  });

  t.equal(response.statusCode, 200);
  t.equal(response.payload, JSON.stringify(createdNote));
  t.end();
});

test('PUT /notes/:id should update an existing note', async (t) => {
  // First create a note
  const createResponse = await fastify.inject({
    method: 'POST',
    url: '/notes',
    payload: testNote,
  });

  const createdNote = JSON.parse(createResponse.payload);
  
  const updatedPayload = {
    title: 'Updated Title',
    content: 'Updated content',
  };
  
  const response = await fastify.inject({
    method: 'PUT',
    url: `/notes/${createdNote.id}`,
    payload: updatedPayload,
  });

  const updatedNote = JSON.parse(response.payload);
  t.equal(response.statusCode, 200);
  t.equal(updatedNote.title, updatedPayload.title);
  t.equal(updatedNote.content, updatedPayload.content);
  t.ok(updatedNote.updatedAt > createdNote.updatedAt);
  t.end();
});

test('DELETE /notes/:id should delete a note', async (t) => {
  // First create a note
  const createResponse = await fastify.inject({
    method: 'POST',
    url: '/notes',
    payload: testNote,
  });

  const createdNote = JSON.parse(createResponse.payload);
  
  const response = await fastify.inject({
    method: 'DELETE',
    url: `/notes/${createdNote.id}`,
  });

  t.equal(response.statusCode, 200);
  t.equal(response.payload, JSON.stringify({ message: 'Note deleted successfully' }));
  
  // Verify the note is deleted
  const getResponse = await fastify.inject({
    method: 'GET',
    url: `/notes/${createdNote.id}`,
  });
  
  t.equal(getResponse.statusCode, 404);
  t.end();
});
