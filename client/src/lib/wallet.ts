import { ethers } from 'ethers';

export interface WalletInfo {
  address: string;
  balance: string;
  network: string;
  chainId: number;
}

export class WalletManager {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  async connectWallet(): Promise<WalletInfo | null> {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Get wallet info
      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);
      const network = await this.provider.getNetwork();

      const walletInfo: WalletInfo = {
        address,
        balance: ethers.formatEther(balance),
        network: network.name,
        chainId: Number(network.chainId)
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

  async disconnectWallet(): Promise<void> {
    this.provider = null;
    this.signer = null;
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
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    const targetAddress = address || await this.signer?.getAddress();
    if (!targetAddress) {
      throw new Error('No address available');
    }

    const balance = await this.provider.getBalance(targetAddress);
    return ethers.formatEther(balance);
  }

  async sendTransaction(to: string, amount: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const tx = await this.signer.sendTransaction({
      to,
      value: ethers.parseEther(amount)
    });

    return tx.hash;
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
    };
  }
}