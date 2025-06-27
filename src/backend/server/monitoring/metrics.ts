import { Request, Response } from 'express';

interface Metrics {
  requests: {
    total: number;
    success: number;
    error: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  ai: {
    chatRequests: number;
    visionRequests: number;
    averageResponseTime: number;
  };
  blockchain: {
    blocksCreated: number;
    totalTransactions: number;
    averageBlockTime: number;
  };
  web3: {
    walletsConnected: number;
    usdcTransactions: number;
    totalVolume: number;
  };
}

class MetricsCollector {
  private metrics: Metrics = {
    requests: { total: 0, success: 0, error: 0 },
    orders: { total: 0, pending: 0, completed: 0, cancelled: 0 },
    ai: { chatRequests: 0, visionRequests: 0, averageResponseTime: 0 },
    blockchain: { blocksCreated: 0, totalTransactions: 0, averageBlockTime: 0 },
    web3: { walletsConnected: 0, usdcTransactions: 0, totalVolume: 0 }
  };

  private responseTimes: number[] = [];

  incrementRequests(success: boolean = true) {
    this.metrics.requests.total++;
    if (success) {
      this.metrics.requests.success++;
    } else {
      this.metrics.requests.error++;
    }
  }

  recordOrder(status: 'pending' | 'completed' | 'cancelled') {
    this.metrics.orders.total++;
    this.metrics.orders[status]++;
  }

  recordAiRequest(type: 'chat' | 'vision', responseTime: number) {
    if (type === 'chat') {
      this.metrics.ai.chatRequests++;
    } else {
      this.metrics.ai.visionRequests++;
    }
    
    this.responseTimes.push(responseTime);
    this.metrics.ai.averageResponseTime = 
      this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
  }

  recordBlockchainActivity(blockTime: number) {
    this.metrics.blockchain.blocksCreated++;
    this.metrics.blockchain.totalTransactions++;
    
    const currentAvg = this.metrics.blockchain.averageBlockTime;
    const count = this.metrics.blockchain.blocksCreated;
    this.metrics.blockchain.averageBlockTime = 
      (currentAvg * (count - 1) + blockTime) / count;
  }

  recordWeb3Transaction(amount: number) {
    this.metrics.web3.usdcTransactions++;
    this.metrics.web3.totalVolume += amount;
  }

  recordWalletConnection() {
    this.metrics.web3.walletsConnected++;
  }

  getMetrics(): Metrics {
    return { ...this.metrics };
  }

  getPrometheusMetrics(): string {
    const metrics = this.getMetrics();
    
    return `
# HELP mimi_requests_total Total number of HTTP requests
# TYPE mimi_requests_total counter
mimi_requests_total{status="success"} ${metrics.requests.success}
mimi_requests_total{status="error"} ${metrics.requests.error}

# HELP mimi_orders_total Total number of orders by status
# TYPE mimi_orders_total counter
mimi_orders_total{status="pending"} ${metrics.orders.pending}
mimi_orders_total{status="completed"} ${metrics.orders.completed}
mimi_orders_total{status="cancelled"} ${metrics.orders.cancelled}

# HELP mimi_ai_requests_total Total AI requests
# TYPE mimi_ai_requests_total counter
mimi_ai_requests_total{type="chat"} ${metrics.ai.chatRequests}
mimi_ai_requests_total{type="vision"} ${metrics.ai.visionRequests}

# HELP mimi_ai_response_time_avg Average AI response time in ms
# TYPE mimi_ai_response_time_avg gauge
mimi_ai_response_time_avg ${metrics.ai.averageResponseTime}

# HELP mimi_blockchain_blocks_total Total blockchain blocks created
# TYPE mimi_blockchain_blocks_total counter
mimi_blockchain_blocks_total ${metrics.blockchain.blocksCreated}

# HELP mimi_web3_wallets_connected Total wallets connected
# TYPE mimi_web3_wallets_connected counter
mimi_web3_wallets_connected ${metrics.web3.walletsConnected}

# HELP mimi_web3_usdc_volume_total Total USDC transaction volume
# TYPE mimi_web3_usdc_volume_total counter
mimi_web3_usdc_volume_total ${metrics.web3.totalVolume}
    `.trim();
  }

  generateHealthReport(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, boolean>;
    metrics: Metrics;
  } {
    const metrics = this.getMetrics();
    const errorRate = metrics.requests.total > 0 
      ? metrics.requests.error / metrics.requests.total 
      : 0;
    
    const checks = {
      lowErrorRate: errorRate < 0.05,
      aiResponsive: metrics.ai.averageResponseTime < 5000,
      blockchainActive: metrics.blockchain.blocksCreated > 0,
      ordersProcessing: metrics.orders.completed > 0 || metrics.orders.total === 0,
    };

    const healthyChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.values(checks).length;
    
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyChecks === totalChecks) {
      status = 'healthy';
    } else if (healthyChecks >= totalChecks * 0.7) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return { status, checks, metrics };
  }
}

export const metricsCollector = new MetricsCollector();

export const metricsMiddleware = (req: Request, res: Response, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    const success = res.statusCode < 400;
    
    metricsCollector.incrementRequests(success);
    
    if (req.path.includes('/chat')) {
      metricsCollector.recordAiRequest('chat', responseTime);
    } else if (req.path.includes('/vision')) {
      metricsCollector.recordAiRequest('vision', responseTime);
    }
  });
  
  next();
};

export const getMetricsHandler = (req: Request, res: Response) => {
  const format = req.query.format as string;
  
  if (format === 'prometheus') {
    res.set('Content-Type', 'text/plain');
    res.send(metricsCollector.getPrometheusMetrics());
  } else {
    res.json(metricsCollector.getMetrics());
  }
};

export const getHealthHandler = (req: Request, res: Response) => {
  const report = metricsCollector.generateHealthReport();
  const statusCode = report.status === 'healthy' ? 200 : 
                    report.status === 'degraded' ? 200 : 503;
  
  res.status(statusCode).json(report);
};