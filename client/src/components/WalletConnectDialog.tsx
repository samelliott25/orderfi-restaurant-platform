import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, ExternalLink, AlertCircle } from 'lucide-react';
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
      icon: '🦊'
    },
    {
      id: 'coinbase' as WalletType,
      name: 'Coinbase Wallet',
      description: 'Built by Coinbase exchange',
      installed: typeof window !== 'undefined' && typeof window.ethereum?.isCoinbaseWallet !== 'undefined',
      icon: '🔵'
    },
    {
      id: 'phantom' as WalletType,
      name: 'Phantom',
      description: 'Solana & Ethereum wallet',
      installed: typeof window !== 'undefined' && typeof window.solana?.isPhantom !== 'undefined',
      icon: '👻'
    },
    {
      id: 'walletconnect' as WalletType,
      name: 'WalletConnect',
      description: 'Connect any mobile wallet',
      installed: true, // WalletConnect doesn't require installation
      icon: '🔗'
    }
  ];

  const hasAnyWallet = walletOptions.some(wallet => wallet.installed);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-md bg-[#fcfcfc]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>
            Choose a crypto wallet to connect and make secure payments.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!hasAnyWallet ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Wallet Required</h3>
                <p className="text-sm text-gray-600 mt-1">
                  You need a Web3 wallet to connect and use OrderFi Ai's blockchain features.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {walletOptions.slice(0, 4).map((wallet) => (
                  <Button 
                    key={wallet.id}
                    onClick={() => installWallet(wallet.id)} 
                    variant="outline" 
                    className="h-auto p-3 flex flex-col gap-1"
                  >
                    <div className="text-lg">{wallet.icon}</div>
                    <div className="text-xs font-medium">{wallet.name}</div>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-medium text-gray-900">Connect Your Wallet</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Choose your preferred wallet to access OrderFi Ai's blockchain features and token rewards.
                </p>
              </div>

              <div className="border border-orange-200 rounded-lg p-4 bg-[#fcfcfc]">
                <h4 className="font-medium text-orange-900 mb-2">What you'll get:</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Earn token rewards for orders</li>
                  <li>• Access exclusive Web3 features</li>
                  <li>• Secure blockchain transactions</li>
                  <li>• Decentralized loyalty program</li>
                </ul>
              </div>

              <div className="space-y-2">
                {walletOptions.map((wallet) => (
                  <Button
                    key={wallet.id}
                    onClick={() => wallet.installed ? handleConnect(wallet.id) : installWallet(wallet.id)}
                    disabled={isConnecting}
                    variant={wallet.installed ? "default" : "outline"}
                    className={`w-full justify-start gap-3 h-auto p-4 ${
                      wallet.installed 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xl">{wallet.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{wallet.name}</div>
                      <div className={`text-xs ${wallet.installed ? 'text-white/80' : 'text-gray-500'}`}>
                        {wallet.installed ? wallet.description : 'Click to install'}
                      </div>
                    </div>
                    {!wallet.installed && <ExternalLink className="h-4 w-4" />}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}