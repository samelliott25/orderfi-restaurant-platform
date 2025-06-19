export interface ProcessedData {
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
  completionRate: number;
  ordersPerHour: number;
}

export class DataProcessor {
  static async processFile(file: File): Promise<ProcessedData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          let data: ProcessedData;
          
          if (file.name.endsWith('.csv')) {
            data = this.processCSV(text);
          } else if (file.name.endsWith('.json')) {
            data = this.processJSON(text);
          } else if (file.name.endsWith('.txt')) {
            data = this.processText(text);
          } else {
            // Default processing for Excel files or unknown formats
            data = this.processGenericData(text);
          }
          
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
  
  private static processCSV(csvText: string): ProcessedData {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    let totalOrders = 0;
    let totalRevenue = 0;
    let completedOrders = 0;
    let pendingOrders = 0;
    let cancelledOrders = 0;
    
    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      
      // Look for order status
      const statusIndex = headers.findIndex(h => h.includes('status'));
      const amountIndex = headers.findIndex(h => h.includes('amount') || h.includes('total') || h.includes('price') || h.includes('revenue'));
      
      totalOrders++;
      
      if (statusIndex >= 0) {
        const status = values[statusIndex]?.toLowerCase();
        if (status?.includes('complete') || status?.includes('done') || status?.includes('delivered')) {
          completedOrders++;
        } else if (status?.includes('pending') || status?.includes('processing')) {
          pendingOrders++;
        } else if (status?.includes('cancel') || status?.includes('refund')) {
          cancelledOrders++;
        }
      }
      
      if (amountIndex >= 0) {
        const amount = parseFloat(values[amountIndex]?.replace(/[^0-9.-]/g, '') || '0');
        if (!isNaN(amount)) {
          totalRevenue += amount;
        }
      }
    }
    
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    const ordersPerHour = totalOrders / 8; // Assume 8-hour day
    
    return {
      totalOrders,
      totalRevenue,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      averageOrderValue,
      completionRate,
      ordersPerHour
    };
  }
  
  private static processJSON(jsonText: string): ProcessedData {
    try {
      const data = JSON.parse(jsonText);
      
      // Handle different JSON structures
      if (Array.isArray(data)) {
        return this.processArrayData(data);
      } else if (data.orders || data.sales || data.transactions) {
        const orders = data.orders || data.sales || data.transactions;
        return this.processArrayData(orders);
      } else {
        // Single object with aggregated data
        return {
          totalOrders: data.totalOrders || data.total_orders || 0,
          totalRevenue: data.totalRevenue || data.total_revenue || data.revenue || 0,
          completedOrders: data.completedOrders || data.completed_orders || 0,
          pendingOrders: data.pendingOrders || data.pending_orders || 0,
          cancelledOrders: data.cancelledOrders || data.cancelled_orders || 0,
          averageOrderValue: data.averageOrderValue || data.average_order_value || 0,
          completionRate: data.completionRate || data.completion_rate || 0,
          ordersPerHour: data.ordersPerHour || data.orders_per_hour || 0
        };
      }
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }
  
  private static processArrayData(orders: any[]): ProcessedData {
    let totalOrders = orders.length;
    let totalRevenue = 0;
    let completedOrders = 0;
    let pendingOrders = 0;
    let cancelledOrders = 0;
    
    orders.forEach(order => {
      // Extract revenue
      const amount = order.amount || order.total || order.price || order.revenue || 0;
      totalRevenue += parseFloat(amount) || 0;
      
      // Extract status
      const status = (order.status || '').toLowerCase();
      if (status.includes('complete') || status.includes('done') || status.includes('delivered')) {
        completedOrders++;
      } else if (status.includes('pending') || status.includes('processing')) {
        pendingOrders++;
      } else if (status.includes('cancel') || status.includes('refund')) {
        cancelledOrders++;
      }
    });
    
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    const ordersPerHour = totalOrders / 8;
    
    return {
      totalOrders,
      totalRevenue,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      averageOrderValue,
      completionRate,
      ordersPerHour
    };
  }
  
  private static processText(text: string): ProcessedData {
    // Simple text parsing for basic metrics
    const lines = text.split('\n');
    let totalOrders = 0;
    let totalRevenue = 0;
    
    lines.forEach(line => {
      // Look for numbers that might represent orders or revenue
      const numbers = line.match(/\d+\.?\d*/g);
      if (numbers) {
        numbers.forEach(num => {
          const value = parseFloat(num);
          if (value > 1000) {
            totalRevenue += value; // Assume larger numbers are revenue
          } else if (value > 0 && value < 1000) {
            totalOrders += Math.floor(value); // Assume smaller numbers are order counts
          }
        });
      }
    });
    
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completedOrders = Math.floor(totalOrders * 0.8); // Assume 80% completion
    const pendingOrders = totalOrders - completedOrders;
    const completionRate = 80;
    const ordersPerHour = totalOrders / 8;
    
    return {
      totalOrders,
      totalRevenue,
      completedOrders,
      pendingOrders,
      cancelledOrders: 0,
      averageOrderValue,
      completionRate,
      ordersPerHour
    };
  }
  
  private static processGenericData(text: string): ProcessedData {
    // Extract any numeric data from unknown formats
    const numbers = text.match(/\d+\.?\d*/g) || [];
    const numericValues = numbers.map(n => parseFloat(n)).filter(n => !isNaN(n));
    
    if (numericValues.length === 0) {
      throw new Error('No numeric data found in file');
    }
    
    // Try to identify patterns
    const largeNumbers = numericValues.filter(n => n > 100);
    const smallNumbers = numericValues.filter(n => n > 0 && n <= 100);
    
    const totalRevenue = largeNumbers.reduce((sum, n) => sum + n, 0);
    const totalOrders = smallNumbers.length > 0 ? Math.max(...smallNumbers) : largeNumbers.length;
    const completedOrders = Math.floor(totalOrders * 0.85);
    const pendingOrders = totalOrders - completedOrders;
    
    return {
      totalOrders,
      totalRevenue,
      completedOrders,
      pendingOrders,
      cancelledOrders: 0,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
      ordersPerHour: totalOrders / 8
    };
  }
}