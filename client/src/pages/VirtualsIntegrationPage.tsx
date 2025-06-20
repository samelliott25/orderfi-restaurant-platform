import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Twitter, MessageCircle, Send, Coins, BarChart3, Users } from 'lucide-react';

interface AgentMetrics {
  agentId: string;
  totalInteractions: number;
  tokenRewardsDistributed: number;
  averageResponseTime: number;
  platformBreakdown: {
    twitter: number;
    discord: number;
    telegram: number;
    web: number;
  };
  successfulOrders: number;
  customerSatisfaction: number;
}

export function VirtualsIntegrationPage() {
  const [metrics, setMetrics] = useState<AgentMetrics | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [testPlatform, setTestPlatform] = useState<'twitter' | 'discord' | 'telegram'>('twitter');
  const [testResponse, setTestResponse] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchMetrics();
    checkConnection();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/virtuals/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const checkConnection = async () => {
    // Simulate connection check
    setIsConnected(true);
  };

  const testPlatformMessage = async () => {
    if (!testMessage.trim()) return;

    try {
      const platformMessage = {
        platform: testPlatform,
        userId: 'test_user_123',
        username: 'test_user',
        content: testMessage,
        messageId: `test_${Date.now()}`,
        channelId: 'test_channel'
      };

      const response = await fetch('/api/virtuals/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: testPlatform,
          message: platformMessage
        })
      });

      const result = await response.json();
      setTestResponse(result.content || 'No response');
    } catch (error) {
      setTestResponse('Error testing message');
      console.error('Test message error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffe6b0] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#8b795e] mb-2">Virtuals.io Integration</h1>
          <p className="text-[#8b795e]/70">Mimi Waitress as a Virtual Agent</p>
        </div>

        {/* Connection Status */}
        <Card className="bg-white border-[#8b795e]">
          <CardHeader>
            <CardTitle className="text-[#8b795e] flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              Agent Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#8b795e]">mimi-waitress-001</div>
                <div className="text-sm text-[#8b795e]/70">Agent ID</div>
              </div>
              <div className="text-center">
                <Badge variant={isConnected ? "default" : "destructive"} className="bg-[#8b795e]">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
                <div className="text-sm text-[#8b795e]/70 mt-1">Virtuals Protocol</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#8b795e]">$VIRTUAL</div>
                <div className="text-sm text-[#8b795e]/70">Token Integration</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="overview" className="text-[#8b795e]">Overview</TabsTrigger>
            <TabsTrigger value="platforms" className="text-[#8b795e]">Platforms</TabsTrigger>
            <TabsTrigger value="tokens" className="text-[#8b795e]">Tokens</TabsTrigger>
            <TabsTrigger value="test" className="text-[#8b795e]">Test</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white border-[#8b795e]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-[#8b795e] flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#8b795e]">
                    {metrics?.totalInteractions || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#8b795e]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-[#8b795e] flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Tokens Distributed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#8b795e]">
                    {metrics?.tokenRewardsDistributed || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#8b795e]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-[#8b795e] flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#8b795e]">
                    {metrics?.customerSatisfaction || 0}%
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-[#8b795e]">
              <CardHeader>
                <CardTitle className="text-[#8b795e]">Platform Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics?.platformBreakdown && Object.entries(metrics.platformBreakdown).map(([platform, count]) => (
                    <div key={platform} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {platform === 'twitter' && <Twitter className="h-4 w-4 text-blue-500" />}
                        {platform === 'discord' && <MessageCircle className="h-4 w-4 text-purple-500" />}
                        {platform === 'telegram' && <Send className="h-4 w-4 text-blue-400" />}
                        <span className="capitalize text-[#8b795e]">{platform}</span>
                      </div>
                      <Badge variant="outline" className="text-[#8b795e] border-[#8b795e]">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white border-[#8b795e]">
                <CardHeader>
                  <CardTitle className="text-[#8b795e] flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-blue-500" />
                    Twitter Integration
                  </CardTitle>
                  <CardDescription>@MimiWaitress responds to mentions and DMs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-[#8b795e]">
                    <div>• Automated replies to mentions</div>
                    <div>• DM ordering system</div>
                    <div>• Menu announcement tweets</div>
                    <div>• Token rewards for engagement</div>
                  </div>
                  <Badge className="mt-3 bg-green-100 text-green-800">Active</Badge>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#8b795e]">
                <CardHeader>
                  <CardTitle className="text-[#8b795e] flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-purple-500" />
                    Discord Integration
                  </CardTitle>
                  <CardDescription>Server bot with slash commands</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-[#8b795e]">
                    <div>• /menu - Browse restaurant menu</div>
                    <div>• /order - Place orders directly</div>
                    <div>• /specials - Daily specials</div>
                    <div>• Rich embeds with menu items</div>
                  </div>
                  <Badge className="mt-3 bg-green-100 text-green-800">Active</Badge>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#8b795e]">
                <CardHeader>
                  <CardTitle className="text-[#8b795e] flex items-center gap-2">
                    <Send className="h-5 w-5 text-blue-400" />
                    Telegram Integration
                  </CardTitle>
                  <CardDescription>Chat bot for personal ordering</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-[#8b795e]">
                    <div>• Personal chat interface</div>
                    <div>• Voice message support</div>
                    <div>• Location-based delivery</div>
                    <div>• Payment integration</div>
                  </div>
                  <Badge className="mt-3 bg-yellow-100 text-yellow-800">Coming Soon</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-4">
            <Card className="bg-white border-[#8b795e]">
              <CardHeader>
                <CardTitle className="text-[#8b795e]">$VIRTUAL Token Rewards</CardTitle>
                <CardDescription>Automated token distribution for user engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-[#8b795e] mb-3">Reward Structure</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#8b795e]">Order Completion</span>
                        <Badge variant="outline" className="text-[#8b795e] border-[#8b795e]">10 tokens</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8b795e]">Review Submission</span>
                        <Badge variant="outline" className="text-[#8b795e] border-[#8b795e]">5 tokens</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8b795e]">Referral Bonus</span>
                        <Badge variant="outline" className="text-[#8b795e] border-[#8b795e]">20 tokens</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8b795e]">Social Engagement</span>
                        <Badge variant="outline" className="text-[#8b795e] border-[#8b795e]">3-8 tokens</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#8b795e] mb-3">Token Utility</h4>
                    <div className="space-y-2 text-sm text-[#8b795e]">
                      <div>• Discount on future orders</div>
                      <div>• Premium menu recommendations</div>
                      <div>• Early access to new items</div>
                      <div>• Governance voting rights</div>
                      <div>• Exclusive chef experiences</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <Card className="bg-white border-[#8b795e]">
              <CardHeader>
                <CardTitle className="text-[#8b795e]">Platform Message Testing</CardTitle>
                <CardDescription>Test how Mimi responds across different platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={testPlatform === 'twitter' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTestPlatform('twitter')}
                    className={testPlatform === 'twitter' ? 'bg-[#8b795e]' : 'text-[#8b795e] border-[#8b795e]'}
                  >
                    <Twitter className="h-4 w-4 mr-1" />
                    Twitter
                  </Button>
                  <Button
                    variant={testPlatform === 'discord' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTestPlatform('discord')}
                    className={testPlatform === 'discord' ? 'bg-[#8b795e]' : 'text-[#8b795e] border-[#8b795e]'}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Discord
                  </Button>
                  <Button
                    variant={testPlatform === 'telegram' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTestPlatform('telegram')}
                    className={testPlatform === 'telegram' ? 'bg-[#8b795e]' : 'text-[#8b795e] border-[#8b795e]'}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Telegram
                  </Button>
                </div>

                <Textarea
                  placeholder={`Type a message to test on ${testPlatform}...`}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="border-[#8b795e] focus:border-[#8b795e] text-[#8b795e]"
                />

                <Button
                  onClick={testPlatformMessage}
                  disabled={!testMessage.trim()}
                  className="bg-[#8b795e] hover:bg-[#6d5d4a]"
                >
                  Test Message
                </Button>

                {testResponse && (
                  <Card className="bg-[#ffe6b0] border-[#8b795e]">
                    <CardHeader>
                      <CardTitle className="text-sm text-[#8b795e]">Mimi's Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-[#8b795e] whitespace-pre-wrap">{testResponse}</div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}