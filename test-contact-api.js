// Simple test script for the contact API
const https = require('https');
const http = require('http');

// Test data
const testData = {
  name: "Test User",
  email: "test@example.com", 
  subject: "Test Subject",
  message: "This is a test message from the API test script."
};

// Function to make HTTP request
function makeRequest(data, url) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// Test the API
async function testContactAPI() {
  console.log('Testing Contact API...');
  console.log('Test data:', testData);
  
  try {
    // Test local development server
    const result = await makeRequest(testData, 'http://localhost:3000/api/contact');
    
    console.log('\n=== API Response ===');
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.status === 200) {
      console.log('\n✅ SUCCESS: Contact form submission worked!');
    } else {
      console.log('\n❌ FAILED: Contact form submission failed');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('\nMake sure your Next.js development server is running on localhost:3000');
  }
}

// Run the test
testContactAPI(); 