import { useState, useEffect } from 'react';

export interface WalletState {
  connected: boolean;
  address: string;
  balance: string;
  chainId: number;
  network: string;
  isConnecting: boolean;
}

export interface UseWalletReturn {
  wallet: WalletState;
  connectWallet: (type: string) => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

// Supported networks
const NETWORKS = {
  8453: { name: 'Base', rpc: 'https://mainnet.base.org', symbol: 'ETH' },
  137: { name: 'Polygon', rpc: 'https://polygon-rpc.com', symbol: 'MATIC' },
  1: { name: 'Ethereum', rpc: 'https://mainnet.infura.io', symbol: 'ETH' }
};

export function useWallet(): UseWalletReturn {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: '',
    balance: '0.00',
    chainId: 8453,
    network: 'Base',
    isConnecting: false
  });

  // Check for existing connection on mount
  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          const balance = await getUSDCBalance(accounts[0], parseInt(chainId, 16));
          
          setWallet({
            connected: true,
            address: accounts[0],
            balance: balance.toFixed(2),
            chainId: parseInt(chainId, 16),
            network: NETWORKS[parseInt(chainId, 16) as keyof typeof NETWORKS]?.name || 'Unknown',
            isConnecting: false
          });
        }
      } catch (error) {
        console.error('Failed to check existing connection:', error);
      }
    }
  };

  const connectWallet = async (type: string) => {
    setWallet(prev => ({ ...prev, isConnecting: true }));

    try {
      if (type === 'metamask' && window.ethereum) {
        await connectMetaMask();
      } else if (type === 'coinbase') {
        await connectCoinbase();
      } else if (type === 'walletconnect') {
        await connectWalletConnect();
      } else {
        // Fallback to mock connection for demo
        await mockWalletConnection(type);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setWallet(prev => ({ ...prev, isConnecting: false }));
      throw error;
    }
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const numericChainId = parseInt(chainId, 16);

      // Switch to Base network if not already
      if (numericChainId !== 8453) {
        await switchNetwork(8453);
        return;
      }

      const balance = await getUSDCBalance(accounts[0], numericChainId);

      setWallet({
        connected: true,
        address: accounts[0],
        balance: balance.toFixed(2),
        chainId: numericChainId,
        network: NETWORKS[numericChainId as keyof typeof NETWORKS]?.name || 'Unknown',
        isConnecting: false
      });

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

    } catch (error) {
      throw new Error('User rejected connection');
    }
  };

  const connectCoinbase = async () => {
    // Mock Coinbase Wallet connection
    await mockWalletConnection('coinbase');
  };

  const connectWalletConnect = async () => {
    // Mock WalletConnect connection
    await mockWalletConnection('walletconnect');
  };

  const mockWalletConnection = async (type: string) => {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockAddresses = {
      metamask: '0x742d35Cc7364C4532Fdd5E8E11c7a6B9FE57bE20',
      coinbase: '0x8ba1f109551bD432803012645Hac136c84c7a9FA',
      walletconnect: '0x1234567890123456789012345678901234567890'
    };

    const mockBalances = {
      metamask: 127.45,
      coinbase: 89.32,
      walletconnect: 256.78
    };

    setWallet({
      connected: true,
      address: mockAddresses[type as keyof typeof mockAddresses] || mockAddresses.metamask,
      balance: (mockBalances[type as keyof typeof mockBalances] || 100).toFixed(2),
      chainId: 8453,
      network: 'Base',
      isConnecting: false
    });
  };

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) return;

    const chainIdHex = `0x${targetChainId.toString(16)}`;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        const networkConfig = NETWORKS[targetChainId as keyof typeof NETWORKS];
        if (networkConfig) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: networkConfig.name,
              rpcUrls: [networkConfig.rpc],
              nativeCurrency: {
                name: networkConfig.symbol,
                symbol: networkConfig.symbol,
                decimals: 18,
              },
            }],
          });
        }
      }
    }
  };

  const getUSDCBalance = async (address: string, chainId: number): Promise<number> => {
    try {
      // In production, this would fetch actual USDC balance from the blockchain
      // For demo, return mock balance based on address
      const mockBalances: { [key: string]: number } = {
        '0x742d35Cc7364C4532Fdd5E8E11c7a6B9FE57bE20': 127.45,
        '0x8ba1f109551bD432803012645Hac136c84c7a9FA': 89.32,
        '0x1234567890123456789012345678901234567890': 256.78
      };
      
      return mockBalances[address] || 100.00;
    } catch (error) {
      console.error('Failed to fetch USDC balance:', error);
      return 0;
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setWallet(prev => ({ ...prev, address: accounts[0] }));
      // Refresh balance
      getUSDCBalance(accounts[0], wallet.chainId).then(balance => {
        setWallet(prev => ({ ...prev, balance: balance.toFixed(2) }));
      });
    }
  };

  const handleChainChanged = (chainId: string) => {
    const numericChainId = parseInt(chainId, 16);
    const networkName = NETWORKS[numericChainId as keyof typeof NETWORKS]?.name || 'Unknown';
    
    setWallet(prev => ({
      ...prev,
      chainId: numericChainId,
      network: networkName
    }));

    // Refresh balance for new network
    if (wallet.address) {
      getUSDCBalance(wallet.address, numericChainId).then(balance => {
        setWallet(prev => ({ ...prev, balance: balance.toFixed(2) }));
      });
    }
  };

  const disconnectWallet = () => {
    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }

    setWallet({
      connected: false,
      address: '',
      balance: '0.00',
      chainId: 8453,
      network: 'Base',
      isConnecting: false
    });
  };

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    switchNetwork
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}