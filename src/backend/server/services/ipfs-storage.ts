import { create, IPFSHTTPClient } from 'ipfs-http-client';
import fs from 'fs';
import path from 'path';

interface IPFSFile {
  name: string;
  hash: string;
  size: number;
  url: string;
}

class IPFSStorageService {
  private ipfs: IPFSHTTPClient;
  private gateway: string;

  constructor() {
    // Connect to IPFS node (Infura, local node, or public gateway)
    this.ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https'
    });
    this.gateway = 'https://gateway.pinata.cloud/ipfs/';
  }

  async uploadFile(filePath: string, fileName: string): Promise<IPFSFile> {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const result = await this.ipfs.add({
        path: fileName,
        content: fileBuffer
      });

      return {
        name: fileName,
        hash: result.cid.toString(),
        size: result.size,
        url: `${this.gateway}${result.cid.toString()}`
      };
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error(`Failed to upload file to IPFS: ${error.message}`);
    }
  }

  async uploadJSON(data: any, fileName: string): Promise<IPFSFile> {
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const result = await this.ipfs.add({
        path: fileName,
        content: Buffer.from(jsonContent)
      });

      return {
        name: fileName,
        hash: result.cid.toString(),
        size: result.size,
        url: `${this.gateway}${result.cid.toString()}`
      };
    } catch (error) {
      console.error('IPFS JSON upload error:', error);
      throw new Error(`Failed to upload JSON to IPFS: ${error.message}`);
    }
  }

  async downloadFile(hash: string): Promise<Buffer> {
    try {
      const chunks = [];
      for await (const chunk of this.ipfs.cat(hash)) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('IPFS download error:', error);
      throw new Error(`Failed to download file from IPFS: ${error.message}`);
    }
  }

  async pinFile(hash: string): Promise<boolean> {
    try {
      await this.ipfs.pin.add(hash);
      return true;
    } catch (error) {
      console.error('IPFS pin error:', error);
      return false;
    }
  }

  async uploadDirectory(dirPath: string): Promise<IPFSFile[]> {
    try {
      const files: IPFSFile[] = [];
      const addOptions = {
        recursive: true,
        wrapWithDirectory: true
      };

      for await (const result of this.ipfs.addAll(this.getFiles(dirPath), addOptions)) {
        files.push({
          name: result.path,
          hash: result.cid.toString(),
          size: result.size,
          url: `${this.gateway}${result.cid.toString()}`
        });
      }

      return files;
    } catch (error) {
      console.error('IPFS directory upload error:', error);
      throw new Error(`Failed to upload directory to IPFS: ${error.message}`);
    }
  }

  private async* getFiles(dir: string): AsyncGenerator<{ path: string; content: Buffer }> {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        yield* this.getFiles(fullPath);
      } else {
        yield {
          path: path.relative(process.cwd(), fullPath),
          content: fs.readFileSync(fullPath)
        };
      }
    }
  }

  getFileUrl(hash: string): string {
    return `${this.gateway}${hash}`;
  }

  async getNodeInfo(): Promise<any> {
    try {
      return await this.ipfs.id();
    } catch (error) {
      console.error('IPFS node info error:', error);
      return null;
    }
  }
}

export const ipfsStorage = new IPFSStorageService();