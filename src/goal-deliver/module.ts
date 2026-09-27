import { FastifyInstance } from 'fastify';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const notes: Note[] = [];

export default async function noteService(fastify: FastifyInstance) {
  // GET /notes - Retrieve all notes
  fastify.get('/notes', async () => {
    return notes;
  });

  // GET /notes/:id - Retrieve a specific note
  fastify.get('/notes/:id', async (request) => {
    const { id } = request.params as { id: string };
    const note = notes.find(n => n.id === id);
    if (!note) {
      throw fastify.httpErrors.notFound('Note not found');
    }
    return note;
  });

  // POST /notes - Create a new note
  fastify.post('/notes', async (request) => {
    const { title, content } = request.body as { title: string; content: string };
    
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    notes.push(newNote);
    return newNote;
  });

  // PUT /notes/:id - Update an existing note
  fastify.put('/notes/:id', async (request) => {
    const { id } = request.params as { id: string };
    const { title, content } = request.body as { title: string; content: string };
    
    const noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex === -1) {
      throw fastify.httpErrors.notFound('Note not found');
    }
    
    notes[noteIndex] = {
      ...notes[noteIndex],
      title,
      content,
      updatedAt: new Date(),
    };
    
    return notes[noteIndex];
  });

  // DELETE /notes/:id - Delete a note
  fastify.delete('/notes/:id', async (request) => {
    const { id } = request.params as { id: string };
    const noteIndex = notes.findIndex(n => n.id === id);
    
    if (noteIndex === -1) {
      throw fastify.httpErrors.notFound('Note not found');
    }
    
    notes.splice(noteIndex, 1);
    return { message: 'Note deleted successfully' };
  });
}
