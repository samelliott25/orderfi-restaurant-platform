import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, ExternalLink, AlertCircle } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

interface WalletConnectDialogProps {
  children: React.ReactNode;
}

export function WalletConnectDialog({ children }: WalletConnectDialogProps) {
  const [open, setOpen] = useState(false);
  const { connect, isConnecting } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
      setOpen(false);
    } catch (error) {
      // Error is handled in the useWallet hook
    }
  };

  const installMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  const isMetaMaskInstalled = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!isMetaMaskInstalled ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">MetaMask Required</h3>
                <p className="text-sm text-gray-600 mt-1">
                  You need MetaMask to connect your wallet and use OrderFi Ai's Web3 features.
                </p>
              </div>
              <Button onClick={installMetaMask} className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                Install MetaMask
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Wallet className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-medium text-gray-900">Connect MetaMask</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Connect your MetaMask wallet to access OrderFi Ai's blockchain features and token rewards.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">What you'll get:</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Earn token rewards for orders</li>
                  <li>• Access exclusive Web3 features</li>
                  <li>• Secure blockchain transactions</li>
                  <li>• Decentralized loyalty program</li>
                </ul>
              </div>

              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}