// queries.js

// This module is now a function that takes the database pool as an argument
module.exports = (pool) => {

    const getNotes = async (request, response) => {
      try {
        const results = await pool.query('SELECT * FROM notes ORDER BY id ASC');
        response.status(200).json(results.rows);
      } catch (error) {
        console.error('Error in getNotes:', error);
        response.status(500).json({ error: error.message });
      }
    };

    const getNoteById = async (request, response) => {
      const id = parseInt(request.params.id);
      try {
        const results = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
        if (results.rows.length === 0) {
          return response.status(404).send(`Note not found with ID: ${id}`);
        }
        response.status(200).json(results.rows[0]);
      } catch (error) {
        console.error('Error in getNoteById:', error);
        response.status(500).json({ error: error.message });
      }
    };

    const createNote = async (request, response) => {
        console.log('Received body for createNote:', request.body);
        const { title, description } = request.body;
        if (!title || !description) {
            return response.status(400).json({ error: 'Title and description are required' });
        }
        try {
            const results = await pool.query(
                'INSERT INTO notes (title, description) VALUES ($1, $2) RETURNING *',
                [title, description]
            );
            response.status(201).json(results.rows[0]);
        } catch (error) {
            console.error('Error in createNote:', error);
            response.status(500).json({ error: error.message });
        }
    };

    const updateNote = async (request, response) => {
        const id = parseInt(request.params.id);
        const { title, content } = request.body;
        try {
            const results = await pool.query(
                'UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *',
                [title, content, id]
            );
            if (results.rows.length === 0) {
                return response.status(404).json({ error: `Note not found with ID: ${id}` });
            }
            response.status(200).json(results.rows[0]);
        } catch (error) {
            console.error('Error in updateNote:', error);
            response.status(500).json({ error: error.message });
        }
    };

    const deleteNote = async (request, response) => {
        const id = parseInt(request.params.id);
        try {
            const results = await pool.query('DELETE FROM notes WHERE id = $1 RETURNING *', [id]);
            if (results.rows.length === 0) {
                return response.status(404).json({ error: `Note not found with ID: ${id}` });
            }
            response.status(200).send(`Note deleted with ID: ${id}`);
        } catch (error) {
            console.error('Error in deleteNote:', error);
            response.status(500).json({ error: error.message });
        }
    };

    return {
        getNotes,
        getNoteById,
        createNote,
        updateNote,
        deleteNote
    };
};