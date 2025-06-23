interface WorkflowTrigger {
  id: string;
  name: string;
  type: 'webhook' | 'schedule' | 'event';
  config: any;
  active: boolean;
  lastRun?: number;
  runCount: number;
}

interface WorkflowAction {
  id: string;
  type: 'http_request' | 'email' | 'sms' | 'slack' | 'database' | 'blockchain';
  config: any;
  retryCount: number;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  active: boolean;
  createdAt: number;
  lastExecuted?: number;
  executionCount: number;
}

class WorkflowManager {
  private workflows = new Map<string, AutomationWorkflow>();
  private scheduledJobs = new Map<string, any>();

  constructor() {
    this.initializeDefaultWorkflows();
  }

  private initializeDefaultWorkflows() {
    // Order Confirmation Workflow
    this.createWorkflow({
      id: 'order_confirmation',
      name: 'Order Confirmation Automation',
      description: 'Send confirmation emails and update systems when new orders arrive',
      trigger: {
        id: 'order_webhook',
        name: 'New Order Trigger',
        type: 'webhook',
        config: { endpoint: '/api/automation/webhooks/order-created' },
        active: true,
        runCount: 0
      },
      actions: [
        {
          id: 'send_confirmation_email',
          type: 'email',
          config: {
            to: '{{customerEmail}}',
            subject: 'Order Confirmation - {{orderId}}',
            template: 'order_confirmation',
            data: ['orderId', 'customerName', 'items', 'total']
          },
          retryCount: 3
        },
        {
          id: 'update_inventory',
          type: 'database',
          config: {
            action: 'update_inventory',
            items: '{{orderItems}}'
          },
          retryCount: 2
        },
        {
          id: 'notify_kitchen',
          type: 'slack',
          config: {
            channel: '#kitchen',
            message: 'New order {{orderId}} - {{items}} - Table {{tableNumber}}'
          },
          retryCount: 1
        }
      ],
      active: true,
      createdAt: Date.now(),
      executionCount: 0
    });

    // Payment Processing Workflow
    this.createWorkflow({
      id: 'payment_processing',
      name: 'Payment & Rewards Automation',
      description: 'Process payments and distribute MIMI token rewards',
      trigger: {
        id: 'payment_webhook',
        name: 'Payment Confirmed Trigger',
        type: 'webhook',
        config: { endpoint: '/api/automation/webhooks/payment-confirmed' },
        active: true,
        runCount: 0
      },
      actions: [
        {
          id: 'distribute_rewards',
          type: 'http_request',
          config: {
            method: 'POST',
            url: '/api/rewards/earn',
            data: {
              customerId: '{{customerId}}',
              orderId: '{{orderId}}',
              orderAmount: '{{amount}}',
              paymentMethod: '{{paymentMethod}}'
            }
          },
          retryCount: 3
        },
        {
          id: 'send_receipt',
          type: 'email',
          config: {
            to: '{{customerEmail}}',
            subject: 'Payment Receipt - {{orderId}}',
            template: 'payment_receipt'
          },
          retryCount: 2
        },
        {
          id: 'update_analytics',
          type: 'database',
          config: {
            action: 'update_payment_analytics',
            data: ['paymentId', 'amount', 'method', 'timestamp']
          },
          retryCount: 1
        }
      ],
      active: true,
      createdAt: Date.now(),
      executionCount: 0
    });

    // Blockchain Monitoring Workflow
    this.createWorkflow({
      id: 'blockchain_monitoring',
      name: 'Blockchain Health Monitoring',
      description: 'Monitor USDC transactions and blockchain infrastructure',
      trigger: {
        id: 'blockchain_schedule',
        name: 'Blockchain Check Schedule',
        type: 'schedule',
        config: { cron: '*/5 * * * *' }, // Every 5 minutes
        active: true,
        runCount: 0
      },
      actions: [
        {
          id: 'check_transaction_status',
          type: 'blockchain',
          config: {
            action: 'verify_pending_transactions',
            networks: ['base', 'polygon']
          },
          retryCount: 2
        },
        {
          id: 'alert_on_failures',
          type: 'slack',
          config: {
            channel: '#alerts',
            condition: 'if_failures_detected',
            message: 'Blockchain transaction failures detected: {{failureCount}}'
          },
          retryCount: 1
        }
      ],
      active: true,
      createdAt: Date.now(),
      executionCount: 0
    });

    // Customer Tier Upgrade Workflow
    this.createWorkflow({
      id: 'tier_upgrade',
      name: 'Customer Tier Upgrade Notifications',
      description: 'Notify customers when they reach new reward tiers',
      trigger: {
        id: 'tier_webhook',
        name: 'Tier Upgrade Trigger',
        type: 'webhook',
        config: { endpoint: '/api/automation/webhooks/tier-upgraded' },
        active: true,
        runCount: 0
      },
      actions: [
        {
          id: 'send_upgrade_email',
          type: 'email',
          config: {
            to: '{{customerEmail}}',
            subject: 'Congratulations! You\'ve reached {{newTier}} status',
            template: 'tier_upgrade',
            data: ['customerName', 'newTier', 'benefits']
          },
          retryCount: 3
        },
        {
          id: 'grant_tier_bonus',
          type: 'http_request',
          config: {
            method: 'POST',
            url: '/api/rewards/earn',
            data: {
              customerId: '{{customerId}}',
              amount: '{{tierBonus}}',
              description: 'Tier upgrade bonus'
            }
          },
          retryCount: 2
        }
      ],
      active: true,
      createdAt: Date.now(),
      executionCount: 0
    });
  }

  createWorkflow(workflow: AutomationWorkflow): boolean {
    try {
      this.workflows.set(workflow.id, workflow);
      
      // Set up scheduled triggers
      if (workflow.trigger.type === 'schedule' && workflow.active) {
        this.scheduleWorkflow(workflow);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to create workflow:', error);
      return false;
    }
  }

  private scheduleWorkflow(workflow: AutomationWorkflow) {
    if (workflow.trigger.type !== 'schedule') return;
    
    // In a real implementation, you'd use node-cron here
    // For now, we'll simulate with setTimeout for demo
    const interval = this.parseCronToMs(workflow.trigger.config.cron);
    
    const job = setInterval(async () => {
      await this.executeWorkflow(workflow.id, {});
    }, interval);
    
    this.scheduledJobs.set(workflow.id, job);
  }

  private parseCronToMs(cron: string): number {
    // Simple cron parser for demo - in production use proper cron library
    if (cron === '*/5 * * * *') return 5 * 60 * 1000; // 5 minutes
    if (cron === '0 0 * * *') return 24 * 60 * 60 * 1000; // Daily
    return 60 * 1000; // Default 1 minute
  }

  async executeWorkflow(workflowId: string, triggerData: any): Promise<boolean> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || !workflow.active) return false;

    try {
      workflow.executionCount++;
      workflow.lastExecuted = Date.now();
      workflow.trigger.runCount++;

      console.log(`Executing workflow: ${workflow.name}`);

      for (const action of workflow.actions) {
        await this.executeAction(action, triggerData);
      }

      return true;
    } catch (error) {
      console.error(`Workflow execution failed for ${workflowId}:`, error);
      return false;
    }
  }

  private async executeAction(action: WorkflowAction, data: any): Promise<void> {
    const populatedConfig = this.populateTemplate(action.config, data);

    switch (action.type) {
      case 'http_request':
        await this.executeHttpRequest(populatedConfig);
        break;
      case 'email':
        await this.sendEmail(populatedConfig);
        break;
      case 'sms':
        await this.sendSMS(populatedConfig);
        break;
      case 'slack':
        await this.sendSlackMessage(populatedConfig);
        break;
      case 'database':
        await this.executeDatabaseAction(populatedConfig);
        break;
      case 'blockchain':
        await this.executeBlockchainAction(populatedConfig);
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  private populateTemplate(config: any, data: any): any {
    const configStr = JSON.stringify(config);
    const populatedStr = configStr.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
    return JSON.parse(populatedStr);
  }

  private async executeHttpRequest(config: any): Promise<void> {
    // In production, use axios or fetch
    console.log(`HTTP Request: ${config.method} ${config.url}`, config.data);
  }

  private async sendEmail(config: any): Promise<void> {
    console.log(`Email sent to ${config.to}: ${config.subject}`);
  }

  private async sendSMS(config: any): Promise<void> {
    console.log(`SMS sent to ${config.to}: ${config.message}`);
  }

  private async sendSlackMessage(config: any): Promise<void> {
    console.log(`Slack message to ${config.channel}: ${config.message}`);
  }

  private async executeDatabaseAction(config: any): Promise<void> {
    console.log(`Database action: ${config.action}`, config.data);
  }

  private async executeBlockchainAction(config: any): Promise<void> {
    console.log(`Blockchain action: ${config.action}`, config);
  }

  triggerWorkflow(triggerEndpoint: string, data: any): boolean {
    for (const [id, workflow] of Array.from(this.workflows.entries())) {
      if (workflow.trigger.type === 'webhook' && 
          workflow.trigger.config.endpoint === triggerEndpoint &&
          workflow.active) {
        this.executeWorkflow(id, data);
        return true;
      }
    }
    return false;
  }

  getWorkflows(): AutomationWorkflow[] {
    return Array.from(this.workflows.values());
  }

  getWorkflow(id: string): AutomationWorkflow | undefined {
    return this.workflows.get(id);
  }

  updateWorkflow(id: string, updates: Partial<AutomationWorkflow>): boolean {
    const workflow = this.workflows.get(id);
    if (!workflow) return false;

    Object.assign(workflow, updates);
    this.workflows.set(id, workflow);
    return true;
  }

  deleteWorkflow(id: string): boolean {
    const job = this.scheduledJobs.get(id);
    if (job) {
      clearInterval(job);
      this.scheduledJobs.delete(id);
    }
    return this.workflows.delete(id);
  }

  getExecutionStats(): any {
    const workflows = Array.from(this.workflows.values());
    return {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter(w => w.active).length,
      totalExecutions: workflows.reduce((sum, w) => sum + w.executionCount, 0),
      recentExecutions: workflows.filter(w => 
        w.lastExecuted && w.lastExecuted > Date.now() - 24 * 60 * 60 * 1000
      ).length
    };
  }
}

export const workflowManager = new WorkflowManager();
export type { AutomationWorkflow, WorkflowTrigger, WorkflowAction };