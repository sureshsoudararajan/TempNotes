import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notes';

const getNotes = token => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const createNote = (content, token) => {
  return axios.post(
    API_URL,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

const updateNote = (id, content, token) => {
  return axios.put(
    `${API_URL}/${id}`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

const deleteNote = (id, token) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const getQrCode = (id, token) => {
  return axios.get(`${API_URL}/qr/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const notesService = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getQrCode
};

export default notesService;
