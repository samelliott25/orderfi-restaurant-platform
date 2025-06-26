import { createSocket } from 'dgram';
import { Socket } from 'net';

export interface PrinterConfig {
  id: string;
  name: string;
  type: 'thermal' | 'impact' | 'kds' | 'cloud';
  connectionType: 'usb' | 'ethernet' | 'wifi' | 'cloud';
  ipAddress?: string;
  port?: number;
  apiKey?: string;
  model: string;
  status: 'connected' | 'disconnected' | 'error';
  enabled: boolean;
  isDefault: boolean;
}

export interface OrderData {
  id: string;
  customerName?: string;
  items: Array<{
    name: string;
    quantity: number;
    specialInstructions?: string;
    price: number;
  }>;
  total: number;
  orderTime: Date;
  specialInstructions?: string;
  tableNumber?: string;
  orderType: 'dine-in' | 'takeout' | 'delivery';
}

export class KitchenPrinterService {
  private printers: Map<string, PrinterConfig> = new Map();
  private activeConnections: Map<string, Socket> = new Map();

  constructor() {
    this.loadDefaultPrinters();
  }

  private loadDefaultPrinters() {
    const defaultPrinter: PrinterConfig = {
      id: '1',
      name: 'Kitchen Printer',
      type: 'thermal',
      connectionType: 'ethernet',
      ipAddress: '192.168.1.100',
      port: 9100,
      model: 'Epson TM-T88VI',
      status: 'disconnected',
      enabled: true,
      isDefault: true
    };
    this.printers.set(defaultPrinter.id, defaultPrinter);
  }

  // ESC/POS command generation
  private generateESCPOSCommands(orderData: OrderData): Buffer {
    const commands: number[] = [];
    
    // Initialize printer
    commands.push(0x1B, 0x40); // ESC @ - Initialize
    
    // Set character set
    commands.push(0x1B, 0x74, 0x01); // ESC t 1 - Select character code table
    
    // Header
    commands.push(0x1B, 0x61, 0x01); // ESC a 1 - Center alignment
    commands.push(0x1B, 0x45, 0x01); // ESC E 1 - Bold on
    this.addText(commands, "KITCHEN ORDER");
    commands.push(0x0A, 0x0A); // Double line feed
    
    // Order details
    commands.push(0x1B, 0x45, 0x00); // ESC E 0 - Bold off
    commands.push(0x1B, 0x61, 0x00); // ESC a 0 - Left alignment
    
    this.addText(commands, `Order #: ${orderData.id}`);
    commands.push(0x0A);
    
    this.addText(commands, `Time: ${orderData.orderTime.toLocaleString()}`);
    commands.push(0x0A);
    
    if (orderData.customerName) {
      this.addText(commands, `Customer: ${orderData.customerName}`);
      commands.push(0x0A);
    }
    
    if (orderData.tableNumber) {
      this.addText(commands, `Table: ${orderData.tableNumber}`);
      commands.push(0x0A);
    }
    
    this.addText(commands, `Type: ${orderData.orderType.toUpperCase()}`);
    commands.push(0x0A, 0x0A);
    
    // Separator line
    this.addText(commands, "--------------------------------");
    commands.push(0x0A);
    
    // Items
    commands.push(0x1B, 0x45, 0x01); // Bold on
    this.addText(commands, "ITEMS:");
    commands.push(0x1B, 0x45, 0x00); // Bold off
    commands.push(0x0A);
    
    orderData.items.forEach(item => {
      this.addText(commands, `${item.quantity}x ${item.name}`);
      commands.push(0x0A);
      
      if (item.specialInstructions) {
        this.addText(commands, `   * ${item.specialInstructions}`);
        commands.push(0x0A);
      }
    });
    
    // Special instructions
    if (orderData.specialInstructions) {
      commands.push(0x0A);
      this.addText(commands, "--------------------------------");
      commands.push(0x0A);
      commands.push(0x1B, 0x45, 0x01); // Bold on
      this.addText(commands, "SPECIAL INSTRUCTIONS:");
      commands.push(0x1B, 0x45, 0x00); // Bold off
      commands.push(0x0A);
      this.addText(commands, orderData.specialInstructions);
      commands.push(0x0A);
    }
    
    // Footer
    commands.push(0x0A);
    this.addText(commands, "--------------------------------");
    commands.push(0x0A);
    commands.push(0x1B, 0x61, 0x01); // Center alignment
    this.addText(commands, `Total: $${orderData.total.toFixed(2)}`);
    commands.push(0x0A, 0x0A, 0x0A);
    
    // Cut paper
    commands.push(0x1D, 0x56, 0x41, 0x10); // GS V A 16 - Partial cut
    
    return Buffer.from(commands);
  }

  private addText(commands: number[], text: string) {
    const buffer = Buffer.from(text, 'utf8');
    commands.push(...Array.from(buffer));
  }

  // Network printing via TCP/IP
  private async printToNetworkPrinter(printer: PrinterConfig, data: Buffer): Promise<boolean> {
    return new Promise((resolve) => {
      if (!printer.ipAddress || !printer.port) {
        console.error('Network printer missing IP address or port');
        resolve(false);
        return;
      }

      const socket = new Socket();
      let isResolved = false;

      const cleanup = () => {
        if (!isResolved) {
          isResolved = true;
          socket.destroy();
        }
      };

      socket.setTimeout(5000); // 5 second timeout

      socket.on('connect', () => {
        console.log(`Connected to printer ${printer.name} at ${printer.ipAddress}:${printer.port}`);
        socket.write(data);
        
        // Give some time for data to be sent
        setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            socket.end();
            resolve(true);
          }
        }, 1000);
      });

      socket.on('error', (error) => {
        console.error(`Network printer error for ${printer.name}:`, error.message);
        cleanup();
        resolve(false);
      });

      socket.on('timeout', () => {
        console.error(`Network printer timeout for ${printer.name}`);
        cleanup();
        resolve(false);
      });

      socket.on('close', () => {
        if (!isResolved) {
          isResolved = true;
          resolve(true);
        }
      });

      try {
        socket.connect(printer.port, printer.ipAddress);
      } catch (error) {
        console.error(`Failed to connect to printer ${printer.name}:`, error);
        cleanup();
        resolve(false);
      }
    });
  }

  // Cloud printing integration (PrintNode example)
  private async printToCloudService(printer: PrinterConfig, orderData: OrderData): Promise<boolean> {
    if (!printer.apiKey) {
      console.error('Cloud printer missing API key');
      return false;
    }

    try {
      // Example PrintNode integration
      const printContent = this.generatePlainTextReceipt(orderData);
      
      const response = await fetch('https://api.printnode.com/printjobs', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(printer.apiKey + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          printerId: printer.id,
          title: `Kitchen Order ${orderData.id}`,
          contentType: 'text/plain',
          content: printContent,
          source: 'OrderFi Kitchen'
        })
      });

      return response.ok;
    } catch (error) {
      console.error(`Cloud printing error for ${printer.name}:`, error);
      return false;
    }
  }

  private generatePlainTextReceipt(orderData: OrderData): string {
    let receipt = '';
    receipt += '        KITCHEN ORDER\n';
    receipt += '================================\n';
    receipt += `Order #: ${orderData.id}\n`;
    receipt += `Time: ${orderData.orderTime.toLocaleString()}\n`;
    
    if (orderData.customerName) {
      receipt += `Customer: ${orderData.customerName}\n`;
    }
    
    if (orderData.tableNumber) {
      receipt += `Table: ${orderData.tableNumber}\n`;
    }
    
    receipt += `Type: ${orderData.orderType.toUpperCase()}\n\n`;
    receipt += '--------------------------------\n';
    receipt += 'ITEMS:\n';
    
    orderData.items.forEach(item => {
      receipt += `${item.quantity}x ${item.name}\n`;
      if (item.specialInstructions) {
        receipt += `   * ${item.specialInstructions}\n`;
      }
    });
    
    if (orderData.specialInstructions) {
      receipt += '\n--------------------------------\n';
      receipt += 'SPECIAL INSTRUCTIONS:\n';
      receipt += `${orderData.specialInstructions}\n`;
    }
    
    receipt += '\n--------------------------------\n';
    receipt += `        Total: $${orderData.total.toFixed(2)}\n`;
    receipt += '\n\n\n';
    
    return receipt;
  }

  // Main print method
  async printOrder(orderData: OrderData, printerId?: string): Promise<boolean> {
    const targetPrinter = printerId 
      ? this.printers.get(printerId)
      : Array.from(this.printers.values()).find(p => p.isDefault && p.enabled);

    if (!targetPrinter) {
      console.error('No suitable printer found');
      return false;
    }

    if (!targetPrinter.enabled) {
      console.log(`Printer ${targetPrinter.name} is disabled`);
      return false;
    }

    console.log(`Printing order ${orderData.id} to ${targetPrinter.name}`);

    try {
      let success = false;

      switch (targetPrinter.connectionType) {
        case 'ethernet':
        case 'wifi':
          const escposData = this.generateESCPOSCommands(orderData);
          success = await this.printToNetworkPrinter(targetPrinter, escposData);
          break;

        case 'cloud':
          success = await this.printToCloudService(targetPrinter, orderData);
          break;

        case 'usb':
          // USB printing would require platform-specific drivers
          console.log('USB printing not yet implemented');
          success = false;
          break;

        default:
          console.error(`Unsupported connection type: ${targetPrinter.connectionType}`);
          success = false;
      }

      // Update printer status
      this.updatePrinterStatus(targetPrinter.id, success ? 'connected' : 'error');
      
      return success;
    } catch (error) {
      console.error(`Print error for printer ${targetPrinter.name}:`, error);
      this.updatePrinterStatus(targetPrinter.id, 'error');
      return false;
    }
  }

  // Test print functionality
  async testPrint(printerId: string): Promise<boolean> {
    const testOrder: OrderData = {
      id: 'TEST-' + Date.now(),
      customerName: 'Test Customer',
      items: [
        {
          name: 'Test Burger',
          quantity: 1,
          specialInstructions: 'No pickles',
          price: 12.99
        },
        {
          name: 'French Fries',
          quantity: 1,
          price: 4.99
        }
      ],
      total: 17.98,
      orderTime: new Date(),
      specialInstructions: 'This is a test order',
      tableNumber: '1',
      orderType: 'dine-in'
    };

    return this.printOrder(testOrder, printerId);
  }

  // Printer management
  addPrinter(config: PrinterConfig) {
    this.printers.set(config.id, config);
  }

  updatePrinter(id: string, updates: Partial<PrinterConfig>) {
    const printer = this.printers.get(id);
    if (printer) {
      this.printers.set(id, { ...printer, ...updates });
    }
  }

  deletePrinter(id: string) {
    this.printers.delete(id);
    // Close any active connections
    const connection = this.activeConnections.get(id);
    if (connection) {
      connection.destroy();
      this.activeConnections.delete(id);
    }
  }

  getPrinters(): PrinterConfig[] {
    return Array.from(this.printers.values());
  }

  getPrinter(id: string): PrinterConfig | undefined {
    return this.printers.get(id);
  }

  private updatePrinterStatus(id: string, status: 'connected' | 'disconnected' | 'error') {
    const printer = this.printers.get(id);
    if (printer) {
      printer.status = status;
      this.printers.set(id, printer);
    }
  }

  // Configuration persistence
  saveConfiguration(config: { printers: PrinterConfig[]; templates: any[] }) {
    this.printers.clear();
    config.printers.forEach(printer => {
      this.printers.set(printer.id, printer);
    });
    
    // In a real implementation, this would save to database
    console.log('Printer configuration saved');
    return true;
  }

  // Discover network printers (basic implementation)
  async discoverNetworkPrinters(): Promise<PrinterConfig[]> {
    const discoveredPrinters: PrinterConfig[] = [];
    
    // This is a simplified discovery - in production you'd use actual network discovery
    const commonPrinterIPs = [
      '192.168.1.100',
      '192.168.1.101', 
      '192.168.1.102',
      '192.168.0.100',
      '192.168.0.101'
    ];

    for (const ip of commonPrinterIPs) {
      try {
        const isReachable = await this.testConnection(ip, 9100);
        if (isReachable) {
          discoveredPrinters.push({
            id: `discovered-${ip}`,
            name: `Network Printer (${ip})`,
            type: 'thermal',
            connectionType: 'ethernet',
            ipAddress: ip,
            port: 9100,
            model: 'Unknown',
            status: 'connected',
            enabled: false,
            isDefault: false
          });
        }
      } catch (error) {
        // Continue to next IP
      }
    }

    return discoveredPrinters;
  }

  private testConnection(ip: string, port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new Socket();
      socket.setTimeout(2000);

      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });

      socket.on('error', () => {
        resolve(false);
      });

      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });

      socket.connect(port, ip);
    });
  }
}

// Singleton instance
export const kitchenPrinterService = new KitchenPrinterService();