import fs from 'fs/promises';
import path from 'path';
import { PrinterConfig } from './kitchen-printer';

interface PrinterConfiguration {
  printers: PrinterConfig[];
  templates: PrintTemplate[];
  settings: {
    autoprint: boolean;
    retryAttempts: number;
    timeout: number;
  };
}

interface PrintTemplate {
  id: string;
  name: string;
  type: 'receipt' | 'kitchen' | 'bar';
  width: number;
  fontSize: number;
  includeCustomerInfo: boolean;
  includeOrderTime: boolean;
  includeSpecialInstructions: boolean;
  headerText: string;
  footerText: string;
}

export class PrinterConfigService {
  private configPath: string;
  private config: PrinterConfiguration;

  constructor() {
    this.configPath = path.join(process.cwd(), 'data', 'printer-config.json');
    this.config = this.getDefaultConfig();
    this.loadConfiguration();
  }

  private getDefaultConfig(): PrinterConfiguration {
    return {
      printers: [
        {
          id: '1',
          name: 'Main Kitchen Printer',
          type: 'thermal',
          connectionType: 'ethernet',
          ipAddress: '192.168.1.100',
          port: 9100,
          model: 'Epson TM-T88VI',
          status: 'disconnected',
          enabled: true,
          isDefault: true
        }
      ],
      templates: [
        {
          id: '1',
          name: 'Standard Kitchen Order',
          type: 'kitchen',
          width: 48,
          fontSize: 12,
          includeCustomerInfo: true,
          includeOrderTime: true,
          includeSpecialInstructions: true,
          headerText: 'KITCHEN ORDER',
          footerText: ''
        },
        {
          id: '2',
          name: 'Bar Order',
          type: 'bar',
          width: 32,
          fontSize: 10,
          includeCustomerInfo: false,
          includeOrderTime: true,
          includeSpecialInstructions: true,
          headerText: 'BAR ORDER',
          footerText: ''
        }
      ],
      settings: {
        autoprint: true,
        retryAttempts: 3,
        timeout: 5000
      }
    };
  }

  private async ensureConfigDirectory() {
    const dataDir = path.dirname(this.configPath);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
  }

  async loadConfiguration(): Promise<void> {
    try {
      await this.ensureConfigDirectory();
      const configData = await fs.readFile(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
      console.log('Printer configuration loaded successfully');
    } catch (error) {
      console.log('No existing printer configuration found, using defaults');
      await this.saveConfiguration();
    }
  }

  async saveConfiguration(): Promise<void> {
    try {
      await this.ensureConfigDirectory();
      await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
      console.log('Printer configuration saved successfully');
    } catch (error) {
      console.error('Failed to save printer configuration:', error);
      throw error;
    }
  }

  getConfiguration(): PrinterConfiguration {
    return this.config;
  }

  getPrinters(): PrinterConfig[] {
    return this.config.printers;
  }

  getTemplates(): PrintTemplate[] {
    return this.config.templates;
  }

  getSettings() {
    return this.config.settings;
  }

  updateConfiguration(newConfig: PrinterConfiguration): void {
    this.config = newConfig;
  }

  addPrinter(printer: PrinterConfig): void {
    this.config.printers.push(printer);
  }

  updatePrinter(id: string, updates: Partial<PrinterConfig>): void {
    const index = this.config.printers.findIndex(p => p.id === id);
    if (index !== -1) {
      this.config.printers[index] = { ...this.config.printers[index], ...updates };
    }
  }

  deletePrinter(id: string): void {
    this.config.printers = this.config.printers.filter(p => p.id !== id);
  }

  addTemplate(template: PrintTemplate): void {
    this.config.templates.push(template);
  }

  updateTemplate(id: string, updates: Partial<PrintTemplate>): void {
    const index = this.config.templates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.config.templates[index] = { ...this.config.templates[index], ...updates };
    }
  }

  deleteTemplate(id: string): void {
    this.config.templates = this.config.templates.filter(t => t.id !== id);
  }

  updateSettings(settings: Partial<typeof this.config.settings>): void {
    this.config.settings = { ...this.config.settings, ...settings };
  }
}

export const printerConfigService = new PrinterConfigService();