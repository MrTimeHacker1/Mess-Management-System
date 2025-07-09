const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

let testResults = [];

function logTest(test, success, details = '') {
  testResults.push({ test, success, details });
  const status = success ? '✅' : '❌';
  console.log(`${status} ${test}: ${details}`);
}

async function testServer() {
  console.log('🧪 Testing Mess Management Server...\n');
  
  try {
    // Test 1: Server health check
    console.log('1️⃣ Testing server health...');
    const healthResponse = await axios.get(`${BASE_URL}/`);
    logTest('Server Health', true, `Server is ${healthResponse.data.status}, Database: ${healthResponse.data.database}`);
    
    // Test 2: Health endpoint
    console.log('\n2️⃣ Testing health endpoint...');
    const healthApiResponse = await axios.get(`${API_URL}/health`);
    logTest('Health API', true, `DB Status: ${healthApiResponse.data.database}`);
    
    // Test 3: Database connection
    console.log('\n3️⃣ Testing direct database connection...');
    try {
      const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mess_management_system';
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
      logTest('Database Connection', true, 'MongoDB connected successfully');
      
      // Test 4: Menu seeding (if database connected)
      console.log('\n4️⃣ Testing menu seeding...');
      try {
        const seedResponse = await axios.post(`${API_URL}/menus/seed`);
        logTest('Menu Seeding', true, seedResponse.data.message);
      } catch (seedError) {
        logTest('Menu Seeding', false, seedError.response?.data?.message || seedError.message);
      }
      
      // Test 5: Menu retrieval
      console.log('\n5️⃣ Testing menu retrieval...');
      try {
        const menuResponse = await axios.get(`${API_URL}/menus/all-halls`);
        const hallNames = Object.keys(menuResponse.data);
        logTest('Menu Retrieval', true, `Found ${hallNames.length} halls: ${hallNames.join(', ')}`);
      } catch (menuError) {
        logTest('Menu Retrieval', false, menuError.response?.data?.message || menuError.message);
      }
      
      // Test 6: Specific hall menu
      console.log('\n6️⃣ Testing specific hall menu...');
      try {
        const hallResponse = await axios.get(`${API_URL}/menus/hall/Hall-1`);
        logTest('Hall Menu', true, `Hall-1 has ${hallResponse.data.length} menu items`);
      } catch (hallError) {
        logTest('Hall Menu', false, hallError.response?.data?.message || hallError.message);
      }
      
      await mongoose.connection.close();
      
    } catch (dbError) {
      logTest('Database Connection', false, dbError.message);
      console.log('\n⚠️  Database connection failed, skipping database-dependent tests...');
    }
    
    // Test 7: API endpoints that don't require auth
    console.log('\n7️⃣ Testing API endpoints...');
    const endpoints = [
      '/api/auth',
      '/api/menus',
      '/api/halls',
      '/api/meals'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${BASE_URL}${endpoint}`);
        logTest(`Endpoint ${endpoint}`, true, `Status: ${response.status}`);
      } catch (error) {
        // Some endpoints might require auth, so 401 is expected
        if (error.response?.status === 401) {
          logTest(`Endpoint ${endpoint}`, true, 'Requires authentication (expected)');
        } else {
          logTest(`Endpoint ${endpoint}`, false, error.response?.data?.message || error.message);
        }
      }
    }
    
  } catch (error) {
    logTest('Server Connection', false, error.message);
    console.log('\n❌ Server is not running. Please start the server first.');
    return;
  }
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  const passed = testResults.filter(r => r.success).length;
  const total = testResults.length;
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! The server is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the details above.');
  }
}

// Run the tests
testServer().catch(console.error);