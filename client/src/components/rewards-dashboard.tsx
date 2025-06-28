import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Trophy, Star, Gift, Wallet } from "lucide-react";

interface RewardData {
  orderValue: number;
  pointsEarned: number;
  tokenMultiplier: number;
  tierBonus: number;
  totalReward: number;
}

interface LoyaltyTier {
  name: 'bronze' | 'silver' | 'gold' | 'platinum';
  minOrders: number;
  pointsMultiplier: number;
  tokenBonus: number;
}

interface RewardsDashboardProps {
  customerId: string;
  customerOrderCount?: number;
}

export function RewardsDashboard({ customerId, customerOrderCount = 0 }: RewardsDashboardProps) {
  const [pendingRewards, setPendingRewards] = useState<RewardData[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const loyaltyTiers: LoyaltyTier[] = [
    { name: 'bronze', minOrders: 0, pointsMultiplier: 1.0, tokenBonus: 0 },
    { name: 'silver', minOrders: 5, pointsMultiplier: 1.2, tokenBonus: 10 },
    { name: 'gold', minOrders: 15, pointsMultiplier: 1.5, tokenBonus: 25 },
    { name: 'platinum', minOrders: 50, pointsMultiplier: 2.0, tokenBonus: 50 }
  ];

  const getCurrentTier = () => {
    return loyaltyTiers
      .reverse()
      .find(tier => customerOrderCount >= tier.minOrders) || loyaltyTiers[0];
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const currentIndex = loyaltyTiers.findIndex(tier => tier.name === currentTier.name);
    return currentIndex < loyaltyTiers.length - 1 ? loyaltyTiers[currentIndex + 1] : null;
  };

  const getTierColor = (tierName: string) => {
    switch (tierName) {
      case 'bronze': return 'text-amber-600 bg-amber-50';
      case 'silver': return 'text-gray-600 bg-gray-50';
      case 'gold': return 'text-yellow-600 bg-yellow-50';
      case 'platinum': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTierIcon = (tierName: string) => {
    switch (tierName) {
      case 'bronze': return <Coins className="w-4 h-4" />;
      case 'silver': return <Star className="w-4 h-4" />;
      case 'gold': return <Trophy className="w-4 h-4" />;
      case 'platinum': return <Gift className="w-4 h-4" />;
      default: return <Coins className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [customerId]);

  const fetchRewards = async () => {
    try {
      const response = await fetch(`/api/rewards/${customerId}`);
      if (response.ok) {
        const data = await response.json();
        setPendingRewards(data.pendingRewards || []);
        setAnalytics(data.analytics || {});
      }
    } catch (error) {
      console.error('Failed to fetch rewards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const claimRewards = async () => {
    if (pendingRewards.length === 0) return;

    setIsClaiming(true);
    setClaimStatus('idle');

    try {
      const orderIds = pendingRewards.map((_, index) => index + 1); // Simplified for demo
      const response = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, orderIds })
      });

      if (response.ok) {
        setClaimStatus('success');
        setPendingRewards([]);
        setTimeout(() => setClaimStatus('idle'), 3000);
      } else {
        throw new Error('Claim failed');
      }
    } catch (error) {
      setClaimStatus('error');
      setTimeout(() => setClaimStatus('idle'), 3000);
    } finally {
      setIsClaiming(false);
    }
  };

  const totalPendingPoints = pendingRewards.reduce((sum, reward) => sum + reward.totalReward, 0);
  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progressToNextTier = nextTier ? 
    ((customerOrderCount - currentTier.minOrders) / (nextTier.minOrders - currentTier.minOrders)) * 100 : 100;

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      {/* Loyalty Tier Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {getTierIcon(currentTier.name)}
            Loyalty Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={getTierColor(currentTier.name)}>
              {currentTier.name.toUpperCase()}
            </Badge>
            <span className="text-sm text-gray-600">
              {customerOrderCount} orders
            </span>
          </div>
          
          {nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {nextTier.name}</span>
                <span>{customerOrderCount}/{nextTier.minOrders}</span>
              </div>
              <Progress value={Math.min(progressToNextTier, 100)} className="h-2" />
              <p className="text-xs text-gray-500">
                {nextTier.minOrders - customerOrderCount} more orders to unlock {nextTier.name} tier
              </p>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p>Current multiplier: {currentTier.pointsMultiplier}x</p>
            <p>Tier bonus: +{currentTier.tokenBonus} tokens</p>
          </div>
        </CardContent>
      </Card>

      {/* Pending Rewards */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Coins className="w-5 h-5" />
            Pending Rewards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {totalPendingPoints > 0 ? (
            <>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {totalPendingPoints}
                </div>
                <p className="text-sm text-gray-600">MIMI Tokens Ready</p>
              </div>

              <div className="space-y-2">
                {pendingRewards.map((reward, index) => (
                  <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                    <span>Order ${reward.orderValue}</span>
                    <span className="font-medium">+{reward.totalReward} tokens</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={claimRewards}
                disabled={isClaiming}
                className="w-full"
                size="lg"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isClaiming ? 'Claiming...' : `Claim ${totalPendingPoints} Tokens`}
              </Button>

              {claimStatus === 'success' && (
                <div className="text-center text-green-600 text-sm">
                  ✓ Tokens claimed successfully!
                </div>
              )}

              {claimStatus === 'error' && (
                <div className="text-center text-red-600 text-sm">
                  ✗ Failed to claim tokens. Please try again.
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Coins className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No pending rewards</p>
              <p className="text-sm text-gray-400 mt-1">
                Complete orders to earn MIMI tokens
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How Rewards Work */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span className="font-medium text-orange-600">1.</span>
            <span>Earn 10 points per $1 spent</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-orange-600">2.</span>
            <span>Points multiply based on your tier</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-orange-600">3.</span>
            <span>Claim tokens to your wallet</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-orange-600">4.</span>
            <span>Use tokens for discounts & rewards</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}