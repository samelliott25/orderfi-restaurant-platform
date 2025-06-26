import { spawn, exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { OrderData } from './kitchen-printer';

export interface USBPrinterDevice {
  vendorId: string;
  productId: string;
  devicePath: string;
  manufacturer?: string;
  product?: string;
  serialNumber?: string;
}

export class USBPrinterService {
  private supportedPrinters = new Map([
    // Epson printers
    ['04b8:0202', { name: 'Epson TM-T88V', driver: 'epson' }],
    ['04b8:0207', { name: 'Epson TM-T88VI', driver: 'epson' }],
    ['04b8:0208', { name: 'Epson TM-T88VII', driver: 'epson' }],
    ['04b8:0205', { name: 'Epson TM-U220', driver: 'epson' }],
    
    // Star printers
    ['0519:0001', { name: 'Star TSP143', driver: 'star' }],
    ['0519:0007', { name: 'Star TSP143III', driver: 'star' }],
    ['0519:0020', { name: 'Star SP700', driver: 'star' }],
    
    // Bixolon printers
    ['1504:0006', { name: 'Bixolon SRP-350III', driver: 'bixolon' }],
    ['1504:0011', { name: 'Bixolon SRP-Q300', driver: 'bixolon' }]
  ]);

  constructor() {
    this.initializeUSBSupport();
  }

  private async initializeUSBSupport() {
    // Check if we're on Linux and can access USB devices
    try {
      await fs.access('/dev/usb');
      console.log('USB device access available');
    } catch {
      console.log('USB device access limited - may require elevated permissions');
    }
  }

  // Discover USB printers using lsusb (Linux) or system_profiler (macOS)
  async discoverUSBPrinters(): Promise<USBPrinterDevice[]> {
    const devices: USBPrinterDevice[] = [];

    try {
      if (process.platform === 'linux') {
        devices.push(...await this.discoverLinuxUSB());
      } else if (process.platform === 'darwin') {
        devices.push(...await this.discoverMacUSB());
      } else if (process.platform === 'win32') {
        devices.push(...await this.discoverWindowsUSB());
      }
    } catch (error) {
      console.error('USB discovery error:', error);
    }

    return devices.filter(device => 
      this.supportedPrinters.has(`${device.vendorId}:${device.productId}`)
    );
  }

  private async discoverLinuxUSB(): Promise<USBPrinterDevice[]> {
    return new Promise((resolve) => {
      exec('lsusb -v 2>/dev/null | grep -E "(idVendor|idProduct|iManufacturer|iProduct|iSerial)"', 
        (error, stdout) => {
          if (error) {
            resolve([]);
            return;
          }

          const devices: USBPrinterDevice[] = [];
          const lines = stdout.split('\n');
          let currentDevice: Partial<USBPrinterDevice> = {};

          for (const line of lines) {
            if (line.includes('idVendor')) {
              const match = line.match(/0x([0-9a-f]{4})/i);
              if (match) currentDevice.vendorId = match[1];
            } else if (line.includes('idProduct')) {
              const match = line.match(/0x([0-9a-f]{4})/i);
              if (match) {
                currentDevice.productId = match[1];
                currentDevice.devicePath = `/dev/usb/lp0`; // Default USB printer path
                devices.push(currentDevice as USBPrinterDevice);
                currentDevice = {};
              }
            }
          }

          resolve(devices);
        }
      );
    });
  }

  private async discoverMacUSB(): Promise<USBPrinterDevice[]> {
    return new Promise((resolve) => {
      exec('system_profiler SPUSBDataType 2>/dev/null', (error, stdout) => {
        if (error) {
          resolve([]);
          return;
        }

        const devices: USBPrinterDevice[] = [];
        // Parse macOS USB output - simplified implementation
        resolve(devices);
      });
    });
  }

  private async discoverWindowsUSB(): Promise<USBPrinterDevice[]> {
    return new Promise((resolve) => {
      exec('wmic path win32_pnpentity where "service=\'usbprint\'" get deviceid,name', 
        (error, stdout) => {
          if (error) {
            resolve([]);
            return;
          }

          const devices: USBPrinterDevice[] = [];
          // Parse Windows USB output - simplified implementation
          resolve(devices);
        }
      );
    });
  }

  // Print to USB device using raw device access
  async printToUSB(devicePath: string, data: Buffer): Promise<boolean> {
    try {
      // For Linux systems with direct device access
      if (process.platform === 'linux') {
        await fs.writeFile(devicePath, data);
        return true;
      }

      // For other platforms, use lp command if available
      return await this.printViaLPCommand(data);
    } catch (error) {
      console.error('USB print error:', error);
      return false;
    }
  }

  private async printViaLPCommand(data: Buffer): Promise<boolean> {
    return new Promise((resolve) => {
      const lp = spawn('lp', ['-d', 'usb-printer', '-o', 'raw']);
      
      lp.stdin.write(data);
      lp.stdin.end();

      lp.on('close', (code) => {
        resolve(code === 0);
      });

      lp.on('error', () => {
        resolve(false);
      });
    });
  }

  // Install CUPS printer driver (Linux)
  async installCUPSDriver(device: USBPrinterDevice): Promise<boolean> {
    if (process.platform !== 'linux') {
      console.log('CUPS driver installation only supported on Linux');
      return false;
    }

    const printerInfo = this.supportedPrinters.get(`${device.vendorId}:${device.productId}`);
    if (!printerInfo) {
      console.log('Unsupported printer for automatic driver installation');
      return false;
    }

    try {
      // Add printer to CUPS
      const printerName = `orderfi-${device.vendorId}-${device.productId}`;
      const addPrinterCmd = `lpadmin -p ${printerName} -E -v usb://${device.devicePath} -m raw`;
      
      return new Promise((resolve) => {
        exec(addPrinterCmd, (error) => {
          if (error) {
            console.error('CUPS printer installation failed:', error);
            resolve(false);
          } else {
            console.log(`CUPS printer ${printerName} installed successfully`);
            resolve(true);
          }
        });
      });
    } catch (error) {
      console.error('CUPS installation error:', error);
      return false;
    }
  }

  // Get printer capabilities and status
  async getPrinterStatus(devicePath: string): Promise<{ online: boolean; paperOut: boolean; error?: string }> {
    try {
      // Send status inquiry command (ESC/POS)
      const statusCmd = Buffer.from([0x10, 0x04, 0x01]); // DLE EOT 1 - Paper sensor status
      
      // This is a simplified implementation - real implementation would need bidirectional communication
      return {
        online: true,
        paperOut: false
      };
    } catch (error) {
      return {
        online: false,
        paperOut: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Test USB printer connection
  async testUSBConnection(devicePath: string): Promise<boolean> {
    try {
      const initCmd = Buffer.from([0x1B, 0x40]); // ESC @ - Initialize
      const textData = Buffer.from('USB TEST PRINT\n');
      const feedCmd = Buffer.from([0x1B, 0x64, 0x03]); // ESC d 3 - Feed 3 lines
      const testData = Buffer.concat([initCmd, textData, feedCmd]);

      return await this.printToUSB(devicePath, testData);
    } catch (error) {
      console.error('USB test failed:', error);
      return false;
    }
  }

  // Get supported printer models
  getSupportedModels(): Array<{ vendorId: string; productId: string; name: string; driver: string }> {
    return Array.from(this.supportedPrinters.entries()).map(([id, info]) => {
      const [vendorId, productId] = id.split(':');
      return {
        vendorId,
        productId,
        name: info.name,
        driver: info.driver
      };
    });
  }
}

export const usbPrinterService = new USBPrinterService();