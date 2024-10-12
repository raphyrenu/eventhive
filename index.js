// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');   // Import DB connection
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/eventRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');

 // Import event routes

const app = express();

// Middleware
app.use(express.json());  // Parse incoming JSON requests
app.use(cors());

// Connect to MongoDB
connectDB();  // Call DB connection function

// Routes
app.use('/api', authRoutes);            // Authentication routes
app.use('/api/events', eventRoutes);    // Event-related routes
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Start the server
const PORT = process.env.PORT || 5000;  // Default to port 5000 if not set in env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
