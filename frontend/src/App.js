import React, { useState, useEffect } from 'react';
import NoteList from './components/NoteList';
import AddNoteForm from './components/AddNoteForm';
import { getNotes, createNote, deleteNote } from './services/notesApi';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch notes when the component first mounts
    getNotes()
      .then(response => {
        setNotes(response.data);
      })
      .catch(err => {
        console.error("Error fetching notes:", err);
        setError("Could not fetch notes from the server.");
      });
  }, []); // The empty array ensures this effect runs only once

  const handleNoteAdded = (newNote) => {
    createNote(newNote)
      .then(() => {
        // After successfully creating the note, refresh the list
        return getNotes();
      })
      .then(response => {
        setNotes(response.data);
      })
      .catch(err => {
        console.error("Error adding note:", err);
        setError("Could not add the new note.");
      });
  };

  const handleNoteDelete = (id) => {
    deleteNote(id)
      .then(() => {
        // After successfully deleting the note, refresh the list
        return getNotes();
      })
      .then(response => {
        setNotes(response.data);
      })
      .catch(err => {
        console.error("Error deleting note:", err);
        setError("Could not delete the note.");
      });
  };

  return (
    <div className="app-container">
      <h1>Notes Application</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <AddNoteForm onNoteAdded={handleNoteAdded} />
      <NoteList notes={notes} onNoteDeleted={handleNoteDelete} />
    </div>
  );
}

export default App;