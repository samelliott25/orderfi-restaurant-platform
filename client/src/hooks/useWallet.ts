import { useState, useEffect } from 'react';
import { walletManager, WalletInfo } from '@/lib/wallet';
import { useToast } from '@/hooks/use-toast';

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if wallet was previously connected
    setIsConnected(walletManager.isWalletConnected());

    // Listen for account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          // Account changed, update wallet info
          setIsConnected(true);
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    try {
      const info = await walletManager.connectWallet();
      setWalletInfo(info);
      setIsConnected(true);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${info?.address.slice(0, 6)}...${info?.address.slice(-4)}`,
      });
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await walletManager.disconnectWallet();
      setWalletInfo(null);
      setIsConnected(false);
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error: any) {
      console.error('Wallet disconnection error:', error);
      toast({
        title: "Disconnection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const switchNetwork = async (chainId: number) => {
    try {
      await walletManager.switchToNetwork(chainId);
      toast({
        title: "Network Switched",
        description: "Successfully switched network",
      });
    } catch (error: any) {
      toast({
        title: "Network Switch Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    isConnected,
    walletInfo,
    isConnecting,
    connect,
    disconnect,
    switchNetwork,
  };
}