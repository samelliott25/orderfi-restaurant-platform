// Simple wallet connection without ethers for now
// import { ethers } from 'ethers';

export interface WalletInfo {
  address: string;
  balance: string;
  network: string;
  chainId: number;
}

export class WalletManager {
  async connectWallet(): Promise<WalletInfo | null> {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      
      // Get chain ID
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Get balance (simplified)
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });

      const walletInfo: WalletInfo = {
        address,
        balance: (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4), // Convert wei to ETH
        network: this.getNetworkName(parseInt(chainId, 16)),
        chainId: parseInt(chainId, 16)
      };

      // Store wallet info in localStorage
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', address);

      return walletInfo;
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      throw new Error(error.message || 'Failed to connect wallet');
    }
  }

  private getNetworkName(chainId: number): string {
    const networks: { [key: number]: string } = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      137: 'Polygon',
      80001: 'Mumbai Testnet',
      8453: 'Base',
      84531: 'Base Goerli'
    };
    return networks[chainId] || `Unknown (${chainId})`;
  }

  async disconnectWallet(): Promise<void> {
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
  }

  async switchToNetwork(chainId: number): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // Chain not added to MetaMask
      if (error.code === 4902) {
        throw new Error('Please add this network to your MetaMask');
      }
      throw error;
    }
  }

  isWalletConnected(): boolean {
    return localStorage.getItem('walletConnected') === 'true';
  }

  getConnectedAddress(): string | null {
    return localStorage.getItem('walletAddress');
  }

  async getBalance(address?: string): Promise<string> {
    if (!window.ethereum) {
      throw new Error('Wallet not connected');
    }

    const targetAddress = address || this.getConnectedAddress();
    if (!targetAddress) {
      throw new Error('No address available');
    }

    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [targetAddress, 'latest']
    });

    return (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
  }

  async sendTransaction(to: string, amount: string): Promise<string> {
    if (!window.ethereum) {
      throw new Error('Wallet not connected');
    }

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    const amountInWei = Math.floor(parseFloat(amount) * Math.pow(10, 18)).toString(16);

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        from: accounts[0],
        to: to,
        value: '0x' + amountInWei
      }]
    });

    return txHash;
  }
}

// Global wallet manager instance
export const walletManager = new WalletManager();

// Add type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (data: any) => void) => void;
      removeListener: (event: string, callback: (data: any) => void) => void;
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
    };
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
    };
  }
}