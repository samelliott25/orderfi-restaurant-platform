#!/usr/bin/env node

// OrderFi AI - Deployment Testing Suite
import http from 'http';
import https from 'https';
import { URL } from 'url';

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000';

async function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.setEncoding('utf8');
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = data.startsWith('{') || data.startsWith('[') 
            ? JSON.parse(data) 
            : { raw: data, status: res.statusCode };
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: { raw: data } });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function testHealthEndpoint() {
  console.log('Testing health endpoint...');
  try {
    const response = await makeRequest('/health');
    console.log(`✅ Health check: ${response.status}`);
    if (response.data.status) {
      console.log(`   Status: ${response.data.status}`);
      console.log(`   Uptime: ${response.data.uptime}s`);
    }
    return response.status === 200;
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}`);
    return false;
  }
}

async function testChatEndpoint() {
  console.log('Testing chat endpoint...');
  try {
    const response = await makeRequest('/api/chat', {
      method: 'POST',
      body: {
        message: "What's on the menu?",
        restaurantId: 1,
        sessionId: 'test-session-' + Date.now()
      }
    });
    console.log(`✅ Chat endpoint: ${response.status}`);
    if (response.data.message || response.data.response) {
      console.log(`   Response received: ${(response.data.message || response.data.response).substring(0, 50)}...`);
    }
    return response.status === 200;
  } catch (error) {
    console.log(`❌ Chat test failed: ${error.message}`);
    return false;
  }
}

async function testDeploymentStatus() {
  console.log('Testing deployment status...');
  try {
    const response = await makeRequest('/api/deployment/status');
    console.log(`✅ Deployment status: ${response.status}`);
    if (response.data.status && response.data.metrics) {
      console.log(`   Deployment status: ${response.data.status}`);
      console.log(`   Response time: ${response.data.metrics.responseTime}ms`);
      console.log(`   Memory usage: ${(response.data.metrics.memoryUsage * 100).toFixed(1)}%`);
    }
    return response.status === 200;
  } catch (error) {
    console.log(`❌ Deployment status failed: ${error.message}`);
    return false;
  }
}

async function testMultiProviderFailover() {
  console.log('Testing multi-provider failover...');
  try {
    const response = await makeRequest('/api/deployment/providers');
    console.log(`✅ Provider status: ${response.status}`);
    if (response.data.providers) {
      console.log(`   Active providers: ${response.data.providers.filter(p => p.status === 'active').length}`);
      console.log(`   Health score: ${(response.data.healthScore * 100).toFixed(1)}%`);
    }
    return response.status === 200;
  } catch (error) {
    console.log(`❌ Provider status failed: ${error.message}`);
    return false;
  }
}

async function testRollupBatching() {
  console.log('Testing rollup batch processing...');
  try {
    const response = await makeRequest('/api/rollup/metrics');
    console.log(`✅ Rollup metrics: ${response.status}`);
    if (response.data.totalBatches !== undefined) {
      console.log(`   Total batches: ${response.data.totalBatches}`);
      console.log(`   Pending orders: ${response.data.pendingOrders}`);
      console.log(`   Gas savings: ${response.data.gasSavings} wei`);
    }
    return response.status === 200;
  } catch (error) {
    console.log(`❌ Rollup metrics failed: ${error.message}`);
    return false;
  }
}

async function testRewardsEndpoint() {
  console.log('Testing rewards endpoint...');
  try {
    const response = await makeRequest('/api/rewards/balance/test-customer');
    console.log(`✅ Rewards endpoint: ${response.status}`);
    return response.status === 200;
  } catch (error) {
    console.log(`❌ Rewards test failed: ${error.message}`);
    return false;
  }
}

async function testKitchenPrinting() {
  console.log('Testing kitchen printing...');
  try {
    const response = await makeRequest('/api/kitchen-printing/test-connection');
    console.log(`✅ Kitchen printing: ${response.status}`);
    return response.status === 200;
  } catch (error) {
    console.log(`❌ Kitchen printing test failed: ${error.message}`);
    return false;
  }
}

async function runFullTest() {
  console.log('🚀 Starting OrderFi AI Deployment Tests');
  console.log('=====================================');
  console.log(`Target: ${BASE_URL}`);
  console.log();

  const tests = [
    { name: 'Health Check', test: testHealthEndpoint },
    { name: 'AI Chat', test: testChatEndpoint },
    { name: 'Deployment Monitor', test: testDeploymentStatus },
    { name: 'Token Rewards', test: testRewardsEndpoint },
    { name: 'Kitchen Printing', test: testKitchenPrinting }
  ];

  const results = [];
  let passed = 0;

  for (const { name, test } of tests) {
    console.log(`\n--- ${name} ---`);
    try {
      const result = await test();
      results.push({ name, passed: result });
      if (result) passed++;
    } catch (error) {
      console.log(`❌ ${name} failed: ${error.message}`);
      results.push({ name, passed: false });
    }
  }

  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  results.forEach(({ name, passed }) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`);
  });

  console.log(`\n🎯 Overall: ${passed}/${tests.length} tests passed`);
  
  if (passed === tests.length) {
    console.log('🎉 All systems operational! Ready for Akash deployment.');
  } else if (passed >= tests.length * 0.8) {
    console.log('⚠️  Most systems operational. Minor issues detected.');
  } else {
    console.log('🚨 Critical issues detected. Review deployment before proceeding.');
  }

  return passed / tests.length;
}

// Run tests if this is the main module
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runFullTest().then((score) => {
    process.exit(score === 1 ? 0 : 1);
  }).catch((error) => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

export { runFullTest, makeRequest };