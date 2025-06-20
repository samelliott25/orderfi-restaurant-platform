// Web3 wallet integration for customer payments and restaurant payouts
// Supports multiple wallets: MetaMask, WalletConnect, Coinbase Wallet

export interface WalletConnection {
  address: string;
  chainId: number;
  network: 'base' | 'polygon';
  walletType: 'metamask' | 'walletconnect' | 'coinbase';
  isConnected: boolean;
  balance: {
    eth: string;
    usdc: string;
  };
}

export interface PaymentTransaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  gas: string;
  gasPrice: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
}

export class Web3WalletService {
  private connections: Map<string, WalletConnection> = new Map();
  private networkConfig = {
    base: {
      chainId: 8453,
      name: 'Base',
      rpcUrl: 'https://mainnet.base.org',
      usdcContract: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      blockExplorer: 'https://basescan.org'
    },
    polygon: {
      chainId: 137,
      name: 'Polygon',
      rpcUrl: 'https://polygon-rpc.com',
      usdcContract: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      blockExplorer: 'https://polygonscan.com'
    }
  };

  async connectWallet(walletType: string, networkPreference: 'base' | 'polygon'): Promise<WalletConnection> {
    const config = this.networkConfig[networkPreference];
    
    // Simulate wallet connection response
    const connection: WalletConnection = {
      address: `0x${Math.random().toString(16).substring(2, 42)}`,
      chainId: config.chainId,
      network: networkPreference,
      walletType: walletType as any,
      isConnected: true,
      balance: {
        eth: '0.05',
        usdc: '150.00'
      }
    };

    this.connections.set(connection.address, connection);
    console.log('Wallet connected:', connection);
    
    return connection;
  }

  async initiatePayment(
    walletAddress: string, 
    restaurantAddress: string, 
    amount: number,
    orderId: string
  ): Promise<PaymentTransaction> {
    const connection = this.connections.get(walletAddress);
    if (!connection) {
      throw new Error('Wallet not connected');
    }

    const config = this.networkConfig[connection.network as keyof typeof this.networkConfig];
    const amountWei = (amount * 1_000_000).toString(); // USDC has 6 decimals

    // Generate transaction parameters
    const transaction: PaymentTransaction = {
      hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      from: walletAddress,
      to: config.usdcContract,
      amount: amountWei,
      gas: '21000',
      gasPrice: '20000000000', // 20 gwei
      status: 'pending'
    };

    console.log(`Payment initiated: $${amount} USDC for order ${orderId}`);
    console.log('Transaction:', transaction);

    // Simulate confirmation after 3 seconds
    setTimeout(() => {
      transaction.status = 'confirmed';
      transaction.blockNumber = Math.floor(Math.random() * 1000000) + 18000000;
      console.log('Payment confirmed:', transaction);
    }, 3000);

    return transaction;
  }

  async switchNetwork(walletAddress: string, targetNetwork: 'base' | 'polygon'): Promise<boolean> {
    const connection = this.connections.get(walletAddress);
    if (!connection) {
      throw new Error('Wallet not connected');
    }

    const config = this.networkConfig[targetNetwork];
    
    connection.network = targetNetwork;
    connection.chainId = config.chainId;
    
    console.log(`Switched to ${config.name} network`);
    return true;
  }

  async getUSDCBalance(walletAddress: string): Promise<string> {
    const connection = this.connections.get(walletAddress);
    if (!connection) {
      return '0';
    }

    // In production, this would query the USDC contract
    return connection.balance.usdc;
  }

  async addUSDCToWallet(walletAddress: string): Promise<boolean> {
    const connection = this.connections.get(walletAddress);
    if (!connection) {
      return false;
    }

    const config = this.networkConfig[connection.network as keyof typeof this.networkConfig];
    
    // Generate parameters for adding USDC token to wallet
    const tokenData = {
      type: 'ERC20',
      options: {
        address: config.usdcContract,
        symbol: 'USDC',
        decimals: 6,
        image: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
      }
    };

    console.log('Adding USDC token to wallet:', tokenData);
    return true;
  }

  generatePaymentQR(restaurantAddress: string, amount: number, orderId: string): string {
    // Generate QR code data for mobile wallet payments
    const paymentData = {
      address: restaurantAddress,
      amount: amount.toString(),
      orderId,
      token: 'USDC',
      network: 'base'
    };

    // In production, this would generate an actual QR code
    return `data:payment:${Buffer.from(JSON.stringify(paymentData)).toString('base64')}`;
  }

  async validateTransaction(txHash: string, expectedAmount: string): Promise<boolean> {
    try {
      // Query blockchain to verify transaction
      console.log(`Validating transaction ${txHash} for amount ${expectedAmount} USDC`);
      
      // Simulate validation
      return Math.random() > 0.1; // 90% success rate
    } catch (error) {
      console.error('Transaction validation failed:', error);
      return false;
    }
  }

  async setupRestaurantWallet(restaurantId: string): Promise<string> {
    // Generate or retrieve restaurant's receiving wallet
    const walletAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
    
    console.log(`Restaurant wallet setup for ${restaurantId}: ${walletAddress}`);
    
    // Store wallet mapping
    const restaurantWallet = {
      restaurantId,
      address: walletAddress,
      networks: ['base', 'polygon'],
      autoConvert: true, // Auto-convert to fiat
      created: Date.now()
    };

    return walletAddress;
  }

  async processInstantPayout(restaurantWallet: string, amount: number): Promise<string> {
    // Instant USDC payout to restaurant
    const payoutHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    
    console.log(`Instant payout: $${amount} USDC to ${restaurantWallet}`);
    console.log(`Payout hash: ${payoutHash}`);
    
    return payoutHash;
  }

  getNetworkInfo(network: 'base' | 'polygon') {
    return this.networkConfig[network];
  }

  async getTransactionHistory(walletAddress: string): Promise<PaymentTransaction[]> {
    // Return recent payment history
    return [];
  }

  disconnectWallet(walletAddress: string): boolean {
    const connection = this.connections.get(walletAddress);
    if (connection) {
      connection.isConnected = false;
      this.connections.delete(walletAddress);
      console.log('Wallet disconnected:', walletAddress);
      return true;
    }
    return false;
  }
}

export const web3Wallet = new Web3WalletService();