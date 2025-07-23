import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import notesService from '../services/notesService';
import Modal from '../components/Modal';

const DashboardPage = () => {
  const { token, dispatch } = useContext(AuthContext); // Destructure dispatch for notifications
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [pendingDeleteNoteId, setPendingDeleteNoteId] = useState(null); // New state for undo
  const [deleteTimer, setDeleteTimer] = useState(null); // New state for undo timer

  useEffect(() => {
    if (token) {
      notesService.getNotes(token).then(res => {
        setNotes(res.data);
      });
    }
  }, [token]);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (deleteTimer) {
        clearTimeout(deleteTimer);
      }
    };
  }, [deleteTimer]);

  const onSubmit = e => {
    e.preventDefault();
    notesService.createNote(content, token).then(res => {
      setNotes([...notes, res.data]);
      setContent('');
      dispatch({
        type: 'LOGIN_SUCCESS', // Reusing LOGIN_SUCCESS to show success toast
        payload: { message: 'Note added successfully!' }
      });
    }).catch(err => {
      dispatch({
        type: 'LOGIN_FAIL', // Reusing LOGIN_FAIL to show error toast
        payload: { message: 'Failed to add note.' }
      });
    });
  };

  const confirmDelete = (id) => {
    notesService.deleteNote(id, token).then(() => {
      setNotes(notes.filter(note => note._id !== id));
      dispatch({
        type: 'LOGIN_SUCCESS', // Reusing LOGIN_SUCCESS to show success toast
        payload: { message: 'Note deleted successfully!' }
      });
    }).catch(err => {
      dispatch({
        type: 'LOGIN_FAIL', // Reusing LOGIN_FAIL to show error toast
        payload: { message: 'Failed to delete note.' }
      });
    });
  };

  const onDelete = id => {
    // Clear any existing pending delete
    if (deleteTimer) {
      clearTimeout(deleteTimer);
    }

    // Set note for pending deletion
    setPendingDeleteNoteId(id);

    // Show undo toast
    dispatch({
      type: 'LOGIN_SUCCESS', // Reusing LOGIN_SUCCESS for a temporary message
      payload: {
        message: 'Note will be deleted in 5 seconds.',
        action: () => undoDelete(id),
        actionText: 'Undo'
      }
    });

    // Start timer for actual deletion
    const timer = setTimeout(() => {
      confirmDelete(id);
      setPendingDeleteNoteId(null);
      dispatch({ type: 'CLEAR_MESSAGE' }); // Clear the undo message
    }, 5000); // 5 seconds
    setDeleteTimer(timer);
  };

  const undoDelete = (id) => {
    if (deleteTimer) {
      clearTimeout(deleteTimer);
      setDeleteTimer(null);
    }
    setPendingDeleteNoteId(null);
    dispatch({
      type: 'LOGIN_SUCCESS', // Reusing LOGIN_SUCCESS for a temporary message
      payload: { message: 'Deletion cancelled.' }
    });
  };

  const onQrCode = id => {
    notesService.getQrCode(id, token).then(res => {
      setQrCode(res.data.qr);
      setShowModal(true);
    }).catch(err => {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: { message: 'Failed to generate QR code.' }
      });
    });
  };

  const onEdit = note => {
    setEditingNoteId(note._id);
    setEditingContent(note.content);
    setShowModal(true);
  };

  const onUpdate = e => {
    e.preventDefault();
    notesService.updateNote(editingNoteId, editingContent, token).then(res => {
      setNotes(notes.map(note => (note._id === editingNoteId ? res.data : note)));
      setEditingNoteId(null);
      setEditingContent('');
      setShowModal(false);
      dispatch({
        type: 'LOGIN_SUCCESS', // Reusing LOGIN_SUCCESS to show success toast
        payload: { message: 'Note updated successfully!' }
      });
    }).catch(err => {
      dispatch({
        type: 'LOGIN_FAIL', // Reusing LOGIN_FAIL to show error toast
        payload: { message: 'Failed to update note.' }
      });
    });
  };

  const onCloseModal = () => {
    setShowModal(false);
    setQrCode('');
    setEditingNoteId(null);
    setEditingContent('');
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <form onSubmit={onSubmit} className="note-form">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Add a new note..."
          required
        ></textarea>
        <button type="submit">Add Note</button>
      </form>
      <div className="notes-list">
        {notes.length > 0 ? (
          notes.map(note => (
            <div key={note._id} className="note-item" style={{ opacity: pendingDeleteNoteId === note._id ? 0.5 : 1 }}>
              <p>{note.content}</p>
              <div className="note-item-actions">
                <button onClick={() => onDelete(note._id)} disabled={pendingDeleteNoteId === note._id}>Delete</button>
                <button onClick={() => onEdit(note)}>Edit</button>
                <button onClick={() => onQrCode(note._id)}>QR Code</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-notes-message">No notes yet. Add one above!</p>
        )}
      </div>
      <Modal show={showModal} onClose={onCloseModal}>
        {qrCode ? (
          qrCode && <img src={qrCode} alt="QR Code" />
        ) : (
          <form onSubmit={onUpdate}>
            <textarea
              value={editingContent}
              onChange={e => setEditingContent(e.target.value)}
              required
            ></textarea>
            <button type="submit">Update Note</button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default DashboardPage;