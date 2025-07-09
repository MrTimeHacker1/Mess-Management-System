const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  hallName: {
    type: String,
    required: true,
    enum: ['Hall-1', 'Hall-3', 'Hall-4', 'Hall-6', 'Hall-12', 'Hall-13'], // Based on your menus
  },
  month: {
    type: String,
    required: true,
    default: 'July'
  },
  year: {
    type: Number,
    required: true,
    default: 2025
  },
  day: {
    type: String,
    required: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'daily'],
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner'],
  },
  menuItems: {
    regular: [{
      type: String,
    }],
    extras: [{
      type: String,
    }],
    special: [{
      type: String,
    }],
    alternatives: [{
      type: String,
    }]
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Meal', MealSchema);