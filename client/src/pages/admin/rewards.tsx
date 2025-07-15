import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  Download, 
  ExternalLink,
  Coins,
  Award,
  Users,
  Clock,
  ArrowUpRight,
  Copy,
  CheckCircle
} from "lucide-react";

interface RewardData {
  totalEarned: number;
  monthlyEarnings: number;
  networkShare: number;
  mimiTokens: number;
  referralBonus: number;
  performanceBonus: number;
}

interface NetworkStats {
  totalRestaurants: number;
  totalOrders: number;
  networkRevenue: number;
  yourShare: number;
}

export default function AdminRewardsPage() {
  const [rewardData] = useState<RewardData>({
    totalEarned: 2847.50,
    monthlyEarnings: 485.25,
    networkShare: 156.75,
    mimiTokens: 12500,
    referralBonus: 125.00,
    performanceBonus: 203.50
  });

  const [networkStats] = useState<NetworkStats>({
    totalRestaurants: 1847,
    totalOrders: 89432,
    networkRevenue: 2456789.50,
    yourShare: 0.0064
  });

  const [walletAddress] = useState("0x742d35...4563BCaF");
  const [copied, setCopied] = useState(false);

  const copyWalletAddress = () => {
    navigator.clipboard.writeText("0x742d35Cc6Cc77459468BBa49E3B4563BCaF");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const monthlyData = [
    { month: "Jan", earnings: 425.50, tokens: 1100 },
    { month: "Feb", earnings: 389.25, tokens: 950 },
    { month: "Mar", earnings: 467.75, tokens: 1250 },
    { month: "Apr", earnings: 512.00, tokens: 1340 },
    { month: "May", earnings: 485.25, tokens: 1200 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-normal tracking-tight playwrite-font" style={{ color: '#8b795e' }}>
              $MIMI Rewards
            </h1>
            <p className="text-sm" style={{ color: '#8b795e' }}>
              Track your crypto earnings and network revenue share
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={copyWalletAddress}
              className="flex items-center gap-2"
              style={{ borderColor: '#8b795e', color: '#8b795e' }}
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {walletAddress}
            </Button>
            <Button 
              className="bg-[#8b795e] hover:bg-[#6d5d4f] text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-normal" style={{ color: '#8b795e' }}>
                Total Earned
              </CardTitle>
              <DollarSign className="h-4 w-4" style={{ color: '#8b795e' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-normal" style={{ color: '#8b795e' }}>
                ${rewardData.totalEarned.toLocaleString()}
              </div>
              <p className="text-xs" style={{ color: '#8b795e' }}>
                All-time cryptocurrency earnings
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#8b795e' }}>
                This Month
              </CardTitle>
              <TrendingUp className="h-4 w-4" style={{ color: '#8b795e' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#8b795e' }}>
                ${rewardData.monthlyEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-green-600">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#8b795e' }}>
                OrderFi Tokens
              </CardTitle>
              <Coins className="h-4 w-4" style={{ color: '#8b795e' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#8b795e' }}>
                {rewardData.mimiTokens.toLocaleString()}
              </div>
              <p className="text-xs" style={{ color: '#8b795e' }}>
                ≈ ${(rewardData.mimiTokens * 0.15).toFixed(2)} USD
              </p>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: '#8b795e' }}>
                Network Share
              </CardTitle>
              <Users className="h-4 w-4" style={{ color: '#8b795e' }} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" style={{ color: '#8b795e' }}>
                ${rewardData.networkShare.toLocaleString()}
              </div>
              <p className="text-xs" style={{ color: '#8b795e' }}>
                {(networkStats.yourShare * 100).toFixed(3)}% of network revenue
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="earnings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#8b795e' }}>Monthly Earnings Trend</CardTitle>
                  <CardDescription style={{ color: '#8b795e' }}>
                    Your cryptocurrency earnings over the last 5 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.map((month, index) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 text-sm font-medium" style={{ color: '#8b795e' }}>
                            {month.month}
                          </div>
                          <div className="flex-1">
                            <Progress 
                              value={(month.earnings / 600) * 100} 
                              className="h-2" 
                            />
                          </div>
                        </div>
                        <div className="text-sm font-medium" style={{ color: '#8b795e' }}>
                          ${month.earnings}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#8b795e' }}>Earning Sources</CardTitle>
                  <CardDescription style={{ color: '#8b795e' }}>
                    Breakdown of your revenue streams
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium" style={{ color: '#8b795e' }}>Order Processing</span>
                    </div>
                    <span className="font-bold" style={{ color: '#8b795e' }}>$342.75</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium" style={{ color: '#8b795e' }}>Network Revenue Share</span>
                    </div>
                    <span className="font-bold" style={{ color: '#8b795e' }}>$156.75</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="font-medium" style={{ color: '#8b795e' }}>AI Training Contribution</span>
                    </div>
                    <span className="font-bold" style={{ color: '#8b795e' }}>$85.50</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
              <CardHeader>
                <CardTitle style={{ color: '#8b795e' }}>MIMI Network Statistics</CardTitle>
                <CardDescription style={{ color: '#8b795e' }}>
                  Global network performance and your contribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{ color: '#8b795e' }}>
                      {networkStats.totalRestaurants.toLocaleString()}
                    </div>
                    <p className="text-sm" style={{ color: '#8b795e' }}>Total Restaurants</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{ color: '#8b795e' }}>
                      {networkStats.totalOrders.toLocaleString()}
                    </div>
                    <p className="text-sm" style={{ color: '#8b795e' }}>Total Orders</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{ color: '#8b795e' }}>
                      ${(networkStats.networkRevenue / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-sm" style={{ color: '#8b795e' }}>Network Revenue</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{ color: '#8b795e' }}>
                      {(networkStats.yourShare * 100).toFixed(3)}%
                    </div>
                    <p className="text-sm" style={{ color: '#8b795e' }}>Your Share</p>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e5cf97' }}>
                  <h4 className="font-semibold mb-2" style={{ color: '#8b795e' }}>How Network Revenue Sharing Works</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#8b795e' }}>
                    As a MIMI network participant, you earn a percentage of the total network revenue based on your restaurant's performance, 
                    order volume, customer satisfaction scores, and AI training data contributions. The more you engage with the platform, 
                    the higher your revenue share percentage becomes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bonuses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#8b795e' }}>Performance Bonuses</CardTitle>
                  <CardDescription style={{ color: '#8b795e' }}>
                    Rewards for exceptional service and customer satisfaction
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5" style={{ color: '#8b795e' }} />
                      <div>
                        <p className="font-medium" style={{ color: '#8b795e' }}>Customer Satisfaction</p>
                        <p className="text-xs" style={{ color: '#8b795e' }}>4.8+ star rating</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">+$125.50</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5" style={{ color: '#8b795e' }} />
                      <div>
                        <p className="font-medium" style={{ color: '#8b795e' }}>Fast Service</p>
                        <p className="text-xs" style={{ color: '#8b795e' }}>Average under 5 min response</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">+$78.00</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
                <CardHeader>
                  <CardTitle style={{ color: '#8b795e' }}>Referral Program</CardTitle>
                  <CardDescription style={{ color: '#8b795e' }}>
                    Earn rewards for bringing new restaurants to MIMI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="text-2xl font-bold mb-1" style={{ color: '#8b795e' }}>
                      ${rewardData.referralBonus}
                    </div>
                    <p className="text-sm" style={{ color: '#8b795e' }}>Total Referral Earnings</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#8b795e' }}>Restaurants Referred:</span>
                      <span className="font-medium" style={{ color: '#8b795e' }}>5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#8b795e' }}>Bonus per Referral:</span>
                      <span className="font-medium" style={{ color: '#8b795e' }}>$25.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <Card style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97' }}>
              <CardHeader>
                <CardTitle style={{ color: '#8b795e' }}>Crypto Wallet Integration</CardTitle>
                <CardDescription style={{ color: '#8b795e' }}>
                  Manage your MIMI tokens and cryptocurrency earnings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e5cf97' }}>
                  <div className="flex items-center gap-3">
                    <Wallet className="h-6 w-6" style={{ color: '#8b795e' }} />
                    <div>
                      <p className="font-medium" style={{ color: '#8b795e' }}>Connected Wallet</p>
                      <p className="text-sm" style={{ color: '#8b795e' }}>{walletAddress}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                    <h4 className="font-semibold mb-2" style={{ color: '#8b795e' }}>OrderFi Token Balance</h4>
                    <div className="text-2xl font-bold" style={{ color: '#8b795e' }}>
                      {rewardData.mimiTokens.toLocaleString()} ORDERFI
                    </div>
                    <p className="text-sm" style={{ color: '#8b795e' }}>
                      ≈ ${(rewardData.mimiTokens * 0.15).toFixed(2)} USD
                    </p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                    <h4 className="font-semibold mb-2" style={{ color: '#8b795e' }}>Available for Withdrawal</h4>
                    <div className="text-2xl font-bold" style={{ color: '#8b795e' }}>
                      ${rewardData.monthlyEarnings.toFixed(2)}
                    </div>
                    <p className="text-sm" style={{ color: '#8b795e' }}>
                      Ready to transfer
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-[#8b795e] hover:bg-[#6d5d4f] text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Withdraw Earnings
                  </Button>
                  <Button variant="outline" className="flex-1" style={{ borderColor: '#8b795e', color: '#8b795e' }}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Explorer
                  </Button>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: '#e8f5e8', border: '1px solid #c8e6c8' }}>
                  <h4 className="font-semibold mb-2 text-green-800">Security Notice</h4>
                  <p className="text-sm text-green-700">
                    Your earnings are automatically distributed to your connected wallet address. 
                    All transactions are secured by blockchain technology and can be verified on the public ledger.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}