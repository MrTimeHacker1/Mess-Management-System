const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple in-memory storage for testing
let memoryStorage = {
  users: [],
  halls: [
    { _id: '1', name: 'Hall-1', status: 'active' },
    { _id: '2', name: 'Hall-3', status: 'active' },
    { _id: '3', name: 'Hall-4', status: 'active' },
    { _id: '4', name: 'Hall-6', status: 'active' },
    { _id: '5', name: 'Hall-12', status: 'active' },
    { _id: '6', name: 'Hall-13', status: 'active' },
  ],
  meals: [],
  bookings: []
};

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Express backend is running!',
    status: 'healthy',
    database: 'memory-storage',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    server: 'healthy',
    database: 'memory-storage',
    timestamp: new Date().toISOString(),
    mongoUri: process.env.MONGO_URI ? 'configured' : 'not configured',
    storage: {
      users: memoryStorage.users.length,
      halls: memoryStorage.halls.length,
      meals: memoryStorage.meals.length,
      bookings: memoryStorage.bookings.length
    }
  });
});

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  // For testing, we'll skip auth
  req.user = { _id: 'test-user', name: 'Test User', role: 'user' };
  next();
};

// Mock API routes
app.get('/api/halls', (req, res) => {
  res.json(memoryStorage.halls);
});

// Mock menu endpoints
app.get('/api/menus/all-halls', (req, res) => {
  const mockMenus = {
    'Hall-1': [
      { day: 'monday', mealType: 'breakfast', menuItems: { regular: ['Idli', 'Sambar'] } },
      { day: 'monday', mealType: 'lunch', menuItems: { regular: ['Rice', 'Dal'] } }
    ],
    'Hall-3': [
      { day: 'monday', mealType: 'breakfast', menuItems: { regular: ['Bread', 'Butter'] } },
      { day: 'monday', mealType: 'lunch', menuItems: { regular: ['Paratha', 'Curd'] } }
    ]
  };
  res.json(mockMenus);
});

app.get('/api/menus/hall/:hallName', (req, res) => {
  const { hallName } = req.params;
  const mockMenus = [
    { day: 'monday', mealType: 'breakfast', menuItems: { regular: ['Idli', 'Sambar'] } },
    { day: 'monday', mealType: 'lunch', menuItems: { regular: ['Rice', 'Dal'] } },
    { day: 'tuesday', mealType: 'breakfast', menuItems: { regular: ['Upma', 'Chutney'] } },
    { day: 'tuesday', mealType: 'lunch', menuItems: { regular: ['Roti', 'Sabzi'] } }
  ];
  res.json(mockMenus);
});

app.get('/api/menus/hall/:hallName/:day/:mealType', (req, res) => {
  const { hallName, day, mealType } = req.params;
  const mockMenu = {
    hallName,
    day,
    mealType,
    menuItems: {
      regular: ['Sample Item 1', 'Sample Item 2'],
      extras: ['Extra Item 1'],
      special: []
    }
  };
  res.json(mockMenu);
});

app.post('/api/menus/seed', (req, res) => {
  // Mock seeding
  memoryStorage.meals = [
    { hallName: 'Hall-1', day: 'monday', mealType: 'breakfast', menuItems: { regular: ['Idli', 'Sambar'] } },
    { hallName: 'Hall-1', day: 'monday', mealType: 'lunch', menuItems: { regular: ['Rice', 'Dal'] } }
  ];
  res.json({ message: 'Menu data seeded successfully (mock)' });
});

// Mock auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { rollNo, password } = req.body;
  if (rollNo && password) {
    const token = 'mock-jwt-token';
    res.json({ 
      token, 
      user: { _id: 'test-user', name: 'Test User', rollNo, walletBalance: 1000 } 
    });
  } else {
    res.status(400).json({ error: 'Roll number and password required' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, rollNo, password } = req.body;
  if (name && rollNo && password) {
    const newUser = { _id: Date.now().toString(), name, rollNo, walletBalance: 1000 };
    memoryStorage.users.push(newUser);
    const token = 'mock-jwt-token';
    res.json({ token, user: newUser });
  } else {
    res.status(400).json({ error: 'Name, roll number, and password required' });
  }
});

app.get('/api/auth/me', mockAuth, (req, res) => {
  res.json(req.user);
});

// Mock bookings
app.get('/api/bookings', mockAuth, (req, res) => {
  res.json({ bookings: memoryStorage.bookings, total: memoryStorage.bookings.length });
});

app.post('/api/bookings', mockAuth, (req, res) => {
  const { hallId, mealType, date } = req.body;
  const newBooking = {
    _id: Date.now().toString(),
    userId: req.user._id,
    hallId,
    mealType,
    date,
    status: 'confirmed'
  };
  memoryStorage.bookings.push(newBooking);
  res.json(newBooking);
});

// Mock meals
app.get('/api/meals', mockAuth, (req, res) => {
  res.json(memoryStorage.meals);
});

// Mock wallet
app.get('/api/wallet', mockAuth, (req, res) => {
  res.json({ balance: 1000, transactions: [] });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Mock server running on port ${PORT}`);
  console.log(`📊 Database status: memory-storage`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`⚠️  Using mock data for testing purposes`);
});