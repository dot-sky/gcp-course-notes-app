import axios from 'axios';

// The 'proxy' in package.json will prepend 'http://localhost:8080' to these requests
const BACKEND_API_BASE_URL = 'https://notesapp-backend-service-203087834044.us-central1.run.app' || 'http://localhost:8080';

export const getNotes = () => {
  return axios.get(`${BACKEND_API_BASE_URL}/notes`);
};

export const createNote = (note) => {
  // note should be an object like { title: 'My Title', description: 'My Description' }
  return axios.post(`${BACKEND_API_BASE_URL}/notes`, note);
};

export const deleteNote = (id) => {
  return axios.delete(`${BACKEND_API_BASE_URL}/notes/${id}`);
};