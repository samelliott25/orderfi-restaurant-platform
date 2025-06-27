interface AkashProvider {
  id: string;
  endpoint: string;
  region: string;
  status: 'active' | 'degraded' | 'offline';
  latency: number;
  reliability: number;
  lastCheck: number;
  deploymentId?: string;
}

interface HealthMetrics {
  responseTime: number;
  success: boolean;
  timestamp: number;
  errorMessage?: string;
}

class MultiProviderFailoverService {
  private providers: Map<string, AkashProvider> = new Map();
  private activeProvider: string = '';
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private routingTable: Map<string, string> = new Map(); // endpoint -> provider mapping

  constructor() {
    this.initializeProviders();
    this.startHealthChecking();
  }

  private initializeProviders(): void {
    const defaultProviders: AkashProvider[] = [
      {
        id: 'akash-us-west-1',
        endpoint: 'https://orderfi-usw1.akash.network',
        region: 'us-west-1',
        status: 'active',
        latency: 50,
        reliability: 0.995,
        lastCheck: Date.now()
      },
      {
        id: 'akash-eu-central-1',
        endpoint: 'https://orderfi-euc1.akash.network',
        region: 'eu-central-1',
        status: 'active',
        latency: 75,
        reliability: 0.992,
        lastCheck: Date.now()
      },
      {
        id: 'akash-ap-southeast-1',
        endpoint: 'https://orderfi-apse1.akash.network',
        region: 'ap-southeast-1',
        status: 'active',
        latency: 120,
        reliability: 0.988,
        lastCheck: Date.now()
      }
    ];

    defaultProviders.forEach(provider => {
      this.providers.set(provider.id, provider);
      this.routingTable.set(provider.endpoint, provider.id);
    });

    // Set initial active provider (lowest latency)
    this.selectOptimalProvider();
  }

  private selectOptimalProvider(): void {
    const activeProviders = Array.from(this.providers.values())
      .filter(p => p.status === 'active')
      .sort((a, b) => {
        // Primary: reliability, Secondary: latency
        if (Math.abs(a.reliability - b.reliability) > 0.01) {
          return b.reliability - a.reliability;
        }
        return a.latency - b.latency;
      });

    if (activeProviders.length > 0) {
      this.activeProvider = activeProviders[0].id;
      console.log(`🌐 Active provider: ${this.activeProvider} (${activeProviders[0].region})`);
    }
  }

  private startHealthChecking(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, 30000); // Check every 30 seconds
  }

  private async performHealthChecks(): Promise<void> {
    const healthPromises = Array.from(this.providers.values()).map(provider =>
      this.checkProviderHealth(provider)
    );

    await Promise.allSettled(healthPromises);
    this.selectOptimalProvider();
  }

  private async checkProviderHealth(provider: AkashProvider): Promise<HealthMetrics> {
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

      const response = await fetch(`${provider.endpoint}/health`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        
        // Update provider metrics
        provider.latency = responseTime;
        provider.status = data.status === 'degraded' ? 'degraded' : 'active';
        provider.reliability = Math.min(0.999, provider.reliability * 0.99 + 0.01);
        provider.lastCheck = Date.now();

        return {
          responseTime,
          success: true,
          timestamp: Date.now()
        };
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      // Mark provider as degraded or offline
      provider.status = provider.reliability > 0.5 ? 'degraded' : 'offline';
      provider.reliability = Math.max(0.001, provider.reliability * 0.95);
      provider.lastCheck = Date.now();

      return {
        responseTime: Date.now() - startTime,
        success: false,
        timestamp: Date.now(),
        errorMessage: error.message
      };
    }
  }

  async routeRequest(path: string, options: RequestInit = {}): Promise<Response> {
    let attempts = 0;
    const maxAttempts = 3;
    const activeProviders = Array.from(this.providers.values())
      .filter(p => p.status !== 'offline')
      .sort((a, b) => b.reliability - a.reliability);

    if (activeProviders.length === 0) {
      throw new Error('No healthy providers available');
    }

    for (const provider of activeProviders) {
      if (attempts >= maxAttempts) break;
      attempts++;

      try {
        const url = `${provider.endpoint}${path}`;
        const response = await fetch(url, {
          ...options,
          headers: {
            'X-Provider-ID': provider.id,
            'X-Region': provider.region,
            ...options.headers
          }
        });

        if (response.ok) {
          // Update successful request metrics
          provider.reliability = Math.min(0.999, provider.reliability * 0.99 + 0.01);
          console.log(`✅ Request routed via ${provider.id} (${response.status})`);
          return response;
        } else if (response.status >= 500) {
          // Server error, try next provider
          continue;
        } else {
          // Client error, return as-is
          return response;
        }
      } catch (error) {
        console.warn(`❌ Provider ${provider.id} failed: ${error.message}`);
        provider.reliability = Math.max(0.001, provider.reliability * 0.95);
        
        if (attempts === maxAttempts) {
          throw error;
        }
      }
    }

    throw new Error('All providers failed to handle request');
  }

  async deployToNewProvider(config: {
    region: string;
    resources: { cpu: number; memory: string; storage: string };
  }): Promise<string> {
    const deploymentId = `deployment-${Date.now()}`;
    
    try {
      console.log(`🚀 Deploying to new provider in ${config.region}...`);
      
      // Simulate Akash deployment process
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const newProvider: AkashProvider = {
        id: `akash-${config.region}-${Date.now()}`,
        endpoint: `https://orderfi-${deploymentId}.akash.network`,
        region: config.region,
        status: 'active',
        latency: 100,
        reliability: 0.99,
        lastCheck: Date.now(),
        deploymentId
      };

      this.providers.set(newProvider.id, newProvider);
      this.routingTable.set(newProvider.endpoint, newProvider.id);
      
      console.log(`✅ New provider deployed: ${newProvider.id}`);
      return newProvider.id;
    } catch (error) {
      console.error(`❌ Deployment failed: ${error.message}`);
      throw error;
    }
  }

  async migrateTraffic(fromProviderId: string, toProviderId: string): Promise<boolean> {
    try {
      const fromProvider = this.providers.get(fromProviderId);
      const toProvider = this.providers.get(toProviderId);

      if (!fromProvider || !toProvider) {
        throw new Error('Provider not found');
      }

      console.log(`🔄 Migrating traffic from ${fromProviderId} to ${toProviderId}...`);

      // Gradual traffic migration simulation
      const migrationSteps = [0.25, 0.5, 0.75, 1.0];
      
      for (const ratio of migrationSteps) {
        console.log(`   Migration progress: ${(ratio * 100).toFixed(0)}%`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Update active provider
      if (this.activeProvider === fromProviderId) {
        this.activeProvider = toProviderId;
      }

      // Mark old provider for decommission
      fromProvider.status = 'degraded';
      
      console.log(`✅ Traffic migration completed`);
      return true;
    } catch (error) {
      console.error(`❌ Migration failed: ${error.message}`);
      return false;
    }
  }

  getProviderStatus(): {
    active: string;
    providers: AkashProvider[];
    healthScore: number;
    recommendations: string[];
  } {
    const providers = Array.from(this.providers.values());
    const activeProviders = providers.filter(p => p.status === 'active');
    const avgReliability = providers.reduce((sum, p) => sum + p.reliability, 0) / providers.length;
    
    const recommendations: string[] = [];
    
    if (activeProviders.length < 2) {
      recommendations.push('Deploy additional providers for redundancy');
    }
    
    if (avgReliability < 0.95) {
      recommendations.push('System reliability below threshold - investigate provider issues');
    }
    
    const regionCoverage = new Set(providers.map(p => p.region.split('-')[0])).size;
    if (regionCoverage < 3) {
      recommendations.push('Expand to additional geographic regions');
    }

    return {
      active: this.activeProvider,
      providers,
      healthScore: avgReliability,
      recommendations
    };
  }

  async scaleBasedOnLoad(currentLoad: number): Promise<void> {
    const loadThreshold = 0.8; // 80% capacity
    const providers = Array.from(this.providers.values());
    const activeCount = providers.filter(p => p.status === 'active').length;

    if (currentLoad > loadThreshold && activeCount < 5) {
      console.log(`📈 High load detected (${(currentLoad * 100).toFixed(1)}%), scaling up...`);
      
      // Deploy to least represented region
      const regionCounts = new Map<string, number>();
      providers.forEach(p => {
        const region = p.region.split('-')[0];
        regionCounts.set(region, (regionCounts.get(region) || 0) + 1);
      });

      const targetRegion = Array.from(regionCounts.entries())
        .sort(([,a], [,b]) => a - b)[0][0];

      await this.deployToNewProvider({
        region: `${targetRegion}-${Date.now()}`,
        resources: { cpu: 1, memory: '1Gi', storage: '5Gi' }
      });
    }
  }

  stop(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}

export const multiProviderFailover = new MultiProviderFailoverService();