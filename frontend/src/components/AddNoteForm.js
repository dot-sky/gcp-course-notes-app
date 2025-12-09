import React, { useState } from 'react';
import styles from './AddNoteForm.module.css';

const AddNoteForm = ({ onNoteAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onNoteAdded({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Add a New Note</h2>
      <div className={styles.formGroup}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className={styles.formGroup}>
        <label>Content:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <button type="submit" className={styles.button}>Add Note</button>
    </form>
  );
};

export default AddNoteForm;