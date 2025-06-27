import { OrderData } from './kitchen-printer';

export interface CloudPrintService {
  name: string;
  apiEndpoint: string;
  authMethod: 'api-key' | 'oauth' | 'basic';
  supportedFormats: string[];
}

export interface CloudPrinter {
  id: string;
  name: string;
  service: string;
  status: 'online' | 'offline' | 'error';
  capabilities: string[];
}

export class CloudPrinterService {
  private services: Map<string, CloudPrintService> = new Map([
    ['printnode', {
      name: 'PrintNode',
      apiEndpoint: 'https://api.printnode.com',
      authMethod: 'basic',
      supportedFormats: ['text/plain', 'application/pdf', 'image/png']
    }],
    ['google', {
      name: 'Google Cloud Print',
      apiEndpoint: 'https://www.google.com/cloudprint',
      authMethod: 'oauth',
      supportedFormats: ['text/plain', 'application/pdf']
    }],
    ['ezeep', {
      name: 'ezeep Blue',
      apiEndpoint: 'https://api.ezeep.com',
      authMethod: 'api-key',
      supportedFormats: ['text/plain', 'application/pdf', 'image/png']
    }]
  ]);

  // PrintNode Integration
  async printWithPrintNode(apiKey: string, printerId: string, orderData: OrderData): Promise<boolean> {
    try {
      const auth = Buffer.from(`${apiKey}:`).toString('base64');
      const printContent = this.generatePlainTextReceipt(orderData);

      const response = await fetch('https://api.printnode.com/printjobs', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          printerId: parseInt(printerId),
          title: `Kitchen Order ${orderData.id}`,
          contentType: 'text/plain',
          content: printContent,
          source: 'OrderFi Kitchen System'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`PrintNode job submitted: ${result.id}`);
        return true;
      } else {
        const error = await response.text();
        console.error('PrintNode error:', error);
        return false;
      }
    } catch (error) {
      console.error('PrintNode request failed:', error);
      return false;
    }
  }

  // Get PrintNode printers
  async getPrintNodePrinters(apiKey: string): Promise<CloudPrinter[]> {
    try {
      const auth = Buffer.from(`${apiKey}:`).toString('base64');
      const response = await fetch('https://api.printnode.com/printers', {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });

      if (response.ok) {
        const printers = await response.json();
        return printers.map((printer: any) => ({
          id: printer.id.toString(),
          name: printer.name,
          service: 'printnode',
          status: printer.state === 'online' ? 'online' : 'offline',
          capabilities: printer.capabilities || []
        }));
      }
    } catch (error) {
      console.error('Failed to fetch PrintNode printers:', error);
    }
    return [];
  }

  // ezeep Blue Integration
  async printWithEzeep(apiKey: string, printerId: string, orderData: OrderData): Promise<boolean> {
    try {
      const printContent = this.generatePlainTextReceipt(orderData);

      const response = await fetch(`https://api.ezeep.com/sfapi/print/${printerId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'text/plain'
        },
        body: printContent
      });

      return response.ok;
    } catch (error) {
      console.error('ezeep printing failed:', error);
      return false;
    }
  }

  // Get ezeep printers
  async getEzeepPrinters(apiKey: string): Promise<CloudPrinter[]> {
    try {
      const response = await fetch('https://api.ezeep.com/sfapi/printers', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (response.ok) {
        const printers = await response.json();
        return printers.map((printer: any) => ({
          id: printer.id,
          name: printer.name,
          service: 'ezeep',
          status: printer.status === 'ready' ? 'online' : 'offline',
          capabilities: []
        }));
      }
    } catch (error) {
      console.error('Failed to fetch ezeep printers:', error);
    }
    return [];
  }

  // Universal cloud print method
  async printToCloud(service: string, apiKey: string, printerId: string, orderData: OrderData): Promise<boolean> {
    switch (service) {
      case 'printnode':
        return this.printWithPrintNode(apiKey, printerId, orderData);
      case 'ezeep':
        return this.printWithEzeep(apiKey, printerId, orderData);
      default:
        console.error(`Unsupported cloud service: ${service}`);
        return false;
    }
  }

  // Get printers from all configured cloud services
  async getAllCloudPrinters(configs: Array<{ service: string; apiKey: string }>): Promise<CloudPrinter[]> {
    const allPrinters: CloudPrinter[] = [];

    for (const config of configs) {
      try {
        let printers: CloudPrinter[] = [];
        
        switch (config.service) {
          case 'printnode':
            printers = await this.getPrintNodePrinters(config.apiKey);
            break;
          case 'ezeep':
            printers = await this.getEzeepPrinters(config.apiKey);
            break;
        }
        
        allPrinters.push(...printers);
      } catch (error) {
        console.error(`Failed to fetch printers from ${config.service}:`, error);
      }
    }

    return allPrinters;
  }

  // Test cloud service connection
  async testCloudConnection(service: string, apiKey: string): Promise<boolean> {
    try {
      switch (service) {
        case 'printnode':
          const auth = Buffer.from(`${apiKey}:`).toString('base64');
          const response = await fetch('https://api.printnode.com/whoami', {
            headers: { 'Authorization': `Basic ${auth}` }
          });
          return response.ok;
        
        case 'ezeep':
          const ezeepResponse = await fetch('https://api.ezeep.com/sfapi/printers', {
            headers: { 'Authorization': `Bearer ${apiKey}` }
          });
          return ezeepResponse.ok;
        
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  private generatePlainTextReceipt(orderData: OrderData): string {
    let receipt = '';
    receipt += '================================\n';
    receipt += '         KITCHEN ORDER\n';
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
    receipt += `          Total: $${orderData.total.toFixed(2)}\n`;
    receipt += '================================\n\n\n';
    
    return receipt;
  }

  // Get supported cloud services
  getSupportedServices(): CloudPrintService[] {
    return Array.from(this.services.values());
  }

  // Validate API key format
  validateApiKey(service: string, apiKey: string): boolean {
    switch (service) {
      case 'printnode':
        return apiKey.length > 10 && !apiKey.includes(' ');
      case 'ezeep':
        return apiKey.startsWith('ez_') || apiKey.length > 20;
      default:
        return apiKey.length > 0;
    }
  }
}

export const cloudPrinterService = new CloudPrinterService();