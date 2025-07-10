import React, { useState, useEffect } from 'react';
import { StandardLayout } from '@/components/StandardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  DollarSign,
  CreditCard,
  Bitcoin,
  Settings,
  Search,
  Mic,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Eye,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Send,
  Receipt,
  Key,
  Shield,
  Globe,
  Zap
} from 'lucide-react';
import "@/styles/mobile-fix.css";

interface Payment {
  id: string;
  date: string;
  method: 'stripe' | 'crypto';
  token?: string;
  amount: number;
  status: 'pending' | 'settled' | 'failed' | 'refunded';
  description: string;
  transactionId?: string;
  customerName?: string;
  walletAddress?: string;
  paymentIntentId?: string;
}

interface PaymentSummary {
  totalRevenue: number;
  cryptoRevenue: number;
  stripeRevenue: number;
  pendingPayments: number;
  settledPayments: number;
  failedPayments: number;
  totalTransactions: number;
  averageTransaction: number;
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('summary');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isListening, setIsListening] = useState(false);
  const [showStripeConfig, setShowStripeConfig] = useState(false);
  const [showCryptoConfig, setShowCryptoConfig] = useState(false);
  const [stripeConfig, setStripeConfig] = useState({
    publishableKey: '',
    secretKey: '',
    environment: 'test'
  });
  const [cryptoConfig, setCryptoConfig] = useState({
    enabledTokens: ['USDC'],
    walletAddress: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch payments summary
  const { data: paymentSummary, isLoading: summaryLoading } = useQuery<PaymentSummary>({
    queryKey: ['/api/payments/summary'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch payments history
  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ['/api/payments'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Stripe configuration mutation
  const configureStripeMutation = useMutation({
    mutationFn: (config: any) => apiRequest('/api/payments/configure-stripe', {
      method: 'POST',
      body: config
    }),
    onSuccess: () => {
      toast({
        title: "Stripe Configuration Saved",
        description: "Your Stripe settings have been updated successfully.",
      });
      setShowStripeConfig(false);
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Configuration Error",
        description: error.message || "Failed to save Stripe configuration.",
        variant: "destructive",
      });
    }
  });

  // Crypto configuration mutation
  const configureCryptoMutation = useMutation({
    mutationFn: (config: any) => apiRequest('/api/payments/configure-crypto', {
      method: 'POST',
      body: config
    }),
    onSuccess: () => {
      toast({
        title: "Crypto Configuration Saved",
        description: "Your crypto settings have been updated successfully.",
      });
      setShowCryptoConfig(false);
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Configuration Error",
        description: error.message || "Failed to save crypto configuration.",
        variant: "destructive",
      });
    }
  });

  // Payment action mutations
  const capturePaymentMutation = useMutation({
    mutationFn: (paymentId: string) => apiRequest(`/api/payments/${paymentId}/capture`, {
      method: 'POST'
    }),
    onSuccess: () => {
      toast({
        title: "Payment Captured",
        description: "Payment has been captured successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
    }
  });

  const refundPaymentMutation = useMutation({
    mutationFn: ({ paymentId, amount }: { paymentId: string; amount?: number }) => 
      apiRequest(`/api/payments/${paymentId}/refund`, {
        method: 'POST',
        body: { amount }
      }),
    onSuccess: () => {
      toast({
        title: "Payment Refunded",
        description: "Refund has been processed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
    }
  });

  // Voice input toggle
  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // TODO: Implement voice recognition
  };

  // Filter payments
  const filteredPayments = payments?.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === 'all' || payment.method === filterMethod;
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    
    return matchesSearch && matchesMethod && matchesStatus;
  }) || [];

  // Get status badge props
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'settled':
        return { variant: 'default' as const, icon: CheckCircle, className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
      case 'pending':
        return { variant: 'secondary' as const, icon: Clock, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
      case 'failed':
        return { variant: 'destructive' as const, icon: XCircle, className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
      case 'refunded':
        return { variant: 'outline' as const, icon: AlertCircle, className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
      default:
        return { variant: 'outline' as const, icon: AlertCircle, className: '' };
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Generate mock data if no API data
  const mockSummary: PaymentSummary = {
    totalRevenue: 12345.67,
    cryptoRevenue: 4500.23,
    stripeRevenue: 7845.44,
    pendingPayments: 3,
    settledPayments: 147,
    failedPayments: 2,
    totalTransactions: 152,
    averageTransaction: 81.22
  };

  const mockPayments: Payment[] = [
    {
      id: '1',
      date: '2025-07-09',
      method: 'crypto',
      token: 'USDC',
      amount: 25.00,
      status: 'settled',
      description: 'Order #1234 - Burger Combo',
      transactionId: '0xabc123...',
      customerName: 'John Doe',
      walletAddress: '0x1234...5678'
    },
    {
      id: '2',
      date: '2025-07-08',
      method: 'stripe',
      amount: 75.00,
      status: 'pending',
      description: 'Order #1235 - Large Pizza',
      paymentIntentId: 'pi_1234567890',
      customerName: 'Jane Smith'
    },
    {
      id: '3',
      date: '2025-07-08',
      method: 'crypto',
      token: 'ETH',
      amount: 150.00,
      status: 'failed',
      description: 'Order #1236 - Catering Service',
      transactionId: '0xdef456...',
      customerName: 'Mike Johnson'
    }
  ];

  const currentSummary = paymentSummary || mockSummary;
  const currentPayments = payments || mockPayments;

  return (
    <StandardLayout title="Payments">
      <div data-testid="payments-page" className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-normal tracking-tight rock-salt-font">
              Payment Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage Stripe and crypto payments, view transaction history, and configure payment settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Live</span>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Payment
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            {/* Summary Cards */}
            <div className="flex flex-col space-y-3 mb-6 w-full">
              {/* Total Revenue */}
              <Card className="w-full hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(currentSummary.totalRevenue)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +12.5% from last month
                  </div>
                </CardContent>
              </Card>

              {/* Crypto Revenue */}
              <Card className="w-full hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Crypto Revenue</CardTitle>
                  <Bitcoin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(currentSummary.cryptoRevenue)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +8.2% from last month
                  </div>
                </CardContent>
              </Card>

              {/* Stripe Revenue */}
              <Card className="w-full hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Stripe Revenue</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(currentSummary.stripeRevenue)}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    +15.3% from last month
                  </div>
                </CardContent>
              </Card>

              {/* Settings Quick Access */}
              <Card className="w-full hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => setActiveTab('settings')}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quick Setup</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <Key className="h-3 w-3 mr-2" />
                      Configure Stripe
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <Wallet className="h-3 w-3 mr-2" />
                      Enable Crypto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>
                  Latest payment activity across all channels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentPayments.slice(0, 5).map((payment) => {
                    const statusBadge = getStatusBadge(payment.status);
                    const StatusIcon = statusBadge.icon;
                    
                    return (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${payment.method === 'crypto' ? 'bg-orange-100 dark:bg-orange-900' : 'bg-blue-100 dark:bg-blue-900'}`}>
                            {payment.method === 'crypto' ? 
                              <Bitcoin className="h-4 w-4 text-orange-600 dark:text-orange-400" /> : 
                              <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            }
                          </div>
                          <div>
                            <div className="font-medium">{payment.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {payment.customerName} • {payment.date}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(payment.amount)}</div>
                            <div className="text-sm text-muted-foreground">
                              {payment.method === 'crypto' ? payment.token : 'Card'}
                            </div>
                          </div>
                          <Badge className={statusBadge.className}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  View and manage all payment transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search payments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-12"
                    />
                    <Button
                      size="sm"
                      variant={isListening ? "default" : "ghost"}
                      onClick={toggleVoiceInput}
                      className="absolute right-2 top-1.5"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                  <Select value={filterMethod} onValueChange={setFilterMethod}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="settled">Settled</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                {/* Payments Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment) => {
                        const statusBadge = getStatusBadge(payment.status);
                        const StatusIcon = statusBadge.icon;
                        
                        return (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {payment.method === 'crypto' ? (
                                  <Bitcoin className="h-4 w-4 text-orange-500" />
                                ) : (
                                  <CreditCard className="h-4 w-4 text-blue-500" />
                                )}
                                <span className="capitalize">{payment.method}</span>
                                {payment.token && (
                                  <Badge variant="secondary" className="text-xs">
                                    {payment.token}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{payment.description}</TableCell>
                            <TableCell>{payment.customerName}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell>
                              <Badge className={statusBadge.className}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {payment.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2 justify-end">
                                {payment.status === 'pending' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => capturePaymentMutation.mutate(payment.id)}
                                  >
                                    Capture
                                  </Button>
                                )}
                                {payment.status === 'settled' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => refundPaymentMutation.mutate({ paymentId: payment.id })}
                                  >
                                    Refund
                                  </Button>
                                )}
                                <Button size="sm" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stripe Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Stripe Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your Stripe payment processing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <Select value={stripeConfig.environment} onValueChange={(value) => setStripeConfig(prev => ({ ...prev, environment: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="test">Test Mode</SelectItem>
                        <SelectItem value="live">Live Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Publishable Key</Label>
                    <Input
                      type="password"
                      placeholder="pk_test_..."
                      value={stripeConfig.publishableKey}
                      onChange={(e) => setStripeConfig(prev => ({ ...prev, publishableKey: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Secret Key</Label>
                    <Input
                      type="password"
                      placeholder="sk_test_..."
                      value={stripeConfig.secretKey}
                      onChange={(e) => setStripeConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                    />
                  </div>
                  
                  <Button 
                    onClick={() => configureStripeMutation.mutate(stripeConfig)}
                    disabled={configureStripeMutation.isPending}
                    className="w-full"
                  >
                    {configureStripeMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Shield className="h-4 w-4 mr-2" />
                    )}
                    Save Stripe Configuration
                  </Button>
                </CardContent>
              </Card>

              {/* Crypto Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bitcoin className="h-5 w-5" />
                    Crypto Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure accepted cryptocurrencies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Wallet Address</Label>
                    <Input
                      placeholder="0x..."
                      value={cryptoConfig.walletAddress}
                      onChange={(e) => setCryptoConfig(prev => ({ ...prev, walletAddress: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Accepted Tokens</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['USDC', 'ETH', 'MIMI'].map((token) => (
                        <Button
                          key={token}
                          variant={cryptoConfig.enabledTokens.includes(token) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setCryptoConfig(prev => ({
                              ...prev,
                              enabledTokens: prev.enabledTokens.includes(token)
                                ? prev.enabledTokens.filter(t => t !== token)
                                : [...prev.enabledTokens, token]
                            }));
                          }}
                        >
                          {token}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => configureCryptoMutation.mutate(cryptoConfig)}
                    disabled={configureCryptoMutation.isPending}
                    className="w-full"
                  >
                    {configureCryptoMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Wallet className="h-4 w-4 mr-2" />
                    )}
                    Save Crypto Configuration
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Payment Processing Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Payment Processing Settings
                </CardTitle>
                <CardDescription>
                  General payment configuration options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Auto-capture payments</Label>
                    <Select defaultValue="enabled">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Refund processing</Label>
                    <Select defaultValue="manual">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual approval</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Webhook endpoints</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Stripe webhooks</div>
                        <div className="text-sm text-muted-foreground">https://yourapp.com/webhooks/stripe</div>
                      </div>
                      <Badge variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Crypto webhooks</div>
                        <div className="text-sm text-muted-foreground">https://yourapp.com/webhooks/crypto</div>
                      </div>
                      <Badge variant="outline">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StandardLayout>
  );
}