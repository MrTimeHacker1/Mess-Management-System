const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');
const connectDB = require('../utils/mongodb');

// Get all menus for a specific hall
router.get('/hall/:hallName', async (req, res) => {
  try {
    await connectDB();
    const { hallName } = req.params;
    const { month = 'July', year = 2025 } = req.query;
    
    console.log(`[MENU API] Fetching menus for hall: ${hallName}, month: ${month}, year: ${year}`);

    const meals = await Meal.find({
      hallName: hallName,
      month: month,
      year: year
    }).sort({ day: 1, mealType: 1 });
    
    console.log(`[MENU API] Found ${meals.length} meals for ${hallName}`);
    res.json(meals);
  } catch (error) {
    console.error(`[MENU API] Error fetching menus for hall ${req.params.hallName}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Get menu for specific hall, day, and meal type
router.get('/hall/:hallName/:day/:mealType', async (req, res) => {
  try {
    await connectDB();
    const { hallName, day, mealType } = req.params;
    const { month = 'July', year = 2025 } = req.query;
    
    console.log(`[MENU API] Fetching specific menu for hall: ${hallName}, day: ${day}, mealType: ${mealType}`);

    const meal = await Meal.findOne({
      hallName,
      day: day.toLowerCase(),
      mealType: mealType.toLowerCase(),
      month,
      year
    });

    if (!meal) {
      console.log(`[MENU API] No menu found for ${hallName}/${day}/${mealType}`);
      return res.status(404).json({ message: 'Menu not found' });
    }
    
    console.log(`[MENU API] Found menu for ${hallName}/${day}/${mealType}`);
    res.json(meal);
  } catch (error) {
    console.error(`[MENU API] Error fetching specific menu:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Get all halls with their menus
router.get('/all-halls', async (req, res) => {
  try {
    await connectDB();
    const { month = 'July', year = 2025 } = req.query;
    
    console.log(`[MENU API] Fetching all halls menus for month: ${month}, year: ${year}`);

    const meals = await Meal.find({ month, year })
      .sort({ hallName: 1, day: 1, mealType: 1 });

    // Group by hall
    const groupedByHall = meals.reduce((acc, meal) => {
      if (!acc[meal.hallName]) {
        acc[meal.hallName] = [];
      }
      acc[meal.hallName].push(meal);
      return acc;
    }, {});
    
    console.log(`[MENU API] Found ${meals.length} total meals across ${Object.keys(groupedByHall).length} halls`);
    res.json(groupedByHall);
  } catch (error) {
    console.error(`[MENU API] Error fetching all halls:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Add new menu item
router.post('/add', async (req, res) => {
  try {
    await connectDB();
    console.log(`[MENU API] Adding new menu item:`, req.body);
    
    const meal = new Meal(req.body);
    const savedMeal = await meal.save();
    
    console.log(`[MENU API] Successfully added menu item with ID: ${savedMeal._id}`);
    res.status(201).json(savedMeal);
  } catch (error) {
    console.error(`[MENU API] Error adding menu item:`, error);
    res.status(400).json({ message: error.message });
  }
});

// Update menu
router.put('/update/:id', async (req, res) => {
  try {
    await connectDB();
    console.log(`[MENU API] Updating menu item with ID: ${req.params.id}`);
    
    const updatedMeal = await Meal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedMeal) {
      console.log(`[MENU API] Menu item not found with ID: ${req.params.id}`);
      return res.status(404).json({ message: 'Menu not found' });
    }
    
    console.log(`[MENU API] Successfully updated menu item with ID: ${req.params.id}`);
    res.json(updatedMeal);
  } catch (error) {
    console.error(`[MENU API] Error updating menu item:`, error);
    res.status(400).json({ message: error.message });
  }
});

// Debug endpoint to check database contents
router.get('/debug/database', async (req, res) => {
  try {
    await connectDB();
    console.log(`[MENU API DEBUG] Checking database contents...`);
    
    // Get database statistics
    const totalMeals = await Meal.countDocuments();
    const halls = await Meal.distinct('hallName');
    const days = await Meal.distinct('day');
    const mealTypes = await Meal.distinct('mealType');
    const months = await Meal.distinct('month');
    const years = await Meal.distinct('year');
    
    // Get sample data from each hall
    const sampleData = {};
    for (const hall of halls) {
      const sampleMeals = await Meal.find({ hallName: hall }).limit(3);
      sampleData[hall] = sampleMeals;
    }
    
    const debugInfo = {
      database: {
        totalMeals,
        halls,
        days,
        mealTypes,
        months,
        years
      },
      sampleData,
      timestamp: new Date().toISOString()
    };
    
    console.log(`[MENU API DEBUG] Database contains ${totalMeals} meals across ${halls.length} halls`);
    res.json(debugInfo);
  } catch (error) {
    console.error(`[MENU API DEBUG] Error checking database:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Seed menu data endpoint
router.post('/seed', async (req, res) => {
  try {
    await connectDB();
    console.log(`[MENU API] Starting menu data seeding...`);
    
    const { seedMenuData } = require('../utils/seedMenuData');
    await seedMenuData();
    
    console.log(`[MENU API] Menu data seeded successfully`);
    res.json({ message: 'Menu data seeded successfully' });
  } catch (error) {
    console.error(`[MENU API] Error seeding menu data:`, error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;