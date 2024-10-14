// routes/eventRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where the images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// Create event
router.post('/create', upload.single('image'), async (req, res) => {
  const { title, venue, host, startDate, startTime, endTime, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newEvent = new Event({
      title,
      venue,
      host,
      startDate,
      startTime,
      endTime,
      description,
      image,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update an event by ID
router.put('/update/:id', authMiddleware, async (req, res) => {
  const { title, venue, host, startDate, startTime, endTime, description } = req.body;

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Update event details
    event.title = title || event.title;
    event.venue = venue || event.venue;
    event.host = host || event.host;
    event.startDate = startDate || event.startDate;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    event.description = description || event.description;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an event by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
