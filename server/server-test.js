const express = require('express');
const cors = require('cors');
const connectWithFallback = require('./utils/connectWithFallback');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Global database connection status
let dbConnected = false;

// Basic route
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

// Start server function
async function startServer() {
  const PORT = process.env.PORT || 5000;
  
  try {
    // Try to connect to database
    dbConnected = await connectWithFallback();
    
    // Import and use routes only if database connected
    if (dbConnected) {
      const authRoutes = require('./api/auth');
      const bookingsRoutes = require('./api/bookings');
      const hallsRoutes = require('./api/halls');
      const mealsRoutes = require('./api/meals');
      const walletRoutes = require('./api/wallet');
      const menusRoutes = require('./api/menus');
      
      app.use('/api/auth', authRoutes);
      app.use('/api/bookings', bookingsRoutes);
      app.use('/api/halls', hallsRoutes);
      app.use('/api/meals', mealsRoutes);
      app.use('/api/wallet', walletRoutes);
      app.use('/api/menus', menusRoutes);
      
      console.log('📡 All API routes loaded successfully');
    } else {
      // Add basic error routes for database-dependent endpoints
      app.use('/api/auth', (req, res) => res.status(503).json({ error: 'Database not available' }));
      app.use('/api/bookings', (req, res) => res.status(503).json({ error: 'Database not available' }));
      app.use('/api/halls', (req, res) => res.status(503).json({ error: 'Database not available' }));
      app.use('/api/meals', (req, res) => res.status(503).json({ error: 'Database not available' }));
      app.use('/api/wallet', (req, res) => res.status(503).json({ error: 'Database not available' }));
      app.use('/api/menus', (req, res) => res.status(503).json({ error: 'Database not available' }));
      
      console.log('⚠️  Database-dependent routes disabled');
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Database status: ${dbConnected ? 'connected' : 'disconnected'}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();