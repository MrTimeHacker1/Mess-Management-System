const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

let testResults = [];

function logTest(test, success, details = '') {
  testResults.push({ test, success, details });
  const status = success ? '✅' : '❌';
  console.log(`${status} ${test}: ${details}`);
}

async function testAllEndpoints() {
  console.log('🧪 Testing All Mess Management Server Endpoints...\n');
  
  try {
    // Test 1: Basic server health
    console.log('1️⃣ Testing Basic Server Health...');
    const healthResponse = await axios.get(`${BASE_URL}/`);
    logTest('Server Health', healthResponse.data.status === 'healthy', 
      `Status: ${healthResponse.data.status}, DB: ${healthResponse.data.database}`);
    
    // Test 2: Health API endpoint
    console.log('\n2️⃣ Testing Health API...');
    const healthApiResponse = await axios.get(`${API_URL}/health`);
    logTest('Health API', healthApiResponse.data.server === 'healthy',
      `Server: ${healthApiResponse.data.server}, Storage: ${JSON.stringify(healthApiResponse.data.storage)}`);
    
    // Test 3: Halls endpoint
    console.log('\n3️⃣ Testing Halls API...');
    const hallsResponse = await axios.get(`${API_URL}/halls`);
    logTest('Halls API', Array.isArray(hallsResponse.data) && hallsResponse.data.length > 0,
      `Found ${hallsResponse.data.length} halls`);
    
    // Test 4: All halls menu
    console.log('\n4️⃣ Testing All Halls Menu...');
    const allHallsResponse = await axios.get(`${API_URL}/menus/all-halls`);
    const hallNames = Object.keys(allHallsResponse.data);
    logTest('All Halls Menu', hallNames.length > 0, 
      `Found menus for: ${hallNames.join(', ')}`);
    
    // Test 5: Specific hall menu
    console.log('\n5️⃣ Testing Specific Hall Menu...');
    const hall1Response = await axios.get(`${API_URL}/menus/hall/Hall-1`);
    logTest('Hall-1 Menu', Array.isArray(hall1Response.data) && hall1Response.data.length > 0,
      `Found ${hall1Response.data.length} menu items for Hall-1`);
    
    // Test 6: Specific meal menu
    console.log('\n6️⃣ Testing Specific Meal Menu...');
    const mealResponse = await axios.get(`${API_URL}/menus/hall/Hall-1/monday/breakfast`);
    logTest('Specific Meal Menu', mealResponse.data.menuItems && mealResponse.data.menuItems.regular,
      `Monday breakfast items: ${mealResponse.data.menuItems.regular.join(', ')}`);
    
    // Test 7: Menu seeding
    console.log('\n7️⃣ Testing Menu Seeding...');
    const seedResponse = await axios.post(`${API_URL}/menus/seed`);
    logTest('Menu Seeding', seedResponse.data.message.includes('successfully'),
      seedResponse.data.message);
    
    // Test 8: User registration
    console.log('\n8️⃣ Testing User Registration...');
    const registerData = {
      name: 'Test User',
      rollNo: '123456',
      password: 'testpass123'
    };
    const registerResponse = await axios.post(`${API_URL}/auth/register`, registerData);
    logTest('User Registration', registerResponse.data.token && registerResponse.data.user,
      `Registered user: ${registerResponse.data.user.name}`);
    
    // Test 9: User login
    console.log('\n9️⃣ Testing User Login...');
    const loginData = {
      rollNo: '123456',
      password: 'testpass123'
    };
    const loginResponse = await axios.post(`${API_URL}/auth/login`, loginData);
    logTest('User Login', loginResponse.data.token && loginResponse.data.user,
      `Logged in user: ${loginResponse.data.user.name}`);
    
    const token = loginResponse.data.token;
    
    // Test 10: Get user profile
    console.log('\n🔟 Testing User Profile...');
    const profileResponse = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    logTest('User Profile', profileResponse.data.name === 'Test User',
      `Profile: ${profileResponse.data.name}`);
    
    // Test 11: Get meals
    console.log('\n1️⃣1️⃣ Testing Meals API...');
    const mealsResponse = await axios.get(`${API_URL}/meals`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    logTest('Meals API', Array.isArray(mealsResponse.data),
      `Found ${mealsResponse.data.length} meals`);
    
    // Test 12: Get bookings
    console.log('\n1️⃣2️⃣ Testing Bookings API...');
    const bookingsResponse = await axios.get(`${API_URL}/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    logTest('Bookings API', bookingsResponse.data.bookings && Array.isArray(bookingsResponse.data.bookings),
      `Found ${bookingsResponse.data.bookings.length} bookings`);
    
    // Test 13: Create booking
    console.log('\n1️⃣3️⃣ Testing Booking Creation...');
    const bookingData = {
      hallId: '1',
      mealType: 'breakfast',
      date: '2025-07-10T00:00:00.000Z'
    };
    const createBookingResponse = await axios.post(`${API_URL}/bookings`, bookingData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    logTest('Booking Creation', createBookingResponse.data._id && createBookingResponse.data.status,
      `Booking status: ${createBookingResponse.data.status}`);
    
    // Test 14: Get wallet info
    console.log('\n1️⃣4️⃣ Testing Wallet API...');
    const walletResponse = await axios.get(`${API_URL}/wallet`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    logTest('Wallet API', walletResponse.data.balance !== undefined,
      `Wallet balance: ${walletResponse.data.balance}`);
    
    // Test 15: Test invalid endpoints
    console.log('\n1️⃣5️⃣ Testing Invalid Endpoints...');
    try {
      await axios.get(`${API_URL}/invalid-endpoint`);
      logTest('Invalid Endpoint', false, 'Should have returned 404');
    } catch (error) {
      logTest('Invalid Endpoint', error.response?.status === 404,
        `Correctly returned 404 for invalid endpoint`);
    }
    
    // Test 16: Test unauthorized access
    console.log('\n1️⃣6️⃣ Testing Unauthorized Access...');
    try {
      await axios.get(`${API_URL}/bookings`); // Without token
      logTest('Unauthorized Access', false, 'Should have been rejected');
    } catch (error) {
      logTest('Unauthorized Access', error.response?.status === 401,
        `Correctly rejected unauthorized access`);
    }
    
  } catch (error) {
    logTest('Server Connection', false, error.message);
    console.log('\n❌ Server is not running. Please start the server first.');
    return;
  }
  
  // Summary
  console.log('\n📊 Comprehensive Test Summary:');
  console.log('==============================');
  const passed = testResults.filter(r => r.success).length;
  const total = testResults.length;
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! The server is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Review the details above.');
  }
  
  // Test results breakdown
  console.log('\n📝 Test Results Breakdown:');
  console.log('==========================');
  testResults.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${index + 1}. ${result.test}: ${result.details}`);
  });
}

// Run all tests
testAllEndpoints().catch(console.error);