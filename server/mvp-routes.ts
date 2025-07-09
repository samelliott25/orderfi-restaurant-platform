import { Router } from 'express';
import { z } from 'zod';
// Mock storage for MVP (replace with DatabaseStorage for production)
class MockStorage {
  private orders = new Map<number, any>();
  private orderCounter = 1;
  
  async createOrder(orderData: any) {
    const order = {
      id: this.orderCounter++,
      ...orderData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.orders.set(order.id, order);
    return order;
  }
  
  async getOrder(id: number) {
    return this.orders.get(id);
  }
  
  async updateOrderStatus(id: number, status: string) {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      order.updated_at = new Date().toISOString();
      this.orders.set(id, order);
    }
    return order;
  }
  
  async getMenuItems(restaurantId: number) {
    // Return mock menu items for MVP
    return [
      { id: 1, name: 'Classic Burger', description: 'Juicy beef patty with lettuce, tomato, onion', price: 12.99, category: 'Burgers', image_url: null, voice_aliases: ['burger', 'classic'] },
      { id: 2, name: 'Buffalo Wings', description: 'Crispy wings with spicy buffalo sauce', price: 9.99, category: 'Buffalo Wings', image_url: null, voice_aliases: ['wings', 'buffalo'] },
      { id: 3, name: 'Chicken Tacos', description: 'Grilled chicken with fresh salsa and cilantro', price: 8.99, category: 'Tacos', image_url: null, voice_aliases: ['tacos', 'chicken'] },
      { id: 4, name: 'Loaded Nachos', description: 'Tortilla chips with cheese, jalapeños, and sour cream', price: 7.99, category: 'Bar Snacks', image_url: null, voice_aliases: ['nachos', 'chips'] }
    ];
  }
  
  async createUser(userData: any) {
    return { id: Math.floor(Math.random() * 1000), ...userData };
  }
  
  async getUserByWallet(walletAddress: string) {
    return null; // For MVP, always create new user
  }
}

const router = Router();
const storage = new MockStorage();

// Session management
const sessions = new Map<string, {
  id: string;
  userId?: number;
  tableId: string;
  isGuest: boolean;
  createdAt: Date;
}>();

// Cart management (in-memory for MVP)
const carts = new Map<string, Array<{
  id: number;
  name: string;
  price_cents: number;
  quantity: number;
  modifiers: Array<{
    id: number;
    name: string;
    price_delta: number;
  }>;
}>>();

// Wallet login
router.post('/api/login/wallet', async (req, res) => {
  try {
    const { walletAddress, tableId } = req.body;
    
    // Create or get user
    let user = await storage.getUserByWallet?.(walletAddress);
    if (!user) {
      user = await storage.createUser?.({
        wallet_address: walletAddress,
        is_guest: false
      });
    }

    // Create session
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessions.set(sessionId, {
      id: sessionId,
      userId: user?.id,
      tableId: tableId || 'table-1',
      isGuest: false,
      createdAt: new Date()
    });

    res.json({ sessionId, userId: user?.id });
  } catch (error) {
    console.error('Wallet login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Guest login
router.post('/api/login/guest', async (req, res) => {
  try {
    const { tableId } = req.body;
    
    // Create guest user
    const user = await storage.createUser?.({
      wallet_address: null,
      is_guest: true
    });

    // Create session
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessions.set(sessionId, {
      id: sessionId,
      userId: user?.id,
      tableId: tableId || 'table-1',
      isGuest: true,
      createdAt: new Date()
    });

    res.json({ sessionId, userId: user?.id });
  } catch (error) {
    console.error('Guest login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get categories
router.get('/api/categories', async (req, res) => {
  try {
    // For MVP, return hardcoded categories based on existing menu structure
    const categories = [
      { id: 1, name: 'Bar Snacks', position: 1 },
      { id: 2, name: 'Buffalo Wings', position: 2 },
      { id: 3, name: 'Burgers', position: 3 },
      { id: 4, name: 'Tacos', position: 4 }
    ];
    
    res.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category items
router.get('/api/categories/:categoryId/items', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const restaurantId = 1; // Default restaurant for MVP
    
    // Get all menu items and filter by category
    const allItems = await storage.getMenuItems(restaurantId);
    
    // Map categories to menu item categories
    const categoryMap: { [key: string]: string[] } = {
      '1': ['Bar Snacks'],
      '2': ['Buffalo Wings'],
      '3': ['Burgers'],
      '4': ['Tacos']
    };
    
    const targetCategories = categoryMap[categoryId] || [];
    const filteredItems = allItems.filter(item => 
      targetCategories.includes(item.category || '')
    );
    
    // Transform to MVP format
    const items = filteredItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price_cents: Math.round((item.price || 0) * 100),
      image_url: item.image_url,
      voice_aliases: item.voice_aliases || [],
      modifiers: [] // Add modifiers in v2
    }));
    
    res.json(items);
  } catch (error) {
    console.error('Category items error:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Cart management
router.get('/api/cart', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] as string;
    const cart = carts.get(sessionId) || [];
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
});

router.post('/api/cart', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] as string;
    const { items } = req.body;
    
    carts.set(sessionId, items);
    res.json({ success: true });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.delete('/api/cart', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] as string;
    carts.delete(sessionId);
    res.json({ success: true });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Checkout
router.post('/api/checkout', async (req, res) => {
  try {
    const { sessionId, cart, customerInfo, total, subtotal, tax, tip } = req.body;
    
    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Create Stripe payment intent (requires Stripe setup)
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'usd',
      metadata: {
        sessionId,
        tableId: session.tableId,
        customerName: customerInfo.name
      }
    });

    // Create order in database
    const order = await storage.createOrder({
      restaurant_id: 1,
      customer_id: session.userId?.toString() || 'guest',
      status: 'pending',
      total: total / 100,
      items: cart,
      customer_info: customerInfo,
      table_id: session.tableId,
      payment_intent_id: paymentIntent.id
    });

    // Clear cart
    carts.delete(sessionId);

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// Order status
router.get('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await storage.getOrder(parseInt(orderId));
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Order status error:', error);
    res.status(500).json({ error: 'Failed to get order status' });
  }
});

// Order feedback
router.post('/api/orders/:orderId/feedback', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating } = req.body;
    
    // Update order with feedback (extend storage interface in v2)
    // For now, just log it
    console.log(`Order ${orderId} feedback: ${rating} stars`);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

export { router as mvpRoutes };