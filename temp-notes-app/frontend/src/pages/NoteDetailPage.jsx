import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import notesService from '../services/notesService';

const NoteDetailPage = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }
      try {
        // Assuming you have a getNoteById in your notesService
        // If not, you might need to add one or fetch all notes and filter
        const res = await notesService.getNotes(token); // Fetch all notes
        const foundNote = res.data.find(n => n._id === id);
        if (foundNote) {
          setNote(foundNote);
        } else {
          setError('Note not found.');
        }
      } catch (err) {
        console.error('Error fetching note:', err);
        setError('Failed to load note.');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, token]);

  if (loading) {
    return <div>Loading note...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!note) {
    return <div>Note not found.</div>;
  }

  return (
    <div className="note-detail-container">
      <h1>Note Detail</h1>
      <p>{note.content}</p>
    </div>
  );
};

export default NoteDetailPage;
