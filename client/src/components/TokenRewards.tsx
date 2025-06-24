import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, Gift, Star, TrendingUp, Wallet, Award } from 'lucide-react';

interface TokenBalance {
  customerId: string;
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
  tier: string;
}

interface RewardTier {
  name: string;
  minTokens: number;
  multiplier: number;
  perks: string[];
  color: string;
}

interface TokenRewardsProps {
  customerId?: string;
  customerEmail?: string;
}

export function TokenRewards({ customerId, customerEmail }: TokenRewardsProps) {
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const rewardTiers: RewardTier[] = [
    {
      name: 'Bronze',
      minTokens: 0,
      multiplier: 1.0,
      perks: ['Standard earning rate', 'Basic rewards'],
      color: 'text-amber-600 bg-amber-50'
    },
    {
      name: 'Silver',
      minTokens: 500,
      multiplier: 1.2,
      perks: ['20% bonus tokens', 'Priority support', 'Special offers'],
      color: 'text-gray-600 bg-gray-50'
    },
    {
      name: 'Gold',
      minTokens: 1500,
      multiplier: 1.5,
      perks: ['50% bonus tokens', 'Free delivery', 'Exclusive menu items'],
      color: 'text-yellow-600 bg-yellow-50'
    },
    {
      name: 'Platinum',
      minTokens: 5000,
      multiplier: 2.0,
      perks: ['Double tokens', 'VIP reservations', 'Chef specials', 'Birthday rewards'],
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  const availableRewards = [
    {
      id: 'free_appetizer',
      name: 'Free Appetizer',
      description: 'Any appetizer up to $15 value',
      cost: 250,
      category: 'food'
    },
    {
      id: 'free_dessert',
      name: 'Free Dessert',
      description: 'Any dessert from our menu',
      cost: 150,
      category: 'food'
    },
    {
      id: 'discount_10',
      name: '10% Off Order',
      description: 'Discount on your next order',
      cost: 200,
      category: 'discount'
    },
    {
      id: 'free_delivery',
      name: 'Free Delivery',
      description: 'Free delivery on orders over $25',
      cost: 100,
      category: 'service'
    },
    {
      id: 'vip_table',
      name: 'VIP Table Reservation',
      description: 'Priority seating during peak hours',
      cost: 500,
      category: 'experience'
    }
  ];

  // Fetch token balance
  const { data: tokenBalance, isLoading } = useQuery({
    queryKey: [`/api/rewards/balance/${customerId}`],
    enabled: !!customerId,
  });

  const getCurrentTier = (balance: number): RewardTier => {
    return rewardTiers
      .slice()
      .reverse()
      .find(tier => balance >= tier.minTokens) || rewardTiers[0];
  };

  const getNextTier = (balance: number): RewardTier | null => {
    return rewardTiers.find(tier => balance < tier.minTokens) || null;
  };

  const calculateProgressToNextTier = (balance: number): number => {
    const nextTier = getNextTier(balance);
    if (!nextTier) return 100;
    
    const currentTier = getCurrentTier(balance);
    const progress = (balance - currentTier.minTokens) / (nextTier.minTokens - currentTier.minTokens);
    return Math.min(progress * 100, 100);
  };

  const handleRedeemReward = async (rewardId: string, cost: number) => {
    if (!customerId || !tokenBalance || tokenBalance.balance < cost) {
      return;
    }

    try {
      const response = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          rewardId,
          cost
        })
      });

      if (response.ok) {
        // Refresh balance
        window.location.reload();
      }
    } catch (error) {
      console.error('Reward redemption error:', error);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading rewards...</p>
        </CardContent>
      </Card>
    );
  }

  if (!tokenBalance) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Coins className="h-6 w-6 text-orange-500" />
            <span>MIMI Rewards</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Start earning MIMI tokens with your first order!
          </p>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800">How it works:</h4>
            <ul className="text-sm text-orange-700 mt-2 space-y-1">
              <li>• Earn 2 tokens per $1 spent</li>
              <li>• Bonus tokens for crypto payments</li>
              <li>• Redeem for food, discounts & perks</li>
              <li>• Level up for better rewards</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentTier = getCurrentTier(tokenBalance.balance);
  const nextTier = getNextTier(tokenBalance.balance);
  const progressToNext = calculateProgressToNextTier(tokenBalance.balance);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Token Balance Card */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Coins className="h-6 w-6 text-orange-500" />
            <span>MIMI Rewards</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {tokenBalance.balance.toLocaleString()}
            </div>
            <p className="text-gray-600">MIMI Tokens</p>
          </div>

          {/* Current Tier */}
          <div className="text-center">
            <Badge className={currentTier.color}>
              <Award className="h-4 w-4 mr-1" />
              {currentTier.name} Member
            </Badge>
            <p className="text-sm text-gray-600 mt-1">
              {currentTier.multiplier}x earning rate
            </p>
          </div>

          {/* Progress to Next Tier */}
          {nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextTier.name}</span>
                <span>{nextTier.minTokens - tokenBalance.balance} tokens needed</span>
              </div>
              <Progress value={progressToNext} className="w-full" />
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xl font-semibold text-green-600">
                {tokenBalance.totalEarned.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Total Earned</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-blue-600">
                {tokenBalance.totalRedeemed.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Total Redeemed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5" />
            <span>Available Rewards</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRewards.map((reward) => {
              const canAfford = tokenBalance.balance >= reward.cost;
              
              return (
                <div
                  key={reward.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    canAfford ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{reward.name}</h4>
                      <Badge variant="outline" className="text-orange-600">
                        {reward.cost} tokens
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                    <Button
                      size="sm"
                      onClick={() => handleRedeemReward(reward.id, reward.cost)}
                      disabled={!canAfford}
                      className={`w-full ${
                        canAfford 
                          ? 'bg-orange-500 hover:bg-orange-600' 
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Redeem' : 'Insufficient Tokens'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tier Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Membership Tiers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rewardTiers.map((tier) => (
              <div
                key={tier.name}
                className={`border rounded-lg p-4 ${
                  tier.name === currentTier.name ? 'border-orange-500 bg-orange-50' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <Badge className={tier.color}>
                    {tier.name} ({tier.minTokens.toLocaleString()}+ tokens)
                  </Badge>
                  <span className="text-sm font-medium">
                    {tier.multiplier}x earning rate
                  </span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {tier.perks.map((perk, index) => (
                    <li key={index}>• {perk}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}