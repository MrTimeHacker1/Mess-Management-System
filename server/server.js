const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Placeholder route
let dbConnected = false;
app.get('/', (req, res) => {
  res.json({
    message: 'Express backend is running!',
    status: 'healthy',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    server: 'healthy',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    mongoUri: process.env.MONGO_URI ? 'configured' : 'not configured'
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mess_management_system';

console.log(`🔌 Attempting to connect to MongoDB: ${MONGO_URI}`);

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 10000, // 10 seconds timeout
})
  .then(() => {
    dbConnected = true;
    console.log('✅ MongoDB connected successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Connected to MongoDB: ${MONGO_URI}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('🔄 Attempting to start server without database...');
    // Start server even if MongoDB connection fails
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (Database connection failed)`);
      console.log('⚠️  Some features requiring database will not work');
    });
  });

// Import routes
const authRoutes = require('./api/auth');
const bookingsRoutes = require('./api/bookings');
const hallsRoutes = require('./api/halls');
const mealsRoutes = require('./api/meals');
const walletRoutes = require('./api/wallet');
const menusRoutes = require('./api/menus'); // New menu routes

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/halls', hallsRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/menus', menusRoutes); // New menu routes