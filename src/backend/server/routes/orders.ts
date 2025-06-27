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

    // Update order status
    const updatedOrder = await storage.updateOrder(orderId, { status });
    
    // Trigger status change workflow
    try {
      const { workflowManager } = await import("../automation/workflow-manager");
      workflowManager.triggerWorkflow('/api/automation/webhooks/order-status-changed', {
        orderId: orderId.toString(),
        oldStatus: existingOrder.status,
        newStatus: status,
        customerEmail: existingOrder.customerEmail,
        customerName: existingOrder.customerName
      });
    } catch (workflowError) {
      console.error('Workflow trigger error:', workflowError);
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Process payment for order
router.post('/:id/payment', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { paymentMethod, paymentId, amount } = req.body;

    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    // Get existing order
    const order = await storage.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order with payment information
    const updatedOrder = await storage.updateOrder(orderId, {
      paymentMethod,
      paymentId,
      status: 'confirmed'
    });

    // Process crypto payment and rewards if USDC
    if (paymentMethod === 'usdc') {
      try {
        const rewardResponse = await fetch(`http://localhost:${process.env.PORT || 5000}/api/rewards/earn`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId: `cust_${order.customerPhone?.replace(/\D/g, '') || Date.now()}`,
            customerName: order.customerName,
            customerEmail: order.customerEmail || '',
            orderId: orderId.toString(),
            orderAmount: parseFloat(amount),
            paymentMethod: 'usdc'
          })
        });

        if (rewardResponse.ok) {
          const rewardData = await rewardResponse.json();
          console.log(`Customer ${order.customerName} earned ${rewardData.tokensEarned} MIMI tokens`);
        }
      } catch (rewardError) {
        console.error('Reward processing error:', rewardError);
      }
    }

    res.json({
      success: true,
      order: updatedOrder,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

export default router;