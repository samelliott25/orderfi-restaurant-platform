import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, ExternalLink, AlertCircle, CheckCircle, Shield, Zap, Gift, Star } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

interface WalletConnectDialogProps {
  children: React.ReactNode;
}

type WalletType = 'metamask' | 'coinbase' | 'phantom' | 'walletconnect';

export function WalletConnectDialog({ children }: WalletConnectDialogProps) {
  const [open, setOpen] = useState(false);
  const { connect, isConnecting } = useWallet();

  const handleConnect = async (walletType: WalletType) => {
    try {
      await connect();
      setOpen(false);
    } catch (error) {
      // Error is handled in the useWallet hook
    }
  };

  const installWallet = (walletType: WalletType) => {
    const urls = {
      metamask: 'https://metamask.io/download/',
      coinbase: 'https://www.coinbase.com/wallet',
      phantom: 'https://phantom.app/',
      walletconnect: 'https://walletconnect.com/'
    };
    window.open(urls[walletType], '_blank');
  };

  const walletOptions = [
    {
      id: 'metamask' as WalletType,
      name: 'MetaMask',
      description: 'Most popular Ethereum wallet',
      installed: typeof window !== 'undefined' && typeof window.ethereum?.isMetaMask !== 'undefined',
      icon: '🦊',
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 'coinbase' as WalletType,
      name: 'Coinbase Wallet',
      description: 'Built by Coinbase exchange',
      installed: typeof window !== 'undefined' && typeof window.ethereum?.isCoinbaseWallet !== 'undefined',
      icon: '🔵',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'phantom' as WalletType,
      name: 'Phantom',
      description: 'Solana & Ethereum wallet',
      installed: typeof window !== 'undefined' && typeof window.solana?.isPhantom !== 'undefined',
      icon: '👻',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'walletconnect' as WalletType,
      name: 'WalletConnect',
      description: 'Connect any mobile wallet',
      installed: true, // WalletConnect doesn't require installation
      icon: '🔗',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    }
  ];

  const hasAnyWallet = walletOptions.some(wallet => wallet.installed);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-0 border-0 p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-3xl overflow-hidden">
        
        {/* Header Section with Kleurvörm Gradient */}
        <div className="relative kleurvorm-primary p-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 playwrite-font">Connect Your Wallet</h2>
            <p className="text-white/90 text-sm max-w-md mx-auto">
              Unlock Web3 rewards and secure crypto payments for your OrderFi experience
            </p>
          </div>
        </div>

        <div className="bg-white p-8 space-y-6">
          {!hasAnyWallet ? (
            <div className="text-center space-y-6">
              <div className="kleurvorm-card p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Wallet Required</h3>
                <p className="text-sm text-gray-600 mb-6">
                  You need a Web3 wallet to access OrderFi's blockchain features and earn token rewards.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {walletOptions.slice(0, 4).map((wallet) => (
                    <Button 
                      key={wallet.id}
                      onClick={() => installWallet(wallet.id)} 
                      variant="outline" 
                      className={`h-auto p-4 flex flex-col gap-2 ${wallet.bgColor} ${wallet.borderColor} hover:scale-105 transition-all duration-200`}
                    >
                      <div className="text-2xl">{wallet.icon}</div>
                      <div className="text-xs font-medium text-gray-900">{wallet.name}</div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Benefits Section */}
              <div className="kleurvorm-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-600" />
                  What you'll unlock:
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Token Rewards</div>
                      <div className="text-xs text-gray-600">Earn ORDERFI tokens with every order</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Secure Payments</div>
                      <div className="text-xs text-gray-600">Blockchain-powered transactions</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Exclusive Features</div>
                      <div className="text-xs text-gray-600">Access Web3-only perks</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">Loyalty Program</div>
                      <div className="text-xs text-gray-600">Decentralized rewards system</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Options */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose your wallet:</h3>
                {walletOptions.map((wallet) => (
                  <Button
                    key={wallet.id}
                    onClick={() => wallet.installed ? handleConnect(wallet.id) : installWallet(wallet.id)}
                    disabled={isConnecting}
                    variant="outline"
                    className={`w-full justify-start gap-4 h-auto p-4 ${wallet.bgColor} ${wallet.borderColor} hover:scale-[1.02] transition-all duration-200 ${
                      wallet.installed ? 'ring-2 ring-offset-2 ring-green-500' : ''
                    }`}
                  >
                    <div className="text-2xl">{wallet.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {wallet.name}
                        {wallet.installed && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </div>
                      <div className="text-xs text-gray-600">
                        {wallet.installed ? wallet.description : 'Click to install'}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      wallet.installed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {wallet.installed ? 'Ready' : 'Install'}
                    </div>
                    {!wallet.installed && <ExternalLink className="h-4 w-4 text-gray-400" />}
                  </Button>
                ))}
              </div>

              {/* Security Notice */}
              <div className="kleurvorm-card p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900 text-sm">Secure & Private</div>
                    <div className="text-xs text-blue-800">
                      Your wallet data stays private. OrderFi only requests transaction permissions when needed.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}