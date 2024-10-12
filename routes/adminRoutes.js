const express = require('express');
const Event = require('../models/Event'); // Ensure this model is set up correctly
const User = require('../models/User'); // Ensure this model is set up correctly
const router = express.Router();

// Middleware for authentication (assumed you have auth middleware set up)
const auth = require('../middleware/authMiddleware');

// GET all events with the number of bookings
router.get('/events', auth, async (req, res) => {
  try {
    const events = await Event.find(); // Fetch all events
    const eventsWithBookings = await Promise.all(events.map(async (event) => {
      const bookings = await User.countDocuments({ bookedEventId: event._id }); // Assuming User has bookedEventId
      return { ...event.toObject(), bookings }; // Add bookings count to event data
    }));

    const totalUpcomingEvents = eventsWithBookings.filter(event => new Date(event.startDate) >= new Date()).length;

    res.status(200).json({ events: eventsWithBookings, totalUpcomingEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// DELETE an event
router.delete('/events/:id', auth, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// UPDATE an event
router.put('/events/:id', auth, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// GET all users
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    const totalUsers = await User.countDocuments(); // Count total users
    res.status(200).json({ users, totalUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// DELETE a user
router.delete('/users/:id', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// GET total number of bookings
router.get('/bookings/count', auth, async (req, res) => {
  try {
    const totalBookings = await User.countDocuments({ bookedEventId: { $ne: null } }); // Count bookings
    res.status(200).json({ totalBookings });
  } catch (error) {
    console.error('Error fetching bookings count:', error);
    res.status(500).json({ error: 'Failed to fetch bookings count' });
  }
});

module.exports = router;
