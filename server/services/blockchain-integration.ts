import { blockchainStorage } from "../blockchain/storage";
import { storage } from "../storage";
import { menuCategorizationService } from "./menu-categorization";

interface BlockchainIntegrationConfig {
  enableIPFS: boolean;
  enablePolygon: boolean;
  enableArweave: boolean;
  backupInterval: number; // in milliseconds
}

export class BlockchainIntegrationService {
  private config: BlockchainIntegrationConfig = {
    enableIPFS: false,
    enablePolygon: false, 
    enableArweave: false,
    backupInterval: 300000 // 5 minutes
  };

  private backupTimer?: NodeJS.Timeout;
  private lastBackupTime: number | null = null;

  constructor() {
    this.initializeBackupSchedule();
  }

  async createMenuItemWithBlockchain(menuItemData: any): Promise<any> {
    // Ensure proper categorization
    const properCategory = menuCategorizationService.categorizeMenuItem(
      menuItemData.name,
      menuItemData.description || "",
      menuItemData.price || "0"
    );

    const enrichedData = {
      ...menuItemData,
      category: properCategory,
      timestamp: Date.now(),
      blockchainHash: null
    };

    // Create blockchain record
    const blockchainRecord = await blockchainStorage.createMenuItemBlock(enrichedData);
    
    // Get the created item from storage
    const menuItems = await storage.getMenuItems(menuItemData.restaurantId);
    const createdItem = menuItems.find(item => item.name === menuItemData.name);

    console.log(`✓ Menu item "${menuItemData.name}" categorized as "${properCategory}" and recorded on blockchain`);
    
    return {
      menuItem: createdItem,
      blockchainHash: blockchainRecord.hash,
      category: properCategory,
      blockchainRecord
    };
  }

  async updateMenuItemWithBlockchain(id: number, updateData: any): Promise<any> {
    // Update categorization if name or description changed
    if (updateData.name || updateData.description) {
      const existingItem = await storage.getMenuItem(id);
      if (existingItem) {
        const properCategory = menuCategorizationService.categorizeMenuItem(
          updateData.name || existingItem.name,
          updateData.description || existingItem.description || "",
          updateData.price || existingItem.price
        );
        updateData.category = properCategory;
      }
    }

    const blockchainRecord = await blockchainStorage.updateMenuItemBlock(id, updateData);
    const updatedItem = await storage.getMenuItem(id);

    console.log(`✓ Menu item ${id} updated and recorded on blockchain`);
    
    return {
      menuItem: updatedItem,
      blockchainHash: blockchainRecord.hash,
      blockchainRecord
    };
  }

  async getMenuItemsByCategory(restaurantId: number): Promise<{ [category: string]: any[] }> {
    const menuItems = await storage.getMenuItems(restaurantId);
    const categorizedItems: { [category: string]: any[] } = {};

    // Group items by category
    for (const item of menuItems) {
      const category = item.category || 'Uncategorized';
      if (!categorizedItems[category]) {
        categorizedItems[category] = [];
      }
      categorizedItems[category].push(item);
    }

    // Sort categories by priority
    const sortedCategories: { [category: string]: any[] } = {};
    const categories = menuCategorizationService.getCategories();
    
    for (const category of categories) {
      if (categorizedItems[category.name]) {
        sortedCategories[category.name] = categorizedItems[category.name];
      }
    }

    // Add any uncategorized items at the end
    for (const [category, items] of Object.entries(categorizedItems)) {
      if (!sortedCategories[category]) {
        sortedCategories[category] = items;
      }
    }

    return sortedCategories;
  }

  async getBlockchainStats(): Promise<any> {
    const chain = blockchainStorage.getChain();
    const integrity = blockchainStorage.verifyChainIntegrity();
    
    return {
      totalBlocks: chain.length,
      integrity,
      latestBlock: blockchainStorage.getLatestBlock(),
      menuItemBlocks: chain.filter(block => block.id.includes('menu')).length,
      chainValid: integrity,
      lastBackup: this.getLastBackupTime(),
      config: this.config
    };
  }

  async exportForIPFS(): Promise<{ hash: string; data: any; size: number }> {
    const ipfsData = await blockchainStorage.prepareForIPFS();
    
    return {
      hash: ipfsData.hash,
      data: ipfsData.data,
      size: JSON.stringify(ipfsData.data).length
    };
  }

  private initializeBackupSchedule(): void {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
    }

    this.backupTimer = setInterval(async () => {
      await this.performAutomaticBackup();
    }, this.config.backupInterval);

    console.log(`✓ Blockchain backup scheduled every ${this.config.backupInterval / 1000} seconds`);
  }

  private async performAutomaticBackup(): Promise<void> {
    try {
      const stats = await this.getBlockchainStats();
      
      if (stats.chainValid) {
        const exportData = await this.exportForIPFS();
        console.log(`✓ Blockchain backup completed - ${stats.totalBlocks} blocks, ${exportData.size} bytes`);
        
        // Store backup timestamp (server-side storage)
        this.lastBackupTime = Date.now();
      } else {
        console.error('✗ Blockchain integrity check failed - backup skipped');
      }
    } catch (error) {
      console.error('✗ Blockchain backup failed:', error);
    }
  }

  private getLastBackupTime(): number | null {
    return this.lastBackupTime;
  }

  updateConfig(newConfig: Partial<BlockchainIntegrationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.backupInterval) {
      this.initializeBackupSchedule();
    }
    
    console.log('✓ Blockchain configuration updated:', this.config);
  }

  async validateMenuItemCategories(restaurantId: number): Promise<{ fixed: number; total: number }> {
    const menuItems = await storage.getMenuItems(restaurantId);
    let fixedCount = 0;

    for (const item of menuItems) {
      const properCategory = menuCategorizationService.categorizeMenuItem(
        item.name,
        item.description || "",
        item.price
      );

      if (item.category !== properCategory) {
        await this.updateMenuItemWithBlockchain(item.id, { category: properCategory });
        fixedCount++;
      }
    }

    console.log(`✓ Category validation complete: ${fixedCount} items recategorized out of ${menuItems.length} total`);
    
    return { fixed: fixedCount, total: menuItems.length };
  }
}

export const blockchainIntegrationService = new BlockchainIntegrationService();