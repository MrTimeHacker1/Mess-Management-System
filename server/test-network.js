// Network connectivity test for MongoDB Atlas
const axios = require('axios');
const dns = require('dns');
const net = require('net');
require('dotenv').config();

async function testNetworkConnectivity() {
  console.log('🔍 Testing Network Connectivity to MongoDB Atlas...\n');
  
  const mongoUri = process.env.MONGO_URI;
  console.log('🔗 MongoDB URI:', mongoUri);
  
  if (!mongoUri || !mongoUri.includes('mongodb+srv://')) {
    console.log('❌ Invalid MongoDB URI format');
    return;
  }
  
  // Extract host from URI
  const match = mongoUri.match(/mongodb\+srv:\/\/[^@]+@([^\/]+)/);
  if (!match) {
    console.log('❌ Could not extract host from URI');
    return;
  }
  
  const host = match[1];
  console.log('🌐 Host:', host);
  
  // Test 1: DNS Resolution
  console.log('\n1️⃣ Testing DNS resolution...');
  try {
    const addresses = await new Promise((resolve, reject) => {
      dns.lookup(host, (err, address) => {
        if (err) reject(err);
        else resolve(address);
      });
    });
    console.log('✅ DNS resolved to:', addresses);
  } catch (dnsError) {
    console.log('❌ DNS resolution failed:', dnsError.message);
  }
  
  // Test 2: SRV Record lookup (for mongodb+srv)
  console.log('\n2️⃣ Testing SRV record lookup...');
  try {
    const srvRecords = await new Promise((resolve, reject) => {
      dns.resolveSrv(`_mongodb._tcp.${host}`, (err, addresses) => {
        if (err) reject(err);
        else resolve(addresses);
      });
    });
    console.log('✅ SRV records found:', srvRecords);
    
    // Test 3: TCP connection to MongoDB ports
    console.log('\n3️⃣ Testing TCP connections...');
    for (const srv of srvRecords.slice(0, 3)) { // Test first 3 servers
      try {
        const connected = await new Promise((resolve) => {
          const socket = new net.Socket();
          socket.setTimeout(5000);
          
          socket.on('connect', () => {
            socket.destroy();
            resolve(true);
          });
          
          socket.on('error', () => {
            resolve(false);
          });
          
          socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
          });
          
          socket.connect(srv.port, srv.name);
        });
        
        if (connected) {
          console.log(`✅ Connected to ${srv.name}:${srv.port}`);
        } else {
          console.log(`❌ Failed to connect to ${srv.name}:${srv.port}`);
        }
      } catch (tcpError) {
        console.log(`❌ TCP test failed for ${srv.name}:${srv.port}`, tcpError.message);
      }
    }
    
  } catch (srvError) {
    console.log('❌ SRV record lookup failed:', srvError.message);
  }
  
  // Test 4: Check if we're behind a firewall/proxy
  console.log('\n4️⃣ Testing external connectivity...');
  try {
    const response = await axios.get('https://www.google.com', { timeout: 5000 });
    console.log('✅ External internet access available');
  } catch (internetError) {
    console.log('❌ External internet access failed:', internetError.message);
  }
  
  // Test 5: Check if MongoDB Atlas is accessible via HTTP (Atlas API)
  console.log('\n5️⃣ Testing MongoDB Atlas API accessibility...');
  try {
    const response = await axios.get('https://cloud.mongodb.com/api/atlas/v1.0/groups', { 
      timeout: 5000,
      validateStatus: () => true // Accept any status code
    });
    console.log('✅ MongoDB Atlas API accessible, status:', response.status);
  } catch (atlasError) {
    console.log('❌ MongoDB Atlas API not accessible:', atlasError.message);
  }
  
  console.log('\n📊 Network Test Complete');
  console.log('💡 If connections are failing, you may be behind a firewall or proxy');
  console.log('💡 MongoDB Atlas requires outbound connections on port 27017');
}

testNetworkConnectivity().catch(console.error);