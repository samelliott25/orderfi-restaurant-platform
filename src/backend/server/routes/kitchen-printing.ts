import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { kitchenPrinterService, OrderData } from '../services/kitchen-printer';
import { usbPrinterService } from '../services/usb-printer';
import { cloudPrinterService } from '../services/cloud-printer';
import { printerDriverManager } from '../services/printer-driver-manager';

const router = Router();

// Validation schemas
const printerConfigSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: z.enum(['thermal', 'impact', 'kds', 'cloud']),
  connectionType: z.enum(['usb', 'ethernet', 'wifi', 'cloud']),
  ipAddress: z.string().optional(),
  port: z.number().optional(),
  apiKey: z.string().optional(),
  model: z.string(),
  status: z.enum(['connected', 'disconnected', 'error']),
  enabled: z.boolean(),
  isDefault: z.boolean()
});

const printOrderSchema = z.object({
  id: z.string(),
  customerName: z.string().optional(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().positive(),
    specialInstructions: z.string().optional(),
    price: z.number().positive()
  })),
  total: z.number().positive(),
  orderTime: z.string().datetime(),
  specialInstructions: z.string().optional(),
  tableNumber: z.string().optional(),
  orderType: z.enum(['dine-in', 'takeout', 'delivery'])
});

const configurationSchema = z.object({
  printers: z.array(printerConfigSchema),
  templates: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['receipt', 'kitchen', 'bar']),
    width: z.number(),
    fontSize: z.number(),
    includeCustomerInfo: z.boolean(),
    includeOrderTime: z.boolean(),
    includeSpecialInstructions: z.boolean(),
    headerText: z.string(),
    footerText: z.string()
  }))
});

// Get all configured printers
router.get('/printers', (req: Request, res: Response) => {
  try {
    const printers = kitchenPrinterService.getPrinters();
    res.json(printers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve printers' });
  }
});

// Get specific printer
router.get('/printers/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const printer = kitchenPrinterService.getPrinter(id);
    
    if (!printer) {
      return res.status(404).json({ error: 'Printer not found' });
    }
    
    res.json(printer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve printer' });
  }
});

// Add new printer
router.post('/printers', (req: Request, res: Response) => {
  try {
    const validatedData = printerConfigSchema.parse(req.body);
    kitchenPrinterService.addPrinter(validatedData);
    
    res.status(201).json({ 
      message: 'Printer added successfully',
      printer: validatedData 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid printer configuration',
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Failed to add printer' });
  }
});

// Update printer
router.put('/printers/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = printerConfigSchema.partial().parse(req.body);
    
    const existingPrinter = kitchenPrinterService.getPrinter(id);
    if (!existingPrinter) {
      return res.status(404).json({ error: 'Printer not found' });
    }
    
    kitchenPrinterService.updatePrinter(id, updates);
    
    res.json({ 
      message: 'Printer updated successfully',
      printer: { ...existingPrinter, ...updates }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid printer configuration',
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Failed to update printer' });
  }
});

// Delete printer
router.delete('/printers/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const existingPrinter = kitchenPrinterService.getPrinter(id);
    if (!existingPrinter) {
      return res.status(404).json({ error: 'Printer not found' });
    }
    
    kitchenPrinterService.deletePrinter(id);
    
    res.json({ message: 'Printer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete printer' });
  }
});

// Test print to specific printer
router.post('/test', async (req: Request, res: Response) => {
  try {
    const { printerId } = req.body;
    
    if (!printerId) {
      return res.status(400).json({ error: 'Printer ID is required' });
    }
    
    const printer = kitchenPrinterService.getPrinter(printerId);
    if (!printer) {
      return res.status(404).json({ error: 'Printer not found' });
    }
    
    const success = await kitchenPrinterService.testPrint(printerId);
    
    if (success) {
      res.json({ 
        message: 'Test print successful',
        printerId: printerId,
        printerName: printer.name
      });
    } else {
      res.status(500).json({ 
        error: 'Test print failed',
        printerId: printerId,
        printerName: printer.name
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Test print error occurred' });
  }
});

// Print order to kitchen
router.post('/print', async (req: Request, res: Response) => {
  try {
    const validatedOrder = printOrderSchema.parse(req.body);
    const { printerId } = req.body;
    
    // Convert string date to Date object
    const orderData: OrderData = {
      ...validatedOrder,
      orderTime: new Date(validatedOrder.orderTime)
    };
    
    const success = await kitchenPrinterService.printOrder(orderData, printerId);
    
    if (success) {
      res.json({ 
        message: 'Order printed successfully',
        orderId: orderData.id
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to print order',
        orderId: orderData.id
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid order data',
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Print order error occurred' });
  }
});

// Save printer configuration
router.post('/config', (req: Request, res: Response) => {
  try {
    const validatedConfig = configurationSchema.parse(req.body);
    
    const success = kitchenPrinterService.saveConfiguration(validatedConfig);
    
    if (success) {
      res.json({ message: 'Configuration saved successfully' });
    } else {
      res.status(500).json({ error: 'Failed to save configuration' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid configuration data',
        details: error.errors 
      });
    }
    res.status(500).json({ error: 'Configuration save error occurred' });
  }
});

// Discover network printers
router.get('/discover', async (req: Request, res: Response) => {
  try {
    const discoveredPrinters = await kitchenPrinterService.discoverNetworkPrinters();
    
    res.json({
      message: `Found ${discoveredPrinters.length} network printers`,
      printers: discoveredPrinters
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to discover network printers' });
  }
});

// Get printer status
router.get('/status', (req: Request, res: Response) => {
  try {
    const printers = kitchenPrinterService.getPrinters();
    const status = {
      totalPrinters: printers.length,
      activePrinters: printers.filter(p => p.enabled).length,
      connectedPrinters: printers.filter(p => p.status === 'connected').length,
      defaultPrinter: printers.find(p => p.isDefault)?.name || 'None',
      printers: printers.map(p => ({
        id: p.id,
        name: p.name,
        status: p.status,
        enabled: p.enabled,
        isDefault: p.isDefault
      }))
    };
    
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get printer status' });
  }
});

// Discover USB printers
router.get('/discover/usb', async (req: Request, res: Response) => {
  try {
    const usbPrinters = await usbPrinterService.discoverUSBPrinters();
    
    res.json({
      message: `Found ${usbPrinters.length} USB printers`,
      printers: usbPrinters
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to discover USB printers' });
  }
});

// Get cloud printers from configured services
router.post('/discover/cloud', async (req: Request, res: Response) => {
  try {
    const { services } = req.body; // Array of { service: string, apiKey: string }
    
    if (!Array.isArray(services)) {
      return res.status(400).json({ error: 'Services array is required' });
    }
    
    const cloudPrinters = await cloudPrinterService.getAllCloudPrinters(services);
    
    res.json({
      message: `Found ${cloudPrinters.length} cloud printers`,
      printers: cloudPrinters
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to discover cloud printers' });
  }
});

// Test cloud service connection
router.post('/test/cloud', async (req: Request, res: Response) => {
  try {
    const { service, apiKey } = req.body;
    
    if (!service || !apiKey) {
      return res.status(400).json({ error: 'Service and API key are required' });
    }
    
    const isValid = await cloudPrinterService.testCloudConnection(service, apiKey);
    
    if (isValid) {
      res.json({ message: 'Cloud service connection successful', service });
    } else {
      res.status(400).json({ error: 'Invalid API key or service unavailable', service });
    }
  } catch (error) {
    res.status(500).json({ error: 'Cloud service test failed' });
  }
});

// Get available printer drivers
router.get('/drivers', (req: Request, res: Response) => {
  try {
    const drivers = Array.from(printerDriverManager.getAvailableDrivers().entries()).map(([id, info]) => ({
      id,
      ...info
    }));
    
    res.json({ drivers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get driver information' });
  }
});

// Install printer driver
router.post('/drivers/:driverId/install', async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    
    const success = await printerDriverManager.installDriver(driverId);
    
    if (success) {
      res.json({ message: 'Driver installed successfully', driverId });
    } else {
      res.status(500).json({ error: 'Driver installation failed', driverId });
    }
  } catch (error) {
    res.status(500).json({ error: 'Driver installation error occurred' });
  }
});

// Auto-configure USB printer
router.post('/configure/usb', async (req: Request, res: Response) => {
  try {
    const { vendorId, productId, devicePath } = req.body;
    
    if (!vendorId || !productId || !devicePath) {
      return res.status(400).json({ error: 'Vendor ID, Product ID, and device path are required' });
    }
    
    const configured = await printerDriverManager.autoConfigurePrinter(vendorId, productId, devicePath);
    
    if (configured) {
      res.json({ 
        message: 'USB printer configured successfully',
        vendorId,
        productId,
        devicePath
      });
    } else {
      res.status(500).json({ error: 'USB printer configuration failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'USB configuration error occurred' });
  }
});

// Test USB printer connection
router.post('/test/usb', async (req: Request, res: Response) => {
  try {
    const { devicePath } = req.body;
    
    if (!devicePath) {
      return res.status(400).json({ error: 'Device path is required' });
    }
    
    const success = await usbPrinterService.testUSBConnection(devicePath);
    
    if (success) {
      res.json({ message: 'USB printer test successful', devicePath });
    } else {
      res.status(500).json({ error: 'USB printer test failed', devicePath });
    }
  } catch (error) {
    res.status(500).json({ error: 'USB test error occurred' });
  }
});

// Get supported printer models for reference
router.get('/models', (req: Request, res: Response) => {
  try {
    const usbModels = usbPrinterService.getSupportedModels();
    const cloudServices = cloudPrinterService.getSupportedServices();
    
    res.json({
      usb: usbModels,
      cloud: cloudServices,
      network: [
        { manufacturer: 'Epson', models: ['TM-T88VI', 'TM-T88VII', 'TM-U220'] },
        { manufacturer: 'Star', models: ['TSP143III', 'SP700'] },
        { manufacturer: 'Bixolon', models: ['SRP-350III', 'SRP-Q300'] }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get supported models' });
  }
});

export default router;