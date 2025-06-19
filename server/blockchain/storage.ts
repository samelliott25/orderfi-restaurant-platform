import { createHash } from 'crypto';
import { storage as memStorage } from '../storage';

interface BlockchainRecord {
  id: string;
  timestamp: number;
  data: any;
  hash: string;
  previousHash: string;
  merkleRoot: string;
}

interface MenuItemBlock extends BlockchainRecord {
  data: {
    restaurantId: number;
    name: string;
    description: string;
    price: string;
    category: string;
    tags: string[];
    isAvailable: boolean;
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
  };
}

class BlockchainStorage {
  private chain: BlockchainRecord[] = [];
  private pendingTransactions: any[] = [];

  constructor() {
    this.createGenesisBlock();
  }

  private createGenesisBlock() {
    const genesisBlock: BlockchainRecord = {
      id: 'genesis',
      timestamp: Date.now(),
      data: { message: 'Genesis Block - Mimi Restaurant System' },
      hash: '',
      previousHash: '0',
      merkleRoot: ''
    };
    genesisBlock.hash = this.calculateHash(genesisBlock);
    this.chain.push(genesisBlock);
  }

  private calculateHash(block: Omit<BlockchainRecord, 'hash'>): string {
    const data = JSON.stringify({
      id: block.id,
      timestamp: block.timestamp,
      data: block.data,
      previousHash: block.previousHash,
      merkleRoot: block.merkleRoot
    });
    return createHash('sha256').update(data).digest('hex');
  }

  private calculateMerkleRoot(transactions: any[]): string {
    if (transactions.length === 0) return '';
    if (transactions.length === 1) {
      return createHash('sha256').update(JSON.stringify(transactions[0])).digest('hex');
    }

    const hashes = transactions.map(tx => 
      createHash('sha256').update(JSON.stringify(tx)).digest('hex')
    );

    while (hashes.length > 1) {
      const newLevel = [];
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = hashes[i + 1] || hashes[i];
        const combined = createHash('sha256').update(left + right).digest('hex');
        newLevel.push(combined);
      }
      hashes.splice(0, hashes.length, ...newLevel);
    }

    return hashes[0];
  }

  async createMenuItemBlock(menuItemData: any): Promise<MenuItemBlock> {
    // First create in traditional storage
    const menuItem = await memStorage.createMenuItem(menuItemData);

    // Create blockchain record with proper type handling
    const blockData = {
      restaurantId: menuItem.restaurantId || 1,
      name: menuItem.name,
      description: menuItem.description || '',
      price: menuItem.price,
      category: menuItem.category,
      tags: menuItem.tags || [],
      isAvailable: menuItem.isAvailable !== null ? menuItem.isAvailable : true,
      operation: 'CREATE' as const
    };

    const block: Omit<MenuItemBlock, 'hash'> = {
      id: `menu-${menuItem.id}-${Date.now()}`,
      timestamp: Date.now(),
      data: blockData,
      previousHash: this.getLatestBlock().hash,
      merkleRoot: this.calculateMerkleRoot([blockData])
    };

    const menuItemBlock: MenuItemBlock = {
      ...block,
      hash: this.calculateHash(block)
    };

    this.chain.push(menuItemBlock);
    
    console.log(`Menu item "${menuItem.name}" added to blockchain with hash: ${menuItemBlock.hash}`);
    
    return menuItemBlock;
  }

  async updateMenuItemBlock(id: number, updateData: any): Promise<MenuItemBlock> {
    const updatedItem = await memStorage.updateMenuItem(id, updateData);

    // Create blockchain record with proper type handling
    const blockData = {
      restaurantId: updatedItem.restaurantId || 1,
      name: updatedItem.name,
      description: updatedItem.description || '',
      price: updatedItem.price,
      category: updatedItem.category,
      tags: updatedItem.tags || [],
      isAvailable: updatedItem.isAvailable !== null ? updatedItem.isAvailable : true,
      operation: 'UPDATE' as const
    };

    const block: Omit<MenuItemBlock, 'hash'> = {
      id: `menu-update-${id}-${Date.now()}`,
      timestamp: Date.now(),
      data: blockData,
      previousHash: this.getLatestBlock().hash,
      merkleRoot: this.calculateMerkleRoot([blockData])
    };

    const menuItemBlock: MenuItemBlock = {
      ...block,
      hash: this.calculateHash(block)
    };

    this.chain.push(menuItemBlock);
    
    console.log(`Menu item ${id} updated on blockchain with hash: ${menuItemBlock.hash}`);
    
    return menuItemBlock;
  }

  getLatestBlock(): BlockchainRecord {
    return this.chain[this.chain.length - 1];
  }

  getChain(): BlockchainRecord[] {
    return [...this.chain];
  }

  getMenuItemHistory(menuItemId: number): MenuItemBlock[] {
    return this.chain.filter((block): block is MenuItemBlock => 
      block.id.includes('menu') && 
      (block as MenuItemBlock).data?.restaurantId !== undefined &&
      block.id.includes(menuItemId.toString())
    );
  }

  verifyChainIntegrity(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify hash
      const calculatedHash = this.calculateHash({
        id: currentBlock.id,
        timestamp: currentBlock.timestamp,
        data: currentBlock.data,
        previousHash: currentBlock.previousHash,
        merkleRoot: currentBlock.merkleRoot
      });

      if (currentBlock.hash !== calculatedHash) {
        console.error(`Invalid hash at block ${i}`);
        return false;
      }

      // Verify chain linkage
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.error(`Invalid previous hash at block ${i}`);
        return false;
      }
    }

    return true;
  }

  exportBlockchainData(): string {
    return JSON.stringify({
      chain: this.chain,
      integrity: this.verifyChainIntegrity(),
      totalBlocks: this.chain.length,
      exportTimestamp: Date.now()
    }, null, 2);
  }

  // IPFS Integration Ready
  async prepareForIPFS(): Promise<{ hash: string; data: any }> {
    const chainData = {
      chain: this.chain,
      metadata: {
        totalBlocks: this.chain.length,
        integrity: this.verifyChainIntegrity(),
        lastBlockHash: this.getLatestBlock().hash,
        timestamp: Date.now()
      }
    };

    const dataHash = createHash('sha256').update(JSON.stringify(chainData)).digest('hex');
    
    return {
      hash: dataHash,
      data: chainData
    };
  }
}

export const blockchainStorage = new BlockchainStorage();