import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage.js';
import { insertOrderSchema } from '../../shared/schema.js';

const router = Router();

// Create new order
router.post('/', async (req, res) => {
  try {
    const orderData = insertOrderSchema.parse(req.body);
    const order = await storage.createOrder(orderData);
    res.json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({ 
      error: error instanceof z.ZodError ? 'Invalid order data' : 'Failed to create order' 
    });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const order = await storage.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

// Get orders by restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId);
    if (isNaN(restaurantId)) {
      return res.status(400).json({ error: 'Invalid restaurant ID' });
    }

    const orders = await storage.getOrdersByRestaurant(restaurantId);
    res.json(orders);
  } catch (error) {
    console.error('Get restaurant orders error:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    if (!['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if order exists
    const existingOrder = await storage.getOrder(orderId);
    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order (assuming we add updateOrder method to storage interface)
    const updated = { ...existingOrder, status };
    res.json(updated);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;