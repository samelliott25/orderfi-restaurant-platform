// OrderFi AI - Production Readiness Test Suite
import http from 'http';

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:5000',
  timeout: 10000,
  maxRetries: 3
};

let testResults = { passed: 0, failed: 0, total: 0, errors: [] };

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, TEST_CONFIG.baseUrl);
    const requestOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: { 'Content-Type': 'application/json', ...options.headers },
      timeout: TEST_CONFIG.timeout
    };

    const req = http.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsedData = data ? JSON.parse(data) : {};
          resolve({ statusCode: res.statusCode, headers: res.headers, data: parsedData, rawData: data });
        } catch (e) {
          resolve({ statusCode: res.statusCode, headers: res.headers, data: null, rawData: data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

function assert(condition, message) {
  testResults.total++;
  if (condition) {
    testResults.passed++;
    console.log(`✅ ${message}`);
  } else {
    testResults.failed++;
    testResults.errors.push(message);
    console.log(`❌ ${message}`);
  }
}

async function testHealthEndpoint() {
  console.log('\n🏥 Testing Health Endpoint...');
  try {
    const response = await makeRequest('/api/health');
    assert(response.statusCode === 200, 'Health endpoint returns 200');
    assert(response.data && response.data.status, 'Health endpoint returns status');
    assert(response.data.status === 'healthy', 'Service reports healthy status');
  } catch (error) {
    assert(false, `Health endpoint failed: ${error.message}`);
  }
}

async function testTokenRewardsSystem() {
  console.log('\n🎁 Testing Token Rewards System...');
  try {
    // Test seeded customer rewards
    const testCustomers = ['alice@example.com', 'bob@example.com', 'charlie@example.com'];
    
    for (const email of testCustomers) {
      const response = await makeRequest(`/api/rewards/${email}`);
      assert(response.statusCode === 200, `Rewards API returns 200 for ${email}`);
      
      if (response.data && response.data.totalPoints !== undefined) {
        assert(typeof response.data.totalPoints === 'number', `Total points is number for ${email}`);
        assert(response.data.totalPoints >= 0, `Total points non-negative for ${email}`);
        console.log(`   ${email}: ${response.data.totalPoints} points`);
      }
    }
  } catch (error) {
    assert(false, `Token Rewards System failed: ${error.message}`);
  }
}

async function testPerformanceMetrics() {
  console.log('\n⚡ Testing Performance Requirements...');
  const startTime = Date.now();
  
  try {
    const response = await makeRequest('/api/health');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    assert(response.statusCode === 200, 'Performance endpoint accessible');
    assert(responseTime < 100, `API response under 100ms target (actual: ${responseTime}ms)`);
    
    // Test cache performance if available
    const cacheResponse = await makeRequest('/api/restaurants');
    const cacheEndTime = Date.now();
    const cacheResponseTime = cacheEndTime - endTime;
    
    console.log(`   Cache response time: ${cacheResponseTime}ms`);
    assert(cacheResponseTime < 50, `Cache response under 50ms (actual: ${cacheResponseTime}ms)`);
    
  } catch (error) {
    assert(false, `Performance test failed: ${error.message}`);
  }
}

async function testSecurityCompliance() {
  console.log('\n🔒 Testing Security Compliance...');
  try {
    const response = await makeRequest('/api/health');
    const headers = response.headers;
    
    assert(headers['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options header present');
    assert(headers['x-frame-options'] === 'DENY', 'X-Frame-Options header present');
    assert(headers['x-xss-protection'] === '1; mode=block', 'X-XSS-Protection header present');
    assert(headers['strict-transport-security'] !== undefined, 'HSTS header present');
    
    // Test rate limiting
    console.log('   Testing rate limiting...');
    const promises = Array(12).fill().map(() => makeRequest('/api/health'));
    const responses = await Promise.allSettled(promises);
    const rateLimited = responses.some(r => r.status === 'fulfilled' && r.value.statusCode === 429);
    console.log(`   Rate limiting: ${rateLimited ? 'Active' : 'Not triggered'}`);
    
  } catch (error) {
    assert(false, `Security compliance test failed: ${error.message}`);
  }
}

async function testOrderProcessingFlow() {
  console.log('\n🛒 Testing Complete Order Processing Flow...');
  try {
    // Get restaurants
    const restaurantsResponse = await makeRequest('/api/restaurants');
    assert(restaurantsResponse.statusCode === 200, 'Restaurants API accessible');
    assert(Array.isArray(restaurantsResponse.data), 'Restaurants returns array');
    
    if (restaurantsResponse.data.length > 0) {
      const restaurant = restaurantsResponse.data[0];
      console.log(`   Testing with restaurant: ${restaurant.name}`);
      
      // Get menu items
      const menuResponse = await makeRequest(`/api/restaurants/${restaurant.id}/menu`);
      assert(menuResponse.statusCode === 200, 'Menu API accessible');
      
      if (menuResponse.data && menuResponse.data.length > 0) {
        const menuItem = menuResponse.data[0];
        console.log(`   Testing with menu item: ${menuItem.name}`);
        
        // Create test order
        const orderPayload = {
          restaurantId: restaurant.id,
          customerName: 'Test Customer',
          customerEmail: 'test@orderfi.com',
          items: [{
            menuItemId: menuItem.id,
            quantity: 1,
            specialInstructions: 'Production test order'
          }],
          subtotal: menuItem.price,
          tax: menuItem.price * 0.08,
          total: menuItem.price * 1.08
        };
        
        const orderResponse = await makeRequest('/api/orders', {
          method: 'POST',
          body: orderPayload
        });
        
        assert(orderResponse.statusCode === 201, 'Order creation successful');
        assert(orderResponse.data && orderResponse.data.id, 'Order returns valid ID');
        console.log(`   Created order ID: ${orderResponse.data.id}`);
        
        // Verify order retrieval
        const getOrderResponse = await makeRequest(`/api/orders/${orderResponse.data.id}`);
        assert(getOrderResponse.statusCode === 200, 'Order retrieval successful');
        assert(getOrderResponse.data.id === orderResponse.data.id, 'Order ID matches');
      }
    }
  } catch (error) {
    assert(false, `Order processing flow failed: ${error.message}`);
  }
}

async function testAIChatSystem() {
  console.log('\n💬 Testing AI Chat System...');
  try {
    const chatPayload = {
      message: "I'd like to order a burger with fries",
      sessionId: `test-${Date.now()}`
    };
    
    const response = await makeRequest('/api/chat', {
      method: 'POST',
      body: chatPayload
    });
    
    assert(response.statusCode === 200, 'Chat API returns 200');
    assert(response.data && response.data.response, 'Chat returns response');
    assert(typeof response.data.response === 'string', 'Chat response is string');
    assert(response.data.response.length > 0, 'Chat response not empty');
    console.log(`   AI response length: ${response.data.response.length} characters`);
    
    // Test concise response requirement (under 3 sentences)
    const sentences = response.data.response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    assert(sentences.length <= 3, `AI response concise (${sentences.length} sentences)`);
    
  } catch (error) {
    assert(false, `AI Chat System failed: ${error.message}`);
  }
}

async function runProductionReadinessTests() {
  console.log('🚀 OrderFi AI - Production Readiness Test Suite\n');
  console.log(`Testing: ${TEST_CONFIG.baseUrl}`);
  
  const startTime = Date.now();
  
  // Wait for server readiness
  console.log('⏳ Waiting for server...');
  let serverReady = false;
  let attempts = 0;
  
  while (!serverReady && attempts < 10) {
    try {
      await makeRequest('/api/health');
      serverReady = true;
    } catch (error) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  if (!serverReady) {
    console.log('❌ Server not ready after 10 attempts');
    return;
  }
  
  console.log('✅ Server ready, executing tests...\n');
  
  // Execute test suites
  await testHealthEndpoint();
  await testTokenRewardsSystem();
  await testPerformanceMetrics();
  await testSecurityCompliance();
  await testOrderProcessingFlow();
  await testAIChatSystem();
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  
  // Production readiness assessment
  console.log('\n📊 Production Readiness Assessment');
  console.log('=' .repeat(60));
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed} ✅`);
  console.log(`Failed: ${testResults.failed} ❌`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  console.log(`Execution Time: ${totalTime}ms`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ Issues Requiring Attention:');
    testResults.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  const successRate = (testResults.passed / testResults.total) * 100;
  
  console.log('\n🎯 Production Readiness Grade');
  if (successRate >= 95) {
    console.log('🏆 GRADE: A+ (Ready for immediate deployment)');
  } else if (successRate >= 85) {
    console.log('🥇 GRADE: A (Production ready with minor optimizations)');
  } else if (successRate >= 75) {
    console.log('🥈 GRADE: B (Good foundation, address critical issues)');
  } else {
    console.log('🥉 GRADE: C (Requires significant improvements)');
  }
  
  process.exit(testResults.failed > 0 ? 1 : 0);
}

runProductionReadinessTests().catch(console.error);