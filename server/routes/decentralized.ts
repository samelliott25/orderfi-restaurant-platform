import type { Express } from "express";
import { akashCompute } from "../decentralized/akash-compute";
import { usdcPayments } from "../decentralized/usdc-payments";
import { ipfsStorage } from "../decentralized/ipfs-storage";
import { web3Wallet } from "../decentralized/web3-wallet";

export function registerDecentralizedRoutes(app: Express): void {
  
  // Akash Network compute endpoints
  app.post("/api/decentralized/compute/deploy", async (req, res) => {
    try {
      const deployment = await akashCompute.deployAIService();
      res.json(deployment);
    } catch (error) {
      console.error("Akash deployment error:", error);
      res.status(500).json({ message: "Failed to deploy to Akash Network" });
    }
  });

  app.post("/api/decentralized/compute/process", async (req, res) => {
    try {
      const { type, inputData, userId, priority } = req.body;
      
      const request = {
        requestId: `req_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        type,
        inputData,
        userId,
        timestamp: Date.now(),
        priority: priority || 'medium'
      };

      const result = await akashCompute.processAIRequest(request);
      res.json(result);
    } catch (error) {
      console.error("AI compute processing error:", error);
      res.status(500).json({ message: "Failed to process AI request" });
    }
  });

  app.get("/api/decentralized/compute/status", async (req, res) => {
    try {
      const status = await akashCompute.getDeploymentStatus();
      res.json(status);
    } catch (error) {
      console.error("Deployment status error:", error);
      res.status(500).json({ message: "Failed to get deployment status" });
    }
  });

  // USDC payment endpoints
  app.post("/api/decentralized/payments/initiate", async (req, res) => {
    try {
      const { orderId, amount, customerWallet, restaurantWallet, network, metadata } = req.body;
      
      const paymentRequest = {
        orderId,
        amount,
        customerWallet,
        restaurantWallet,
        network: network || 'base',
        metadata
      };

      const payment = await usdcPayments.initiatePayment(paymentRequest);
      res.json(payment);
    } catch (error) {
      console.error("Payment initiation error:", error);
      res.status(500).json({ message: "Failed to initiate payment" });
    }
  });

  app.post("/api/decentralized/payments/confirm", async (req, res) => {
    try {
      const { paymentId, transactionHash } = req.body;
      
      if (!paymentId || !transactionHash) {
        return res.status(400).json({ message: "Missing paymentId or transactionHash" });
      }

      const confirmedPayment = await usdcPayments.confirmPayment(paymentId, transactionHash);
      res.json(confirmedPayment);
    } catch (error) {
      console.error("Payment confirmation error:", error);
      res.status(500).json({ message: "Failed to confirm payment" });
    }
  });

  app.get("/api/decentralized/payments/:paymentId", async (req, res) => {
    try {
      const { paymentId } = req.params;
      const payment = await usdcPayments.getPaymentStatus(paymentId);
      
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      res.json(payment);
    } catch (error) {
      console.error("Payment status error:", error);
      res.status(500).json({ message: "Failed to get payment status" });
    }
  });

  app.post("/api/decentralized/payments/refund", async (req, res) => {
    try {
      const { paymentId, refundAmount } = req.body;
      const refund = await usdcPayments.processRefund(paymentId, refundAmount);
      res.json(refund);
    } catch (error) {
      console.error("Refund processing error:", error);
      res.status(500).json({ message: "Failed to process refund" });
    }
  });

  // IPFS storage endpoints
  app.post("/api/decentralized/storage/menu", async (req, res) => {
    try {
      const { restaurantId, menuData } = req.body;
      const ipfsNode = await ipfsStorage.storeMenuData(restaurantId, menuData);
      res.json(ipfsNode);
    } catch (error) {
      console.error("Menu storage error:", error);
      res.status(500).json({ message: "Failed to store menu data" });
    }
  });

  app.post("/api/decentralized/storage/orders", async (req, res) => {
    try {
      const { orders } = req.body;
      const ipfsNode = await ipfsStorage.storeOrderHistory(orders);
      res.json(ipfsNode);
    } catch (error) {
      console.error("Order storage error:", error);
      res.status(500).json({ message: "Failed to store order history" });
    }
  });

  app.post("/api/decentralized/storage/chat", async (req, res) => {
    try {
      const { chatData } = req.body;
      const ipfsNode = await ipfsStorage.storeChatHistory(chatData);
      res.json(ipfsNode);
    } catch (error) {
      console.error("Chat storage error:", error);
      res.status(500).json({ message: "Failed to store chat history" });
    }
  });

  app.get("/api/decentralized/storage/:hash", async (req, res) => {
    try {
      const { hash } = req.params;
      const data = await ipfsStorage.retrieveData(hash);
      res.json(data);
    } catch (error) {
      console.error("Data retrieval error:", error);
      res.status(500).json({ message: "Failed to retrieve data from IPFS" });
    }
  });

  app.get("/api/decentralized/storage/stats", async (req, res) => {
    try {
      const stats = await ipfsStorage.getStorageStats();
      res.json(stats);
    } catch (error) {
      console.error("Storage stats error:", error);
      res.status(500).json({ message: "Failed to get storage statistics" });
    }
  });

  // Web3 wallet endpoints
  app.post("/api/decentralized/wallet/connect", async (req, res) => {
    try {
      const { walletType, networkPreference } = req.body;
      const connection = await web3Wallet.connectWallet(walletType, networkPreference);
      res.json(connection);
    } catch (error) {
      console.error("Wallet connection error:", error);
      res.status(500).json({ message: "Failed to connect wallet" });
    }
  });

  app.post("/api/decentralized/wallet/payment", async (req, res) => {
    try {
      const { walletAddress, restaurantAddress, amount, orderId } = req.body;
      const transaction = await web3Wallet.initiatePayment(walletAddress, restaurantAddress, amount, orderId);
      res.json(transaction);
    } catch (error) {
      console.error("Wallet payment error:", error);
      res.status(500).json({ message: "Failed to initiate wallet payment" });
    }
  });

  app.post("/api/decentralized/wallet/switch-network", async (req, res) => {
    try {
      const { walletAddress, targetNetwork } = req.body;
      const success = await web3Wallet.switchNetwork(walletAddress, targetNetwork);
      res.json({ success });
    } catch (error) {
      console.error("Network switch error:", error);
      res.status(500).json({ message: "Failed to switch network" });
    }
  });

  app.get("/api/decentralized/wallet/:address/balance", async (req, res) => {
    try {
      const { address } = req.params;
      const balance = await web3Wallet.getUSDCBalance(address);
      res.json({ balance });
    } catch (error) {
      console.error("Balance check error:", error);
      res.status(500).json({ message: "Failed to get wallet balance" });
    }
  });

  app.post("/api/decentralized/wallet/add-usdc", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      const success = await web3Wallet.addUSDCToWallet(walletAddress);
      res.json({ success });
    } catch (error) {
      console.error("Add USDC error:", error);
      res.status(500).json({ message: "Failed to add USDC to wallet" });
    }
  });

  app.post("/api/decentralized/wallet/qr-payment", async (req, res) => {
    try {
      const { restaurantAddress, amount, orderId } = req.body;
      const qrData = web3Wallet.generatePaymentQR(restaurantAddress, amount, orderId);
      res.json({ qrData });
    } catch (error) {
      console.error("QR generation error:", error);
      res.status(500).json({ message: "Failed to generate payment QR" });
    }
  });

  app.post("/api/decentralized/restaurant/setup-wallet", async (req, res) => {
    try {
      const { restaurantId } = req.body;
      const walletAddress = await web3Wallet.setupRestaurantWallet(restaurantId);
      res.json({ walletAddress });
    } catch (error) {
      console.error("Restaurant wallet setup error:", error);
      res.status(500).json({ message: "Failed to setup restaurant wallet" });
    }
  });

  app.post("/api/decentralized/restaurant/payout", async (req, res) => {
    try {
      const { restaurantWallet, amount } = req.body;
      const payoutHash = await web3Wallet.processInstantPayout(restaurantWallet, amount);
      res.json({ payoutHash });
    } catch (error) {
      console.error("Payout processing error:", error);
      res.status(500).json({ message: "Failed to process payout" });
    }
  });

  app.get("/api/decentralized/network/:network/info", async (req, res) => {
    try {
      const { network } = req.params;
      const networkInfo = web3Wallet.getNetworkInfo(network as 'base' | 'polygon');
      res.json(networkInfo);
    } catch (error) {
      console.error("Network info error:", error);
      res.status(500).json({ message: "Failed to get network information" });
    }
  });

  // Combined decentralized status endpoint
  app.get("/api/decentralized/status", async (req, res) => {
    try {
      const [computeStatus, storageStats] = await Promise.all([
        akashCompute.getDeploymentStatus(),
        ipfsStorage.getStorageStats()
      ]);

      const status = {
        compute: {
          akash: computeStatus,
          status: computeStatus ? 'active' : 'inactive'
        },
        storage: {
          ipfs: storageStats,
          status: 'active'
        },
        payments: {
          usdc: 'active',
          networks: ['base', 'polygon']
        },
        timestamp: Date.now()
      };

      res.json(status);
    } catch (error) {
      console.error("Decentralized status error:", error);
      res.status(500).json({ message: "Failed to get decentralized status" });
    }
  });
}