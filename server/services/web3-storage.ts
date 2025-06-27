import { Web3Storage, File } from 'web3.storage';
import fs from 'fs/promises';
import path from 'path';

interface StoredAsset {
  cid: string;
  name: string;
  size: number;
  type: string;
  url: string;
  pinned: boolean;
  uploadedAt: number;
}

interface UploadResult {
  success: boolean;
  cid?: string;
  url?: string;
  error?: string;
}

class Web3StorageService {
  private client: Web3Storage;
  private gateway: string = 'https://w3s.link/ipfs/';
  private assets: Map<string, StoredAsset> = new Map();

  constructor() {
    const token = process.env.WEB3_STORAGE_TOKEN;
    if (!token) {
      throw new Error('WEB3_STORAGE_TOKEN environment variable required');
    }
    this.client = new Web3Storage({ token });
  }

  async uploadFile(filePath: string, fileName?: string): Promise<UploadResult> {
    try {
      const fileBuffer = await fs.readFile(filePath);
      const file = new File([fileBuffer], fileName || path.basename(filePath));
      
      const cid = await this.client.put([file], {
        name: fileName || path.basename(filePath),
        maxRetries: 3
      });

      const asset: StoredAsset = {
        cid,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        url: `${this.gateway}${cid}/${file.name}`,
        pinned: true,
        uploadedAt: Date.now()
      };

      this.assets.set(cid, asset);
      console.log(`Asset uploaded to IPFS: ${asset.name} (${cid})`);

      return {
        success: true,
        cid,
        url: asset.url
      };
    } catch (error) {
      console.error('Web3.Storage upload failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async uploadJSON(data: any, filename: string): Promise<UploadResult> {
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const file = new File([jsonContent], filename, { type: 'application/json' });
      
      const cid = await this.client.put([file], {
        name: filename,
        maxRetries: 3
      });

      const asset: StoredAsset = {
        cid,
        name: filename,
        size: file.size,
        type: 'application/json',
        url: `${this.gateway}${cid}/${filename}`,
        pinned: true,
        uploadedAt: Date.now()
      };

      this.assets.set(cid, asset);
      console.log(`JSON uploaded to IPFS: ${filename} (${cid})`);

      return {
        success: true,
        cid,
        url: asset.url
      };
    } catch (error) {
      console.error('Web3.Storage JSON upload failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async uploadDirectory(dirPath: string): Promise<UploadResult> {
    try {
      const files: File[] = [];
      
      async function addFilesFromDir(currentPath: string, basePath: string = '') {
        const items = await fs.readdir(currentPath, { withFileTypes: true });
        
        for (const item of items) {
          const fullPath = path.join(currentPath, item.name);
          const relativePath = path.join(basePath, item.name);
          
          if (item.isDirectory()) {
            await addFilesFromDir(fullPath, relativePath);
          } else {
            const fileBuffer = await fs.readFile(fullPath);
            files.push(new File([fileBuffer], relativePath));
          }
        }
      }

      await addFilesFromDir(dirPath);
      
      if (files.length === 0) {
        return {
          success: false,
          error: 'No files found in directory'
        };
      }

      const cid = await this.client.put(files, {
        name: path.basename(dirPath),
        maxRetries: 3,
        wrapWithDirectory: true
      });

      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      
      const asset: StoredAsset = {
        cid,
        name: path.basename(dirPath),
        size: totalSize,
        type: 'directory',
        url: `${this.gateway}${cid}/`,
        pinned: true,
        uploadedAt: Date.now()
      };

      this.assets.set(cid, asset);
      console.log(`Directory uploaded to IPFS: ${asset.name} (${files.length} files, ${cid})`);

      return {
        success: true,
        cid,
        url: asset.url
      };
    } catch (error) {
      console.error('Web3.Storage directory upload failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async downloadFile(cid: string, filename?: string): Promise<Buffer | null> {
    try {
      const res = await this.client.get(cid);
      if (!res) {
        throw new Error('File not found');
      }

      const files = await res.files();
      const targetFile = filename 
        ? files.find(f => f.name === filename)
        : files[0];

      if (!targetFile) {
        throw new Error('Specified file not found in IPFS response');
      }

      const arrayBuffer = await targetFile.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Web3.Storage download failed:', error);
      return null;
    }
  }

  async getFileInfo(cid: string): Promise<StoredAsset | null> {
    const cached = this.assets.get(cid);
    if (cached) {
      return cached;
    }

    try {
      const res = await this.client.get(cid);
      if (!res) {
        return null;
      }

      const files = await res.files();
      if (files.length === 0) {
        return null;
      }

      const file = files[0];
      const asset: StoredAsset = {
        cid,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        url: `${this.gateway}${cid}/${file.name}`,
        pinned: true,
        uploadedAt: Date.now()
      };

      this.assets.set(cid, asset);
      return asset;
    } catch (error) {
      console.error('Web3.Storage file info failed:', error);
      return null;
    }
  }

  async listUploads(): Promise<StoredAsset[]> {
    try {
      const uploads = [];
      for await (const upload of this.client.list()) {
        const asset: StoredAsset = {
          cid: upload.cid,
          name: upload.name || 'unnamed',
          size: upload.dagSize || 0,
          type: 'unknown',
          url: `${this.gateway}${upload.cid}/`,
          pinned: upload.pins.length > 0,
          uploadedAt: new Date(upload.created).getTime()
        };
        uploads.push(asset);
        this.assets.set(upload.cid, asset);
      }
      return uploads;
    } catch (error) {
      console.error('Web3.Storage list failed:', error);
      return [];
    }
  }

  async deleteFile(cid: string): Promise<boolean> {
    try {
      await this.client.delete(cid);
      this.assets.delete(cid);
      console.log(`File deleted from IPFS: ${cid}`);
      return true;
    } catch (error) {
      console.error('Web3.Storage delete failed:', error);
      return false;
    }
  }

  async uploadOrderfiAssets(): Promise<{ frontend: UploadResult; assets: UploadResult }> {
    console.log('Uploading OrderFi frontend and assets to IPFS...');
    
    try {
      // Upload built frontend
      const frontendResult = await this.uploadDirectory('./dist');
      
      // Upload static assets
      const assetsResult = await this.uploadDirectory('./attached_assets');
      
      if (frontendResult.success && assetsResult.success) {
        console.log(`OrderFi deployed to IPFS:`);
        console.log(`  Frontend: ${frontendResult.url}`);
        console.log(`  Assets: ${assetsResult.url}`);
      }

      return {
        frontend: frontendResult,
        assets: assetsResult
      };
    } catch (error) {
      console.error('OrderFi IPFS deployment failed:', error);
      return {
        frontend: { success: false, error: error.message },
        assets: { success: false, error: error.message }
      };
    }
  }

  getAssetUrl(cid: string, filename?: string): string {
    return filename 
      ? `${this.gateway}${cid}/${filename}`
      : `${this.gateway}${cid}/`;
  }

  getCachedAssets(): StoredAsset[] {
    return Array.from(this.assets.values());
  }

  async getStorageStatus(): Promise<{
    totalUploads: number;
    totalSize: number;
    pinnedFiles: number;
    recentUploads: StoredAsset[];
  }> {
    const assets = Array.from(this.assets.values());
    const pinnedFiles = assets.filter(a => a.pinned).length;
    const totalSize = assets.reduce((sum, a) => sum + a.size, 0);
    const recentUploads = assets
      .sort((a, b) => b.uploadedAt - a.uploadedAt)
      .slice(0, 10);

    return {
      totalUploads: assets.length,
      totalSize,
      pinnedFiles,
      recentUploads
    };
  }
}

export const web3Storage = new Web3StorageService();