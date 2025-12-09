import React from 'react';
import styles from './NoteList.module.css';

const NoteList = ({ notes, onNoteDeleted }) => {
  return (
    <div className={styles.noteListContainer}>
      <h2>All Notes</h2>
      {notes.map((note) => (
        <div key={note.id} className={styles.note}>
          <div>
            <h3 className={styles.noteTitle}>{note.title}</h3>
            <p className={styles.noteDescription}>{note.description}</p>
          </div>
          <button onClick={() => onNoteDeleted(note.id)} className={styles.deleteButton}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default NoteList;