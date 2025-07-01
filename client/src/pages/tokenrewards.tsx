import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, Gift, Trophy, Star, TrendingUp, History, Wallet } from "lucide-react";
import { StandardLayout } from "@/components/StandardLayout";

interface RewardTier {
  name: string;
  minPoints: number;
  multiplier: number;
  color: string;
  benefits: string[];
}

const rewardTiers: RewardTier[] = [
  {
    name: "Bronze",
    minPoints: 0,
    multiplier: 1,
    color: "bg-amber-600",
    benefits: ["1x points on orders", "Basic customer support"]
  },
  {
    name: "Silver", 
    minPoints: 500,
    multiplier: 1.25,
    color: "bg-gray-400",
    benefits: ["1.25x points on orders", "Priority support", "Monthly bonus points"]
  },
  {
    name: "Gold",
    minPoints: 1500,
    multiplier: 1.5,
    color: "bg-yellow-500",
    benefits: ["1.5x points on orders", "VIP support", "Exclusive menu items", "Birthday rewards"]
  },
  {
    name: "Platinum",
    minPoints: 5000,
    multiplier: 2,
    color: "bg-purple-600",
    benefits: ["2x points on orders", "Concierge support", "Free delivery", "Special events access"]
  }
];

const recentRewards = [
  { date: "2025-06-26", action: "Order #1234", points: 125, type: "earned" },
  { date: "2025-06-25", action: "Welcome Bonus", points: 500, type: "bonus" },
  { date: "2025-06-24", action: "Redeemed: Free Appetizer", points: -200, type: "redeemed" },
  { date: "2025-06-23", action: "Order #1233", points: 89, type: "earned" },
];

export default function TokenRewards() {
  const [currentPoints] = useState(1247);
  const [currentTier, setCurrentTier] = useState("Silver");
  
  const getCurrentTier = () => {
    return rewardTiers.find(tier => 
      currentPoints >= tier.minPoints && 
      (rewardTiers.indexOf(tier) === rewardTiers.length - 1 || 
       currentPoints < rewardTiers[rewardTiers.indexOf(tier) + 1].minPoints)
    ) || rewardTiers[0];
  };

  const getNextTier = () => {
    const current = getCurrentTier();
    const currentIndex = rewardTiers.indexOf(current);
    return currentIndex < rewardTiers.length - 1 ? rewardTiers[currentIndex + 1] : null;
  };

  const tier = getCurrentTier();
  const nextTier = getNextTier();
  const progressToNext = nextTier ? 
    ((currentPoints - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) * 100 : 100;

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: '"Playwrite AU VIC", cursive' }}>
            Token Rewards
          </h1>
          <p className="text-gray-600">Earn tokens with every order and unlock exclusive benefits</p>
        </div>

        {/* Current Status Card */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="h-8 w-8 text-orange-600" />
              <CardTitle className="text-2xl text-orange-900">{currentPoints.toLocaleString()} Points</CardTitle>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge className={`${tier.color} text-white`}>
                {tier.name} Member
              </Badge>
              <span className="text-sm text-orange-700">{tier.multiplier}x multiplier</span>
            </div>
          </CardHeader>
          <CardContent>
            {nextTier && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-orange-700">
                  <span>Progress to {nextTier.name}</span>
                  <span>{nextTier.minPoints - currentPoints} points to go</span>
                </div>
                <Progress value={progressToNext} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="earn" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="earn">Earn</TabsTrigger>
            <TabsTrigger value="redeem">Redeem</TabsTrigger>
            <TabsTrigger value="tiers">Tiers</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Earn Points Tab */}
          <TabsContent value="earn" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Ways to Earn Points
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Coins className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Place Orders</h3>
                    <p className="text-sm text-gray-600">Earn 10 points per $1 spent</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Gift className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Daily Check-in</h3>
                    <p className="text-sm text-gray-600">Get 25 bonus points daily</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Leave Reviews</h3>
                    <p className="text-sm text-gray-600">Earn 50 points per review</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Trophy className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Referrals</h3>
                    <p className="text-sm text-gray-600">Get 200 points per friend</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Redeem Points Tab */}
          <TabsContent value="redeem" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Available Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Free Appetizer</h3>
                      <p className="text-sm text-gray-600">Any appetizer under $12</p>
                    </div>
                    <Badge variant="outline">200 pts</Badge>
                  </div>
                  <Button className="w-full" disabled={currentPoints < 200}>
                    {currentPoints >= 200 ? 'Redeem' : 'Need 200 points'}
                  </Button>
                </div>
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">$5 Off Order</h3>
                      <p className="text-sm text-gray-600">Valid on orders over $25</p>
                    </div>
                    <Badge variant="outline">500 pts</Badge>
                  </div>
                  <Button className="w-full" disabled={currentPoints < 500}>
                    {currentPoints >= 500 ? 'Redeem' : 'Need 500 points'}
                  </Button>
                </div>
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Free Delivery</h3>
                      <p className="text-sm text-gray-600">Free delivery on next order</p>
                    </div>
                    <Badge variant="outline">300 pts</Badge>
                  </div>
                  <Button className="w-full" disabled={currentPoints < 300}>
                    {currentPoints >= 300 ? 'Redeem' : 'Need 300 points'}
                  </Button>
                </div>
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Free Dessert</h3>
                      <p className="text-sm text-gray-600">Any dessert under $8</p>
                    </div>
                    <Badge variant="outline">400 pts</Badge>
                  </div>
                  <Button className="w-full" disabled={currentPoints < 400}>
                    {currentPoints >= 400 ? 'Redeem' : 'Need 400 points'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reward Tiers Tab */}
          <TabsContent value="tiers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Membership Tiers
                </CardTitle>
                <CardDescription>
                  Higher tiers unlock better rewards and multipliers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {rewardTiers.map((tierInfo, index) => (
                  <div 
                    key={tierInfo.name}
                    className={`p-4 rounded-lg border-2 ${
                      tierInfo.name === tier.name 
                        ? 'border-orange-300 bg-orange-50' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={`${tierInfo.color} text-white`}>
                          {tierInfo.name}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {tierInfo.minPoints.toLocaleString()}+ points
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          {tierInfo.multiplier}x multiplier
                        </span>
                      </div>
                      {tierInfo.name === tier.name && (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      {tierInfo.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Points History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentRewards.map((reward, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          reward.type === 'earned' ? 'bg-green-100' :
                          reward.type === 'bonus' ? 'bg-blue-100' : 'bg-red-100'
                        }`}>
                          {reward.type === 'earned' ? (
                            <Coins className="h-4 w-4 text-green-600" />
                          ) : reward.type === 'bonus' ? (
                            <Gift className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Wallet className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{reward.action}</p>
                          <p className="text-sm text-gray-500">{reward.date}</p>
                        </div>
                      </div>
                      <div className={`font-semibold ${
                        reward.points > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {reward.points > 0 ? '+' : ''}{reward.points}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}