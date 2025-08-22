const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mess-management';
  if (isConnected) return;
  await mongoose.connect(MONGO_URI); // Removed deprecated options
  isConnected = true;
}

module.exports = connectDB;