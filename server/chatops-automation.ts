import OpenAI from "openai";
import { storage } from "./storage";
import type { MenuItem } from "../shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// System Prompt for ChatOps Automation
const systemPrompt = `
You are ChatOps, the autonomous AI agent powering the inventory management of OrderFi. 
Your mission: fully automate inventory, purchase-order, invoicing and reporting:
• Monitor stock levels & auto-create POs when items dip below their reorder thresholds.
• When a PO status flips to "received", auto-generate & email a supplier invoice.
• Schedule & send daily_sales, weekly_inventory, and monthly_payables reports.
• Log every action in Recent Activity and push notifications via email or Slack.

Use ONLY the defined functions. After each call, reply with a concise confirmation message.
`;

// Function Schemas for ChatOps
const functions = [
  {
    name: "list_low_stock",
    description: "Return all items below their reorder threshold for a restaurant.",
    parameters: {
      type: "object",
      properties: {
        restaurantId: { type: "number" }
      },
      required: ["restaurantId"]
    }
  },
  {
    name: "create_purchase_order",
    description: "Create a purchase order for a supplier when stock is low.",
    parameters: {
      type: "object",
      properties: {
        itemId: { type: "number" },
        quantity: { type: "integer" },
        supplierId: { type: "string" },
        unitCost: { type: "number" }
      },
      required: ["itemId", "quantity", "supplierId", "unitCost"]
    }
  },
  {
    name: "generate_invoice",
    description: "Generate and email an invoice for a received purchase order.",
    parameters: {
      type: "object",
      properties: {
        supplierId: { type: "string" },
        poId: { type: "string" },
        amount: { type: "number" }
      },
      required: ["supplierId", "poId", "amount"]
    }
  },
  {
    name: "generate_report",
    description: "Compile a report and email it to stakeholders.",
    parameters: {
      type: "object",
      properties: {
        report_type: { type: "string", enum: ["daily_sales", "weekly_inventory", "monthly_payables"] },
        email_to: { type: "string", format: "email" },
        restaurantId: { type: "number" }
      },
      required: ["report_type", "email_to", "restaurantId"]
    }
  },
  {
    name: "record_payment",
    description: "Record a payment against an invoice.",
    parameters: {
      type: "object",
      properties: {
        invoiceId: { type: "string" },
        amount: { type: "number" },
        paymentMethod: { type: "string", enum: ["bank", "crypto", "card"] }
      },
      required: ["invoiceId", "amount", "paymentMethod"]
    }
  },
  {
    name: "update_stock_levels",
    description: "Update stock levels when inventory is received.",
    parameters: {
      type: "object",
      properties: {
        itemId: { type: "number" },
        quantityReceived: { type: "integer" },
        newStockLevel: { type: "integer" }
      },
      required: ["itemId", "quantityReceived", "newStockLevel"]
    }
  }
];

// Function Implementations
async function list_low_stock(params: { restaurantId: number }) {
  const menuItems = await storage.getMenuItems(params.restaurantId);
  const lowStockItems = menuItems.filter((item: MenuItem) => {
    if (!item.trackInventory) return false;
    const currentStock = item.currentStock || 0;
    const threshold = item.lowStockThreshold || 10;
    return currentStock < threshold;
  });
  
  return {
    success: true,
    lowStockItems: lowStockItems.map(item => ({
      id: item.id,
      name: item.name,
      currentStock: item.currentStock || 0,
      threshold: item.lowStockThreshold || 10,
      unitOfMeasure: item.unitOfMeasure || 'unit',
      supplier: item.supplier || 'Unknown',
      unitCost: item.purchaseUnitCost || 0
    }))
  };
}

async function create_purchase_order(params: { itemId: number; quantity: number; supplierId: string; unitCost: number }) {
  const item = await storage.getMenuItem(params.itemId);
  if (!item) {
    return { success: false, error: "Item not found" };
  }

  const poId = `PO-${Date.now()}-${params.itemId}`;
  const totalCost = params.quantity * params.unitCost;
  
  // Store PO in database (you'd extend schema for this)
  const purchaseOrder = {
    id: poId,
    itemId: params.itemId,
    itemName: item.name,
    quantity: params.quantity,
    unitCost: params.unitCost,
    totalCost,
    supplierId: params.supplierId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  // For now, just log it (you'd save to database)
  console.log('Purchase Order Created:', purchaseOrder);
  
  return {
    success: true,
    poId,
    message: `Purchase order ${poId} created for ${params.quantity} ${item.unitOfMeasure || 'units'} of ${item.name}`
  };
}

async function generate_invoice(params: { supplierId: string; poId: string; amount: number }) {
  const invoiceId = `INV-${Date.now()}-${params.supplierId}`;
  
  const invoice = {
    id: invoiceId,
    supplierId: params.supplierId,
    poId: params.poId,
    amount: params.amount,
    status: 'pending',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    createdAt: new Date().toISOString()
  };

  // Log invoice creation (you'd save to database and send email)
  console.log('Invoice Generated:', invoice);
  
  return {
    success: true,
    invoiceId,
    message: `Invoice ${invoiceId} generated for supplier ${params.supplierId}`
  };
}

async function generate_report(params: { report_type: string; email_to: string; restaurantId: number }) {
  const reportId = `RPT-${Date.now()}-${params.report_type}`;
  
  let reportData;
  switch (params.report_type) {
    case 'daily_sales':
      // Get today's sales data
      reportData = await generateDailySalesReport(params.restaurantId);
      break;
    case 'weekly_inventory':
      // Get weekly inventory summary
      reportData = await generateWeeklyInventoryReport(params.restaurantId);
      break;
    case 'monthly_payables':
      // Get monthly payables summary
      reportData = await generateMonthlyPayablesReport(params.restaurantId);
      break;
    default:
      return { success: false, error: "Unknown report type" };
  }

  console.log(`Report Generated: ${reportId}`, reportData);
  
  return {
    success: true,
    reportId,
    message: `${params.report_type} report generated and sent to ${params.email_to}`
  };
}

async function record_payment(params: { invoiceId: string; amount: number; paymentMethod: string }) {
  const paymentId = `PAY-${Date.now()}-${params.invoiceId}`;
  
  const payment = {
    id: paymentId,
    invoiceId: params.invoiceId,
    amount: params.amount,
    paymentMethod: params.paymentMethod,
    processedAt: new Date().toISOString()
  };

  console.log('Payment Recorded:', payment);
  
  return {
    success: true,
    paymentId,
    message: `Payment of $${params.amount} recorded for invoice ${params.invoiceId}`
  };
}

async function update_stock_levels(params: { itemId: number; quantityReceived: number; newStockLevel: number }) {
  await storage.updateMenuItem(params.itemId, {
    currentStock: params.newStockLevel
  });
  
  return {
    success: true,
    message: `Stock updated: ${params.quantityReceived} units received, new level: ${params.newStockLevel}`
  };
}

// Report Generators
async function generateDailySalesReport(restaurantId: number) {
  const menuItems = await storage.getMenuItems(restaurantId);
  const orders = await storage.getOrdersByRestaurant(restaurantId);
  
  // Filter today's orders
  const today = new Date().toDateString();
  const todayOrders = orders.filter(order => 
    new Date(order.createdAt).toDateString() === today
  );
  
  const totalRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = todayOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  return {
    date: today,
    totalRevenue,
    totalOrders,
    avgOrderValue,
    topItems: [] // You'd calculate top-selling items
  };
}

async function generateWeeklyInventoryReport(restaurantId: number) {
  const menuItems = await storage.getMenuItems(restaurantId);
  
  const lowStockItems = menuItems.filter(item => {
    if (!item.trackInventory) return false;
    const currentStock = item.currentStock || 0;
    const threshold = item.lowStockThreshold || 10;
    return currentStock < threshold;
  });
  
  const totalItems = menuItems.length;
  const trackedItems = menuItems.filter(item => item.trackInventory).length;
  const totalValue = menuItems.reduce((sum, item) => {
    if (!item.trackInventory) return sum;
    return sum + ((item.currentStock || 0) * (item.purchaseUnitCost || 0));
  }, 0);
  
  return {
    week: new Date().toISOString().slice(0, 10),
    totalItems,
    trackedItems,
    lowStockCount: lowStockItems.length,
    totalInventoryValue: totalValue,
    lowStockItems
  };
}

async function generateMonthlyPayablesReport(restaurantId: number) {
  // This would query your invoices/payables data
  return {
    month: new Date().toISOString().slice(0, 7),
    totalPayables: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0
  };
}

// Main ChatOps function
export async function callChatOps(userMessage: string, restaurantId: number = 1) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      functions,
      function_call: "auto"
    });

    const message = response.choices[0].message;
    
    if (message.function_call) {
      const { name, arguments: args } = message.function_call;
      const parsedArgs = JSON.parse(args);
      
      // Add restaurantId to params if not provided
      if (!parsedArgs.restaurantId) {
        parsedArgs.restaurantId = restaurantId;
      }
      
      let result;
      switch (name) {
        case 'list_low_stock':
          result = await list_low_stock(parsedArgs);
          break;
        case 'create_purchase_order':
          result = await create_purchase_order(parsedArgs);
          break;
        case 'generate_invoice':
          result = await generate_invoice(parsedArgs);
          break;
        case 'generate_report':
          result = await generate_report(parsedArgs);
          break;
        case 'record_payment':
          result = await record_payment(parsedArgs);
          break;
        case 'update_stock_levels':
          result = await update_stock_levels(parsedArgs);
          break;
        default:
          result = { success: false, error: `Unknown function: ${name}` };
      }
      
      return {
        success: true,
        action: name,
        result,
        message: `Executed ${name}: ${result.message || JSON.stringify(result)}`
      };
    }
    
    return {
      success: true,
      message: message.content
    };
    
  } catch (error) {
    console.error('ChatOps Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Auto-monitoring function to check for low stock
export async function autoMonitorStock(restaurantId: number = 1) {
  const result = await callChatOps(
    "Check for any items with low stock levels and create purchase orders if needed",
    restaurantId
  );
  return result;
}