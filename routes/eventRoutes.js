// routes/eventRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Event = require('../models/Event');
const authMiddleware=require('../middleware/authMiddleware')
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

  module.exports = router;

// POST request to create a new event with an image
router.post('/create', upload.single('image'), async (req, res) => {
  const { title, venue, host, startDate, startTime, endTime, description } = req.body; // Update to include startTime and endTime
  const image = req.file ? `/uploads/${req.file.filename}` : null;  // Image path

  try {
    const newEvent = new Event({
      title,
      venue,
      host,
      startDate,
      startTime,  // Store start time
      endTime,    // Store end time
      description,
      image,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error); // Log error for debugging
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// GET request to fetch all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find(); // Retrieve all events
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

module.exports = router;
