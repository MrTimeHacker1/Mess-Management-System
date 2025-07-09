const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log('MongoDB already connected');
    return;
  }

  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mess-management';
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log(`MongoDB connected: ${MONGO_URI}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = connectDB;