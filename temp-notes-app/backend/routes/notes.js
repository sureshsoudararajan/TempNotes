const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');
const qrcode = require('qrcode');

// @route   GET api/notes
// @desc    Get all notes for a user
// @access  Private
router.get('/', auth, (req, res) => {
  Note.find({ user: req.user.id })
    .sort({ date: -1 })
    .then(notes => res.json(notes));
});

// @route   POST api/notes
// @desc    Create a note
// @access  Private
router.post('/', auth, (req, res) => {
  const newNote = new Note({
    content: req.body.content,
    user: req.user.id
  });

  newNote.save().then(note => res.json(note));
});

// @route   PUT api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', auth, (req, res) => {
  const { content } = req.body;
  Note.findById(req.params.id)
    .then(note => {
      if (!note) {
        return res.status(404).json({ msg: 'Note not found' });
      }
      // Ensure user owns note
      if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      note.content = content;
      note.save().then(note => res.json(note));
    })
    .catch(err => res.status(404).json({ msg: 'Note not found' }));
});

// @route   DELETE api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', auth, (req, res) => {
  console.log('Attempting to delete note with ID:', req.params.id); // Debug log
  Note.deleteOne({ _id: req.params.id, user: req.user.id }) // Use deleteOne with ID and user ID
    .then(result => {
      if (result.deletedCount === 0) {
        console.log('Note not found or not authorized for ID:', req.params.id); // Debug log
        return res.status(404).json({ success: false, msg: 'Note not found or not authorized' });
      }
      console.log('Note successfully removed.'); // Debug log
      res.json({ success: true });
    })
    .catch(err => {
      console.error('Error deleting note:', err); // Debug log
      res.status(500).json({ success: false, msg: 'Error deleting note' });
    });
});

// @route   GET api/notes/qr/:id
// @desc    Generate QR code for a note
// @access  Private
router.get('/qr/:id', auth, (req, res) => {
  console.log('Attempting to generate QR for note ID:', req.params.id); // Debug log
  Note.findById(req.params.id)
    .then(note => {
      if (!note) {
        console.log('QR: Note not found for ID:', req.params.id); // Debug log
        return res.status(404).json({ msg: 'Note not found' });
      }
      if (note.user.toString() !== req.user.id) {
        console.log('QR: User not authorized for this note.'); // Debug log
        return res.status(401).json({ msg: 'Not authorized' });
      }

      // IMPORTANT: Replace with your actual frontend base URL
      const frontendBaseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:5173'; 
      const noteUrl = `${frontendBaseUrl}/note/${note._id}`;

      console.log('QR: Embedding URL:', noteUrl); // Debug log
      qrcode.toDataURL(noteUrl, (err, url) => {
        if (err) {
          console.error('QR: Error generating QR code:', err); // Debug log
          return res.status(500).json({ msg: 'Error generating QR code' });
        }
        console.log('QR: Successfully generated QR code.'); // Debug log
        res.json({ qr: url });
      });
    })
    .catch(err => {
      console.error('QR: Error finding note:', err); // Debug log
      res.status(404).json({ success: false, msg: 'Note not found or invalid ID' });
    });
});

module.exports = router;