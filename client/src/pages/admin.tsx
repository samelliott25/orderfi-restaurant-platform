import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Wallet, TrendingUp, Database, ShoppingCart, Users } from "lucide-react";

export default function AdminPage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState("0.00");
  const [totalOrders, setTotalOrders] = useState(0);
  const [mimiTokensEarned, setMimiTokensEarned] = useState(0);
  const [feeSavings, setFeeSavings] = useState("0.00");
  const [blockchainBlocks, setBlockchainBlocks] = useState(1);

  useEffect(() => {
    // Load real data from API endpoints
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch actual wallet status
      const walletResponse = await fetch('/api/decentralized/status');
      const walletData = await walletResponse.json();
      
      // Fetch blockchain metrics
      const blockchainResponse = await fetch('/api/blockchain/stats');
      const blockchainData = await blockchainResponse.json();
      
      setWalletConnected(walletData.wallet?.connected || false);
      setUsdcBalance(walletData.wallet?.balance?.usdc || "0.00");
      setBlockchainBlocks(blockchainData.totalBlocks || 1);
      
      // Calculate fee savings based on transaction volume
      const volume = parseFloat(usdcBalance);
      const savings = (volume * 0.025).toFixed(2); // 2.5% credit card fee savings
      setFeeSavings(savings);
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const connectWallet = async () => {
    try {
      const response = await fetch('/api/decentralized/wallet/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletType: 'metamask',
          networkPreference: 'base'
        })
      });
      
      if (response.ok) {
        setWalletConnected(true);
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#8b795e]">Web3 Restaurant Dashboard</h1>
            <p className="text-[#8b795e]/70">Blockchain-powered ordering and payments</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={walletConnected ? "default" : "secondary"} className="bg-[#8b795e]">
              {walletConnected ? "Wallet Connected" : "Wallet Disconnected"}
            </Badge>
          </div>
        </div>

        {/* Wallet Connection */}
        {!walletConnected && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Wallet className="h-5 w-5" />
                Connect Web3 Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 mb-4">
                Connect your Web3 wallet to start accepting USDC payments and earning fee savings.
              </p>
              <Button onClick={connectWallet} className="bg-[#8b795e] hover:bg-[#6d5d4a]">
                Connect MetaMask
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8b795e]">USDC Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-[#8b795e]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#8b795e]">${usdcBalance}</div>
              <p className="text-xs text-[#8b795e]/70">Instant settlement, zero fees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8b795e]">Fee Savings</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${feeSavings}</div>
              <p className="text-xs text-[#8b795e]/70">vs traditional credit card fees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8b795e]">Orders Today</CardTitle>
              <ShoppingCart className="h-4 w-4 text-[#8b795e]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#8b795e]">{totalOrders}</div>
              <p className="text-xs text-[#8b795e]/70">AI-processed orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8b795e]">$MIMI Tokens</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{mimiTokensEarned}</div>
              <p className="text-xs text-[#8b795e]/70">Customer loyalty rewards</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8b795e]">Blockchain Blocks</CardTitle>
              <Database className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{blockchainBlocks}</div>
              <p className="text-xs text-[#8b795e]/70">Immutable data records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8b795e]">Network Status</CardTitle>
              <div className="h-4 w-4 bg-green-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-[#8b795e]/70">Decentralized & operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#8b795e]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                View Recent Orders
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Check USDC Balance
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Blockchain Backup
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Value Proposition */}
        <Card className="bg-[#ffe6b0]/20">
          <CardHeader>
            <CardTitle className="text-[#8b795e]">Why Web3 Restaurant Operations?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#8b795e]/80">
              <div>
                <h4 className="font-medium text-[#8b795e] mb-2">Zero Payment Fees</h4>
                <p>USDC payments on Base network cost less than $0.01 vs 3% credit card fees</p>
              </div>
              <div>
                <h4 className="font-medium text-[#8b795e] mb-2">Instant Settlement</h4>
                <p>Receive payments immediately instead of waiting 2-3 days for bank transfers</p>
              </div>
              <div>
                <h4 className="font-medium text-[#8b795e] mb-2">Customer Ownership</h4>
                <p>Own your customer data - no platform can deplatform or change terms</p>
              </div>
              <div>
                <h4 className="font-medium text-[#8b795e] mb-2">Global Reach</h4>
                <p>Accept payments from any Web3 wallet worldwide without banking restrictions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
