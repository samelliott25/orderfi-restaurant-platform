import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      timeout: 5000,
      ...options
    });
    return {
      status: response.status,
      data: await response.json().catch(() => ({})),
      ok: response.ok
    };
  } catch (error) {
    return {
      status: 0,
      data: { error: error.message },
      ok: false
    };
  }
}

async function testHealthCheck() {
  console.log("\n--- Health Check ---");
  const result = await makeRequest('/api/health');
  
  if (result.ok && result.data.status === 'healthy') {
    console.log("✅ Health check passed");
    return true;
  } else {
    console.log(`❌ Health check failed: ${result.status}`);
    return false;
  }
}

async function testTokenRewards() {
  console.log("\n--- Token Rewards System ---");
  
  // Test getting rewards for seeded customer
  const rewardsResult = await makeRequest('/api/rewards/alice@example.com');
  
  if (rewardsResult.ok) {
    console.log(`✅ Token rewards endpoint working`);
    console.log(`   Customer: ${rewardsResult.data.customer_email}`);
    console.log(`   Points: ${rewardsResult.data.total_points}`);
    console.log(`   Tier: ${rewardsResult.data.tier}`);
    return true;
  } else {
    console.log(`❌ Token rewards failed: ${rewardsResult.status}`);
    console.log(`   Error: ${JSON.stringify(rewardsResult.data)}`);
    return false;
  }
}

async function testOrders() {
  console.log("\n--- Order System ---");
  
  const ordersResult = await makeRequest('/api/restaurants/1/orders');
  
  if (ordersResult.ok && Array.isArray(ordersResult.data)) {
    console.log(`✅ Orders endpoint working`);
    console.log(`   Found ${ordersResult.data.length} orders`);
    return true;
  } else {
    console.log(`❌ Orders failed: ${ordersResult.status}`);
    return false;
  }
}

async function testAIChat() {
  console.log("\n--- AI Chat System ---");
  
  const chatResult = await makeRequest('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'I want to order a burger',
      session_id: 'test-session-production',
      restaurant_id: 1
    })
  });
  
  if (chatResult.ok && chatResult.data.response) {
    console.log("✅ AI chat working");
    console.log(`   Response length: ${chatResult.data.response.length} chars`);
    return true;
  } else {
    console.log(`❌ AI chat failed: ${chatResult.status}`);
    return false;
  }
}

async function testPerformanceMetrics() {
  console.log("\n--- Performance Metrics ---");
  
  const cacheResult = await makeRequest('/api/performance/cache');
  
  if (cacheResult.ok) {
    console.log("✅ Performance monitoring working");
    console.log(`   Cache hit rate: ${cacheResult.data.hitRate || 'N/A'}`);
    console.log(`   Total requests: ${cacheResult.data.totalRequests || 'N/A'}`);
    return true;
  } else {
    console.log(`❌ Performance metrics failed: ${cacheResult.status}`);
    return false;
  }
}

async function testSecurityHeaders() {
  console.log("\n--- Security Headers ---");
  
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const headers = response.headers;
    
    const securityHeaders = [
      'x-content-type-options',
      'x-frame-options', 
      'x-xss-protection'
    ];
    
    let headerCount = 0;
    securityHeaders.forEach(header => {
      if (headers.get(header)) {
        headerCount++;
      }
    });
    
    if (headerCount >= 2) {
      console.log(`✅ Security headers applied (${headerCount}/${securityHeaders.length})`);
      return true;
    } else {
      console.log(`⚠️ Limited security headers (${headerCount}/${securityHeaders.length})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Security headers test failed: ${error.message}`);
    return false;
  }
}

async function runProductionTests() {
  console.log("🚀 OrderFi AI Production Readiness Tests");
  console.log("==========================================");
  
  const tests = [
    testHealthCheck,
    testTokenRewards,
    testOrders,
    testAIChat,
    testPerformanceMetrics,
    testSecurityHeaders
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) passed++;
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
    }
  }
  
  console.log("\n" + "=".repeat(40));
  console.log(`📊 Production Test Results: ${passed}/${total} passed`);
  
  if (passed === total) {
    console.log("🎉 All systems operational - Ready for beta deployment!");
  } else if (passed >= total - 1) {
    console.log("⚠️ Minor issues detected - Beta ready with monitoring");
  } else {
    console.log("❌ Critical issues detected - Additional fixes needed");
  }
  
  const score = Math.round((passed / total) * 100);
  console.log(`🏆 Production Readiness Score: ${score}/100`);
  
  return { passed, total, score };
}

// Run tests
runProductionTests()
  .then((results) => {
    process.exit(results.passed === results.total ? 0 : 1);
  })
  .catch((error) => {
    console.error("💥 Test suite failed:", error);
    process.exit(1);
  });