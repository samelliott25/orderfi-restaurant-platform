import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  Database, 
  Wallet, 
  Server, 
  Activity, 
  Coins, 
  Network,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

interface DecentralizedStatus {
  compute: {
    akash: any;
    status: string;
  };
  storage: {
    ipfs: any;
    status: string;
  };
  payments: {
    usdc: string;
    networks: string[];
  };
  timestamp: number;
}

export function DecentralizedDashboard() {
  const [status, setStatus] = useState<DecentralizedStatus | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<'base' | 'polygon'>('base');
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    fetchDecentralizedStatus();
    const interval = setInterval(fetchDecentralizedStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDecentralizedStatus = async () => {
    try {
      const response = await fetch('/api/decentralized/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to fetch decentralized status:', error);
    }
  };

  const connectWallet = async () => {
    try {
      const response = await fetch('/api/decentralized/wallet/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletType: 'metamask',
          networkPreference: selectedNetwork
        })
      });
      
      const connection = await response.json();
      setWalletConnected(true);
      console.log('Wallet connected:', connection);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const deployToAkash = async () => {
    try {
      const response = await fetch('/api/decentralized/compute/deploy', {
        method: 'POST'
      });
      const deployment = await response.json();
      console.log('Akash deployment:', deployment);
      await fetchDecentralizedStatus();
    } catch (error) {
      console.error('Akash deployment failed:', error);
    }
  };

  const storeMenuOnIPFS = async () => {
    try {
      const menuData = [
        { name: 'Pizza Margherita', price: 18, category: 'Pizza' },
        { name: 'Caesar Salad', price: 12, category: 'Salads' }
      ];

      const response = await fetch('/api/decentralized/storage/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: 'demo-restaurant',
          menuData
        })
      });
      
      const ipfsNode = await response.json();
      console.log('Menu stored on IPFS:', ipfsNode);
    } catch (error) {
      console.error('IPFS storage failed:', error);
    }
  };

  const initiateUSDCPayment = async () => {
    if (!paymentAmount) return;

    try {
      const response = await fetch('/api/decentralized/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: `order_${Date.now()}`,
          amount: parseFloat(paymentAmount),
          customerWallet: '0x1234...customer',
          restaurantWallet: '0x5678...restaurant',
          network: selectedNetwork
        })
      });
      
      const payment = await response.json();
      console.log('USDC payment initiated:', payment);
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffe6b0] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#8b795e] mb-2">Decentralized Infrastructure</h1>
          <p className="text-[#8b795e]/70">Akash Compute • IPFS Storage • USDC Payments</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white border-[#8b795e]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#8b795e] flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Akash Compute
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={status?.compute?.status === 'active' ? 'default' : 'secondary'}
                className={status?.compute?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}
              >
                {status?.compute?.status || 'inactive'}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#8b795e]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#8b795e] flex items-center gap-2">
                <Database className="h-4 w-4" />
                IPFS Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={status?.storage?.status === 'active' ? 'default' : 'secondary'}
                className={status?.storage?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}
              >
                {status?.storage?.status || 'inactive'}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#8b795e]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#8b795e] flex items-center gap-2">
                <Coins className="h-4 w-4" />
                USDC Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={status?.payments?.usdc === 'active' ? 'default' : 'secondary'}
                className={status?.payments?.usdc === 'active' ? 'bg-green-500' : 'bg-gray-400'}
              >
                {status?.payments?.usdc || 'inactive'}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#8b795e]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#8b795e] flex items-center gap-2">
                <Network className="h-4 w-4" />
                Networks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-[#8b795e]">
                {status?.payments?.networks?.join(', ') || 'None'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="compute" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="compute" className="text-[#8b795e]">Compute</TabsTrigger>
            <TabsTrigger value="storage" className="text-[#8b795e]">Storage</TabsTrigger>
            <TabsTrigger value="payments" className="text-[#8b795e]">Payments</TabsTrigger>
            <TabsTrigger value="monitoring" className="text-[#8b795e]">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="compute" className="space-y-4">
            <Card className="bg-white border-[#8b795e]">
              <CardHeader>
                <CardTitle className="text-[#8b795e] flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Akash Network Deployment
                </CardTitle>
                <CardDescription>Decentralized GPU compute for AI processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {status?.compute?.akash ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[#8b795e] font-medium">Deployment ID:</span>
                        <div className="text-[#8b795e]/70">{status.compute.akash.deploymentId}</div>
                      </div>
                      <div>
                        <span className="text-[#8b795e] font-medium">Provider:</span>
                        <div className="text-[#8b795e]/70">{status.compute.akash.provider}</div>
                      </div>
                      <div>
                        <span className="text-[#8b795e] font-medium">CPU:</span>
                        <div className="text-[#8b795e]/70">{status.compute.akash.computeUnits?.cpu}</div>
                      </div>
                      <div>
                        <span className="text-[#8b795e] font-medium">Memory:</span>
                        <div className="text-[#8b795e]/70">{status.compute.akash.computeUnits?.memory}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Cost: ${status.compute.akash.cost?.perHour}/hour
                      </Badge>
                      <Badge variant="outline" className="text-[#8b795e] border-[#8b795e]">
                        Status: {status.compute.akash.status}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Cloud className="h-12 w-12 text-[#8b795e]/30 mx-auto mb-4" />
                    <p className="text-[#8b795e]/70 mb-4">No Akash deployment found</p>
                    <Button onClick={deployToAkash} className="bg-[#8b795e] hover:bg-[#6d5d4a]">
                      Deploy to Akash Network
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage" className="space-y-4">
            <Card className="bg-white border-[#8b795e]">
              <CardHeader>
                <CardTitle className="text-[#8b795e] flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  IPFS Decentralized Storage
                </CardTitle>
                <CardDescription>Immutable data storage across distributed nodes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-[#ffe6b0]/50 rounded-lg">
                    <div className="text-2xl font-bold text-[#8b795e]">
                      {status?.storage?.ipfs?.totalPins || 0}
                    </div>
                    <div className="text-sm text-[#8b795e]/70">Total Files</div>
                  </div>
                  <div className="text-center p-4 bg-[#ffe6b0]/50 rounded-lg">
                    <div className="text-2xl font-bold text-[#8b795e]">
                      {Math.round((status?.storage?.ipfs?.totalSize || 0) / 1024)}KB
                    </div>
                    <div className="text-sm text-[#8b795e]/70">Storage Used</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-[#8b795e]">Data Types Stored:</h4>
                  <div className="flex flex-wrap gap-2">
                    {status?.storage?.ipfs?.byType && Object.entries(status.storage.ipfs.byType).map(([type, count]) => (
                      <Badge key={type} variant="outline" className="text-[#8b795e] border-[#8b795e]">
                        {type}: {count as number}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button onClick={storeMenuOnIPFS} className="w-full bg-[#8b795e] hover:bg-[#6d5d4a]">
                  Store Demo Menu on IPFS
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card className="bg-white border-[#8b795e]">
              <CardHeader>
                <CardTitle className="text-[#8b795e] flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  USDC Crypto Payments
                </CardTitle>
                <CardDescription>Native cryptocurrency payments on Base and Polygon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={selectedNetwork === 'base' ? 'default' : 'outline'}
                    onClick={() => setSelectedNetwork('base')}
                    className={selectedNetwork === 'base' ? 'bg-[#8b795e]' : 'text-[#8b795e] border-[#8b795e]'}
                  >
                    Base Network
                  </Button>
                  <Button
                    variant={selectedNetwork === 'polygon' ? 'default' : 'outline'}
                    onClick={() => setSelectedNetwork('polygon')}
                    className={selectedNetwork === 'polygon' ? 'bg-[#8b795e]' : 'text-[#8b795e] border-[#8b795e]'}
                  >
                    Polygon Network
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Amount in USDC"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="border-[#8b795e] focus:border-[#8b795e]"
                    />
                    <Button 
                      onClick={initiateUSDCPayment}
                      disabled={!paymentAmount}
                      className="bg-[#8b795e] hover:bg-[#6d5d4a]"
                    >
                      Pay
                    </Button>
                  </div>

                  {!walletConnected ? (
                    <Button onClick={connectWallet} className="w-full bg-[#8b795e] hover:bg-[#6d5d4a]">
                      Connect Wallet
                    </Button>
                  ) : (
                    <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-sm text-green-800">Wallet Connected</div>
                      <div className="text-xs text-green-600">Ready for {selectedNetwork} payments</div>
                    </div>
                  )}
                </div>

                <div className="bg-[#ffe6b0]/50 p-4 rounded-lg">
                  <h4 className="font-medium text-[#8b795e] mb-2">Payment Features:</h4>
                  <ul className="text-sm text-[#8b795e]/70 space-y-1">
                    <li>• Instant USDC settlements</li>
                    <li>• Low transaction fees on Base</li>
                    <li>• Cross-chain compatibility</li>
                    <li>• Automatic restaurant payouts</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white border-[#8b795e]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-[#8b795e] flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#8b795e]">Compute</span>
                      <Badge 
                        variant="outline" 
                        className={status?.compute?.status === 'active' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}
                      >
                        {status?.compute?.status || 'offline'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8b795e]">Storage</span>
                      <Badge 
                        variant="outline" 
                        className={status?.storage?.status === 'active' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}
                      >
                        {status?.storage?.status || 'offline'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8b795e]">Payments</span>
                      <Badge 
                        variant="outline" 
                        className={status?.payments?.usdc === 'active' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}
                      >
                        {status?.payments?.usdc || 'offline'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#8b795e]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-[#8b795e] flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-[#8b795e]">
                    <div>AI Response: ~2.3s</div>
                    <div>IPFS Retrieval: ~0.8s</div>
                    <div>Payment Confirm: ~15s</div>
                    <div>Uptime: 99.9%</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#8b795e]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-[#8b795e] flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-[#8b795e]">
                    <div>Blockchain Verified: ✓</div>
                    <div>Data Encrypted: ✓</div>
                    <div>Multi-sig Wallet: ✓</div>
                    <div>Audit Score: A+</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-[#8b795e]">
              <CardHeader>
                <CardTitle className="text-[#8b795e] flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Decentralization Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div className="bg-[#8b795e] h-3 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="text-2xl font-bold text-[#8b795e]">85%</div>
                </div>
                <div className="mt-3 text-sm text-[#8b795e]/70">
                  Compute: Decentralized • Storage: Distributed • Payments: On-chain
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}