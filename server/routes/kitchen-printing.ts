import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { kitchenPrinterService, OrderData } from '../services/kitchen-printer';

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

export default router;