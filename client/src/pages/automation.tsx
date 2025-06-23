import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  Plus, 
  BarChart3, 
  Clock, 
  Mail, 
  MessageSquare, 
  Database,
  Blocks,
  Activity,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";

interface WorkflowStats {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  recentExecutions: number;
  recentExecutions24h: number;
  weeklyExecutions: number;
  triggerTypeDistribution: Record<string, number>;
  topWorkflows: Array<{
    name: string;
    executions: number;
    lastRun?: number;
  }>;
}

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  active: boolean;
  executionCount: number;
  lastExecuted?: number;
  trigger: {
    type: 'webhook' | 'schedule' | 'event';
    config: any;
  };
  actions: Array<{
    type: string;
    config: any;
  }>;
}

export default function AutomationPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: automationData, isLoading } = useQuery({
    queryKey: ['/api/automation/dashboard'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: workflows = [] } = useQuery({
    queryKey: ['/api/automation/workflows'],
  });

  const executeWorkflowMutation = useMutation({
    mutationFn: async ({ workflowId, data }: { workflowId: string; data: any }) => {
      const response = await fetch(`/api/automation/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Execution failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Workflow Executed",
        description: "The workflow has been executed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/dashboard'] });
    },
    onError: () => {
      toast({
        title: "Execution Failed",
        description: "Failed to execute the workflow",
        variant: "destructive",
      });
    }
  });

  const toggleWorkflowMutation = useMutation({
    mutationFn: async ({ workflowId, active }: { workflowId: string; active: boolean }) => {
      const response = await fetch(`/api/automation/workflows/${workflowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active })
      });
      if (!response.ok) throw new Error('Update failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/automation/workflows'] });
      queryClient.invalidateQueries({ queryKey: ['/api/automation/dashboard'] });
    }
  });

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'email': return Mail;
      case 'slack': return MessageSquare;
      case 'database': return Database;
      case 'blockchain': return Blocks;
      case 'http_request': return Activity;
      default: return Settings;
    }
  };

  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'webhook': return Activity;
      case 'schedule': return Clock;
      case 'event': return CheckCircle;
      default: return Settings;
    }
  };

  const formatLastRun = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen admin-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b795e] mx-auto mb-4"></div>
          <p className="text-[#8b795e]">Loading automation dashboard...</p>
        </div>
      </div>
    );
  }

  const stats: WorkflowStats = automationData || {
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalExecutions: 0,
    recentExecutions: 0,
    recentExecutions24h: 0,
    weeklyExecutions: 0,
    triggerTypeDistribution: {},
    topWorkflows: []
  };

  return (
    <div className="min-h-screen admin-bg">
      <div className="container-modern p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-modern-lg border border-[#8b795e]/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Automation Dashboard</h1>
              <p className="text-[#8b795e]/70">n8n-style workflow automation for restaurant operations</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="border-[#8b795e]/20 hover:bg-[#ffe6b0]/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
              <Badge 
                variant="secondary" 
                className="bg-green-100 text-green-800 border-green-200"
              >
                {stats.activeWorkflows} Active
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-modern hover-lift border-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8b795e]">Total Workflows</CardTitle>
              <Settings className="h-4 w-4 text-[#8b795e]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient">{stats.totalWorkflows}</div>
              <p className="text-xs text-[#8b795e]/70">{stats.activeWorkflows} currently active</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-modern hover-lift border-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8b795e]">Executions (24h)</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.recentExecutions24h}</div>
              <p className="text-xs text-[#8b795e]/70">Automated tasks completed</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-modern hover-lift border-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8b795e]">Weekly Total</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.weeklyExecutions}</div>
              <p className="text-xs text-[#8b795e]/70">All workflow executions</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-modern hover-lift border-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8b795e]">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">99.2%</div>
              <p className="text-xs text-[#8b795e]/70">Workflow reliability</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="workflows" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="logs">Execution Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="space-y-6">
            <div className="grid gap-6">
              {workflows.workflows?.map((workflow: AutomationWorkflow) => {
                const TriggerIcon = getTriggerIcon(workflow.trigger.type);
                
                return (
                  <Card key={workflow.id} className="bg-white shadow-modern border-modern">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TriggerIcon className="h-5 w-5 text-[#8b795e]" />
                          <div>
                            <CardTitle className="text-[#8b795e]">{workflow.name}</CardTitle>
                            <p className="text-sm text-[#8b795e]/70 mt-1">{workflow.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={workflow.active ? "default" : "secondary"}>
                            {workflow.active ? "Active" : "Inactive"}
                          </Badge>
                          <Switch
                            checked={workflow.active}
                            onCheckedChange={(checked) => 
                              toggleWorkflowMutation.mutate({ 
                                workflowId: workflow.id, 
                                active: checked 
                              })
                            }
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-[#8b795e] mb-1">Trigger Type</p>
                          <Badge variant="outline" className="capitalize">
                            {workflow.trigger.type}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#8b795e] mb-1">Executions</p>
                          <p className="text-sm text-[#8b795e]/70">{workflow.executionCount}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#8b795e] mb-1">Last Run</p>
                          <p className="text-sm text-[#8b795e]/70">{formatLastRun(workflow.lastExecuted)}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-[#8b795e] mb-2">Actions ({workflow.actions.length})</p>
                        <div className="flex gap-2 flex-wrap">
                          {workflow.actions.map((action, index) => {
                            const ActionIcon = getActionIcon(action.type);
                            return (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                <ActionIcon className="h-3 w-3" />
                                {action.type.replace('_', ' ')}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => executeWorkflowMutation.mutate({ 
                            workflowId: workflow.id, 
                            data: {} 
                          })}
                          disabled={executeWorkflowMutation.isPending}
                          className="gradient-bg-secondary text-white hover:opacity-90"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Execute
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-modern border-modern">
                <CardHeader>
                  <CardTitle className="text-gradient">Trigger Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.triggerTypeDistribution).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#8b795e]"></div>
                          <span className="capitalize text-[#8b795e]">{type}</span>
                        </div>
                        <span className="font-semibold text-[#8b795e]">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-modern border-modern">
                <CardHeader>
                  <CardTitle className="text-gradient">Top Performing Workflows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.topWorkflows.map((workflow, index) => (
                      <div key={workflow.name} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#8b795e]">{workflow.name}</p>
                          <p className="text-xs text-[#8b795e]/70">
                            Last run: {formatLastRun(workflow.lastRun)}
                          </p>
                        </div>
                        <Badge variant="secondary">{workflow.executions} runs</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card className="bg-white shadow-modern border-modern">
              <CardHeader>
                <CardTitle className="text-gradient">Recent Executions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workflows.workflows?.slice(0, 10).map((workflow: AutomationWorkflow) => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 rounded-lg border border-[#8b795e]/10">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium text-[#8b795e]">{workflow.name}</p>
                          <p className="text-xs text-[#8b795e]/70">
                            {formatLastRun(workflow.lastExecuted)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Success</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}