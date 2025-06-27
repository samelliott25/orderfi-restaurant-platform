import { Express } from "express";
import { z } from "zod";
import { workflowManager, type AutomationWorkflow } from "../automation/workflow-manager";

const createWorkflowSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  trigger: z.object({
    type: z.enum(['webhook', 'schedule', 'event']),
    config: z.any()
  }),
  actions: z.array(z.object({
    type: z.enum(['http_request', 'email', 'sms', 'slack', 'database', 'blockchain']),
    config: z.any(),
    retryCount: z.number().min(0).max(5).default(1)
  })),
  active: z.boolean().default(true)
});

export function registerAutomationRoutes(app: Express) {
  // Get all workflows
  app.get("/api/automation/workflows", (req, res) => {
    try {
      const workflows = workflowManager.getWorkflows();
      const stats = workflowManager.getExecutionStats();
      
      res.json({
        workflows,
        stats
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workflows" });
    }
  });

  // Get specific workflow
  app.get("/api/automation/workflows/:id", (req, res) => {
    try {
      const { id } = req.params;
      const workflow = workflowManager.getWorkflow(id);
      
      if (!workflow) {
        return res.status(404).json({ error: "Workflow not found" });
      }
      
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workflow" });
    }
  });

  // Create new workflow
  app.post("/api/automation/workflows", (req, res) => {
    try {
      const workflowData = createWorkflowSchema.parse(req.body);
      
      const workflow: AutomationWorkflow = {
        id: `workflow_${Date.now()}`,
        ...workflowData,
        trigger: {
          id: `trigger_${Date.now()}`,
          name: `${workflowData.name} Trigger`,
          ...workflowData.trigger,
          active: true,
          runCount: 0
        },
        actions: workflowData.actions.map((action, index) => ({
          id: `action_${Date.now()}_${index}`,
          ...action
        })),
        createdAt: Date.now(),
        executionCount: 0
      };
      
      const success = workflowManager.createWorkflow(workflow);
      
      if (success) {
        res.status(201).json(workflow);
      } else {
        res.status(400).json({ error: "Failed to create workflow" });
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid workflow data" });
    }
  });

  // Update workflow
  app.put("/api/automation/workflows/:id", (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const success = workflowManager.updateWorkflow(id, updates);
      
      if (success) {
        const updatedWorkflow = workflowManager.getWorkflow(id);
        res.json(updatedWorkflow);
      } else {
        res.status(404).json({ error: "Workflow not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update workflow" });
    }
  });

  // Delete workflow
  app.delete("/api/automation/workflows/:id", (req, res) => {
    try {
      const { id } = req.params;
      const success = workflowManager.deleteWorkflow(id);
      
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Workflow not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete workflow" });
    }
  });

  // Execute workflow manually
  app.post("/api/automation/workflows/:id/execute", async (req, res) => {
    try {
      const { id } = req.params;
      const triggerData = req.body;
      
      const success = await workflowManager.executeWorkflow(id, triggerData);
      
      if (success) {
        res.json({ success: true, message: "Workflow executed successfully" });
      } else {
        res.status(400).json({ error: "Failed to execute workflow" });
      }
    } catch (error) {
      res.status(500).json({ error: "Workflow execution failed" });
    }
  });

  // Webhook endpoints for workflow triggers
  app.post("/api/automation/webhooks/order-created", async (req, res) => {
    try {
      const orderData = req.body;
      
      const triggered = workflowManager.triggerWorkflow(
        '/api/automation/webhooks/order-created',
        {
          orderId: orderData.id,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          tableNumber: orderData.tableNumber,
          items: orderData.items,
          total: orderData.total,
          orderItems: JSON.parse(orderData.items || '[]')
        }
      );
      
      res.json({ triggered, message: "Order workflow triggered" });
    } catch (error) {
      res.status(500).json({ error: "Failed to trigger order workflow" });
    }
  });

  app.post("/api/automation/webhooks/payment-confirmed", async (req, res) => {
    try {
      const paymentData = req.body;
      
      const triggered = workflowManager.triggerWorkflow(
        '/api/automation/webhooks/payment-confirmed',
        {
          paymentId: paymentData.paymentId,
          orderId: paymentData.orderId,
          amount: paymentData.amount,
          paymentMethod: paymentData.paymentMethod,
          customerId: paymentData.customerId,
          customerEmail: paymentData.customerEmail
        }
      );
      
      res.json({ triggered, message: "Payment workflow triggered" });
    } catch (error) {
      res.status(500).json({ error: "Failed to trigger payment workflow" });
    }
  });

  app.post("/api/automation/webhooks/tier-upgraded", async (req, res) => {
    try {
      const tierData = req.body;
      
      const triggered = workflowManager.triggerWorkflow(
        '/api/automation/webhooks/tier-upgraded',
        {
          customerId: tierData.customerId,
          customerName: tierData.customerName,
          customerEmail: tierData.customerEmail,
          newTier: tierData.newTier,
          oldTier: tierData.oldTier,
          tierBonus: tierData.tierBonus || 100,
          benefits: tierData.benefits || []
        }
      );
      
      res.json({ triggered, message: "Tier upgrade workflow triggered" });
    } catch (error) {
      res.status(500).json({ error: "Failed to trigger tier upgrade workflow" });
    }
  });

  // Get workflow execution logs
  app.get("/api/automation/logs", (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const workflows = workflowManager.getWorkflows();
      
      const logs = workflows
        .filter(w => w.lastExecuted)
        .map(w => ({
          workflowId: w.id,
          workflowName: w.name,
          lastExecuted: w.lastExecuted,
          executionCount: w.executionCount,
          status: w.active ? 'active' : 'inactive'
        }))
        .sort((a, b) => (b.lastExecuted || 0) - (a.lastExecuted || 0))
        .slice(0, limit);
      
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  // Get automation dashboard stats
  app.get("/api/automation/dashboard", (req, res) => {
    try {
      const workflows = workflowManager.getWorkflows();
      const stats = workflowManager.getExecutionStats();
      
      const now = Date.now();
      const last24h = now - 24 * 60 * 60 * 1000;
      const last7d = now - 7 * 24 * 60 * 60 * 1000;
      
      const recentWorkflows = workflows.filter(w => 
        w.lastExecuted && w.lastExecuted > last24h
      );
      
      const weeklyWorkflows = workflows.filter(w => 
        w.lastExecuted && w.lastExecuted > last7d
      );
      
      const triggerTypes = workflows.reduce((acc, w) => {
        acc[w.trigger.type] = (acc[w.trigger.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      res.json({
        ...stats,
        recentExecutions24h: recentWorkflows.length,
        weeklyExecutions: weeklyWorkflows.reduce((sum, w) => sum + w.executionCount, 0),
        triggerTypeDistribution: triggerTypes,
        topWorkflows: workflows
          .sort((a, b) => b.executionCount - a.executionCount)
          .slice(0, 5)
          .map(w => ({
            name: w.name,
            executions: w.executionCount,
            lastRun: w.lastExecuted
          }))
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });
}