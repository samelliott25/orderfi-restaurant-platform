import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

  const walletOptions = [
    { id: 'metamask' as WalletType, name: 'MetaMask' },
    { id: 'coinbase' as WalletType, name: 'Coinbase Wallet' },
    { id: 'phantom' as WalletType, name: 'Phantom' },
    { id: 'walletconnect' as WalletType, name: 'WalletConnect' }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[320px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Connect Wallet
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Choose your wallet type
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          {walletOptions.map((wallet) => (
            <Button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              disabled={isConnecting}
              variant="outline"
              className="w-full justify-center text-sm py-3 hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 hover:text-white transition-all"
            >
              {wallet.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}