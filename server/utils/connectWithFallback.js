// Alternative connection setup for testing
const mongoose = require('mongoose');
require('dotenv').config();

const connectWithFallback = async () => {
  const ATLAS_URI = process.env.MONGO_URI;
  const LOCAL_URI = 'mongodb://localhost:27017/mess_management_system';
  
  console.log('🔌 Attempting to connect to MongoDB Atlas...');
  
  try {
    // Try Atlas first with short timeout
    await mongoose.connect(ATLAS_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB Atlas successfully!');
    return true;
  } catch (atlasError) {
    console.log('❌ Atlas connection failed:', atlasError.message);
    console.log('🔄 Falling back to local MongoDB...');
    
    try {
      await mongoose.connect(LOCAL_URI, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 5000,
      });
      console.log('✅ Connected to local MongoDB successfully!');
      return true;
    } catch (localError) {
      console.log('❌ Local MongoDB connection failed:', localError.message);
      console.log('⚠️  Running without database connection');
      return false;
    }
  }
};

module.exports = connectWithFallback;