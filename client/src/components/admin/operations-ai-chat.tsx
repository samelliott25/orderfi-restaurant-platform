import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { VoiceInput } from "@/components/VoiceInput";
import { 
  Send, 
  Bot, 
  FileText, 
  Mail, 
  BarChart3, 
  Database, 
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import mimiAccountantLogo from "@assets/20250618_2323_Mimi the Accountant_remix_01jy1k8nqkf4wavwcqmck1phg8_1750253222474.png";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: TaskAction[];
  status?: 'pending' | 'completed' | 'failed';
}

interface TaskAction {
  id: string;
  type: 'report' | 'email' | 'data_load' | 'analysis';
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
}

const suggestedTasks = [
  {
    icon: BarChart3,
    title: "Generate daily sales report",
    description: "Create comprehensive sales summary for today"
  },
  {
    icon: Mail,
    title: "Email supplier status",
    description: "Send inventory update to main suppliers"
  },
  {
    icon: Database,
    title: "Load menu analytics",
    description: "Import and analyze menu performance data"
  },
  {
    icon: FileText,
    title: "Create staff schedule",
    description: "Generate optimized schedule for next week"
  }
];

export function OperationsAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskAction | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      type: "assistant",
      content: "Hello! I'm Mimi, your Operations AI Agent. I can help you run your restaurant business autonomously - from generating reports to managing suppliers and analyzing data. What would you like me to help you with today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateTaskExecution = async (task: TaskAction) => {
    setActiveTask({ ...task, status: 'running' });
    
    // Simulate different task durations
    const duration = task.type === 'email' ? 2000 : task.type === 'report' ? 4000 : 3000;
    
    await new Promise(resolve => setTimeout(resolve, duration));
    
    const results = {
      'report': "✅ Daily sales report generated successfully. Revenue: $1,847.50, Orders: 47, Top item: Classic Burger (12 orders)",
      'email': "✅ Email sent to 3 suppliers with current inventory status and upcoming requirements",
      'data_load': "✅ Menu analytics loaded. Identified 2 underperforming items and 3 trending dishes",
      'analysis': "✅ Analysis complete. Peak hours: 12-2pm & 6-8pm. Suggested staffing adjustments provided"
    };

    const completedTask = {
      ...task,
      status: 'completed' as const,
      result: results[task.type] || "Task completed successfully"
    };

    setActiveTask(completedTask);
    
    // Add result message
    const resultMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: completedTask.result!,
      timestamp: new Date(),
      status: 'completed'
    };

    setMessages(prev => [...prev, resultMessage]);
    setTimeout(() => setActiveTask(null), 2000);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send to AI for processing
      const response = await fetch("/api/operations-ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          context: "restaurant_operations"
        })
      });

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.message,
        timestamp: new Date(),
        actions: data.actions || []
      };

      setMessages(prev => [...prev, aiMessage]);

      // Auto-execute any suggested actions
      if (data.actions?.length > 0) {
        for (const action of data.actions) {
          await simulateTaskExecution(action);
        }
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm having trouble processing that request right now. Please try again or use one of the suggested tasks below.",
        timestamp: new Date(),
        status: 'failed'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedTask = async (task: typeof suggestedTasks[0]) => {
    const taskAction: TaskAction = {
      id: Date.now().toString(),
      type: task.title.includes('report') ? 'report' : 
            task.title.includes('email') ? 'email' :
            task.title.includes('analytics') ? 'data_load' : 'analysis',
      description: task.description,
      status: 'pending'
    };

    const taskMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: `Execute task: ${task.title}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, taskMessage]);

    const confirmMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: `I'll ${task.title.toLowerCase()} for you right now. This will take a moment...`,
      timestamp: new Date(),
      status: 'pending'
    };

    setMessages(prev => [...prev, confirmMessage]);
    await simulateTaskExecution(taskAction);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full border-l flex flex-col overflow-hidden" style={{ backgroundColor: '#ffe6b0', borderColor: '#e5cf97' }}>
      {/* Logo Section */}
      <div className="p-3 border-b flex-shrink-0 flex justify-center" style={{ borderColor: '#e5cf97' }}>
        <img 
          src={mimiAccountantLogo} 
          alt="Mimi Accountant" 
          className="h-16 w-auto object-contain"
        />
      </div>
      
      {/* Header */}
      <div className="p-4 lg:p-5 border-b flex-shrink-0" style={{ borderColor: '#e5cf97' }}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#8b795e' }}>
            <Bot className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm lg:text-base font-semibold" style={{ color: '#654321' }}>Operations AI</h3>
            <p className="text-xs lg:text-sm" style={{ color: '#8b795e' }}>Autonomous Manager</p>
          </div>
        </div>
        
        {activeTask && (
          <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-sm text-foreground font-medium">
                {activeTask.description}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : message.type === 'system'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : ''
              }`}
              style={message.type === 'assistant' ? { backgroundColor: '#fff0cc', color: '#654321' } : {}}>
                <div className="flex items-start space-x-2">
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
                
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.actions.map((action, index) => (
                      <Badge key={`${action.id}-${index}`} variant="outline" className="text-xs">
                        {action.description}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">Mimi is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="px-3 py-2 border-t flex-shrink-0" style={{ borderColor: '#e5cf97' }}>
        <h4 className="text-xs font-medium mb-1" style={{ color: '#8b795e' }}>Quick Actions</h4>
        <div className="flex flex-wrap gap-1">
          {suggestedTasks.slice(0, 3).map((task, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedTask(task)}
              className="px-2 py-0.5 text-xs rounded hover:opacity-80"
              style={{ backgroundColor: '#fff0cc', color: '#654321' }}
              disabled={isLoading || activeTask !== null}
            >
              {task.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t flex-shrink-0" style={{ borderColor: '#e5cf97', backgroundColor: '#ffe6b0' }}>
        <div className="flex space-x-2 items-center">
          <VoiceInput
            onTranscript={(text) => setInput(text)}
            disabled={isLoading}
          />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Mimi..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
            className="text-sm flex-1 min-w-0"
            style={{ backgroundColor: '#fff0cc', borderColor: '#e5cf97', color: '#654321' }}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            size="sm"
            className="flex-shrink-0"
            style={{ backgroundColor: '#8b795e', color: 'white' }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}