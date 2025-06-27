// IPFS integration for decentralized data storage
// Stores menu data, order history, and AI training data on IPFS

export interface IPFSNode {
  hash: string;
  size: number;
  type: 'menu' | 'order' | 'chat' | 'analytics' | 'backup';
  timestamp: number;
  metadata: any;
}

export interface DecentralizedData {
  id: string;
  content: any;
  contentType: string;
  encryption?: {
    enabled: boolean;
    keyHash: string;
  };
  replication: {
    nodes: number;
    regions: string[];
  };
  ipfsHash?: string;
  arweaveHash?: string;
}

export class IPFSStorageService {
  private ipfsGateway: string;
  private pinataApiKey: string;
  private pinataApiSecret: string;

  constructor() {
    this.ipfsGateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud';
    this.pinataApiKey = process.env.PINATA_API_KEY || '';
    this.pinataApiSecret = process.env.PINATA_API_SECRET || '';
  }

  async storeMenuData(restaurantId: string, menuData: any): Promise<IPFSNode> {
    const dataPackage = {
      restaurantId,
      menuData,
      version: Date.now(),
      schema: 'menu-v1',
      timestamp: Date.now()
    };

    return await this.pinToIPFS(dataPackage, 'menu', {
      restaurantId,
      itemCount: menuData.length
    });
  }

  async storeOrderHistory(orders: any[]): Promise<IPFSNode> {
    // Anonymize sensitive data before storage
    const anonymizedOrders = orders.map(order => ({
      orderId: order.id,
      items: order.items,
      totalAmount: order.total,
      timestamp: order.timestamp,
      customerHash: this.hashCustomerData(order.customerId),
      location: order.location
    }));

    return await this.pinToIPFS(anonymizedOrders, 'order', {
      orderCount: orders.length,
      dateRange: {
        start: Math.min(...orders.map(o => o.timestamp)),
        end: Math.max(...orders.map(o => o.timestamp))
      }
    });
  }

  async storeChatHistory(chatData: any[]): Promise<IPFSNode> {
    // Remove personal information while keeping valuable training data
    const sanitizedChats = chatData.map(chat => ({
      messageId: chat.id,
      content: chat.content,
      intent: chat.intent,
      satisfaction: chat.satisfaction,
      timestamp: chat.timestamp,
      platform: chat.platform,
      resolved: chat.resolved
    }));

    return await this.pinToIPFS(sanitizedChats, 'chat', {
      messageCount: chatData.length,
      platforms: Array.from(new Set(chatData.map(c => c.platform)))
    });
  }

  async storeAIModelWeights(modelData: Buffer, modelVersion: string): Promise<IPFSNode> {
    // Store fine-tuned model weights for decentralized AI
    const modelPackage = {
      version: modelVersion,
      architecture: 'transformer',
      trainingData: 'restaurant-specific',
      timestamp: Date.now(),
      checksum: this.calculateChecksum(modelData)
    };

    const ipfsNode = await this.pinToIPFS(modelPackage, 'ai_model', {
      modelSize: modelData.length,
      version: modelVersion
    });

    // Store actual model weights separately for large files
    const weightsHash = await this.pinLargeFileToIPFS(modelData, `model-weights-${modelVersion}`);
    
    return {
      ...ipfsNode,
      metadata: {
        ...ipfsNode.metadata,
        weightsHash
      }
    };
  }

  async retrieveData(ipfsHash: string): Promise<any> {
    try {
      const response = await fetch(`${this.ipfsGateway}/ipfs/${ipfsHash}`);
      
      if (!response.ok) {
        throw new Error(`IPFS retrieval failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('IPFS data retrieval failed:', error);
      throw error;
    }
  }

  async createDataMirror(data: DecentralizedData): Promise<string[]> {
    // Mirror critical data across multiple networks
    const hashes: string[] = [];

    // Store on IPFS
    const ipfsNode = await this.pinToIPFS(data.content, data.contentType, data);
    hashes.push(ipfsNode.hash);

    // Store on Arweave for permanent storage
    if (data.replication.nodes > 1) {
      const arweaveHash = await this.storeOnArweave(data);
      hashes.push(arweaveHash);
    }

    return hashes;
  }

  private async pinToIPFS(data: any, type: string, metadata: any): Promise<IPFSNode> {
    try {
      const formData = new FormData();
      const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      
      formData.append('file', jsonBlob, `${type}-${Date.now()}.json`);
      
      const pinataMetadata = {
        name: `Mimi-${type}-${Date.now()}`,
        keyvalues: {
          type,
          ...metadata,
          app: 'mimi-waitress'
        }
      };
      
      formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataApiSecret
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Pinata upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      const ipfsNode: IPFSNode = {
        hash: result.IpfsHash,
        size: result.PinSize,
        type: type as any,
        timestamp: Date.now(),
        metadata
      };

      console.log('Data pinned to IPFS:', ipfsNode);
      return ipfsNode;
    } catch (error) {
      console.error('IPFS pinning failed:', error);
      throw error;
    }
  }

  private async pinLargeFileToIPFS(fileData: Buffer, filename: string): Promise<string> {
    try {
      const formData = new FormData();
      const fileBlob = new Blob([fileData]);
      formData.append('file', fileBlob, filename);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataApiSecret
        },
        body: formData
      });

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      console.error('Large file IPFS pinning failed:', error);
      throw error;
    }
  }

  private async storeOnArweave(data: DecentralizedData): Promise<string> {
    // Placeholder for Arweave integration
    console.log('Storing on Arweave:', data.id);
    return `arweave_${Date.now()}`;
  }

  private hashCustomerData(customerId: string): string {
    // Create anonymous but consistent hash for analytics
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(customerId + 'mimi_salt').digest('hex').substring(0, 16);
  }

  private calculateChecksum(data: Buffer): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async getStorageStats(): Promise<any> {
    try {
      const response = await fetch('https://api.pinata.cloud/data/pinList?status=pinned', {
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataApiSecret
        }
      });

      const data = await response.json();
      
      return {
        totalPins: data.count,
        totalSize: data.rows.reduce((sum: number, pin: any) => sum + pin.size, 0),
        byType: data.rows.reduce((acc: any, pin: any) => {
          const type = pin.metadata?.keyvalues?.type || 'unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { totalPins: 0, totalSize: 0, byType: {} };
    }
  }
}

export const ipfsStorage = new IPFSStorageService();