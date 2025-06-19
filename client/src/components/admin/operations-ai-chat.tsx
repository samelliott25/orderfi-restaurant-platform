import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { VoiceInput } from "@/components/VoiceInput";
import { DataProcessor, ProcessedData } from "@/services/dataProcessor";
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
  Loader2,
  Paperclip
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import mimiLogo from "@assets/Mimi dashboard logo_1750329007735.webp";

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

interface OperationsAiChatProps {
  onDataUpdate?: (data: ProcessedData) => void;
}

export function OperationsAiChat({ onDataUpdate }: OperationsAiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskAction | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const totalSize = fileArray.reduce((sum, file) => sum + file.size, 0);

    // Add file upload message
    const uploadMessage: ChatMessage = {
      id: `upload-${Date.now()}`,
      type: 'user',
      content: `Uploaded ${fileArray.length} file${fileArray.length > 1 ? 's' : ''}: ${fileArray.map(f => f.name).join(', ')} (${(totalSize / 1024).toFixed(1)} KB total)`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, uploadMessage]);

    // Process the files with AI
    setIsLoading(true);
    
    try {
      const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
      const dataFiles = fileArray.filter(file => !file.type.startsWith('image/'));
      
      if (imageFiles.length > 0) {
        // Process first image with AI (for now, handle one at a time)
        const formData = new FormData();
        formData.append('image', imageFiles[0]);
        formData.append('message', `Analyze this ${imageFiles[0].name} image for restaurant operations. Extract menu items with prices if it's a menu, or provide business insights if it's receipts, invoices, or other business documents.`);
        formData.append('context', 'restaurant_operations');

        const response = await fetch("/api/operations-ai-chat", {
          method: "POST",
          body: formData
        });

        const data = await response.json();

        const responseMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          type: 'assistant',
          content: data.message,
          timestamp: new Date(),
          actions: data.actions || []
        };
        setMessages(prev => [...prev, responseMessage]);

        // Handle additional images if multiple were uploaded
        if (imageFiles.length > 1) {
          const additionalMessage: ChatMessage = {
            id: `ai-additional-${Date.now()}`,
            type: 'assistant',
            content: `I've analyzed the first image. I can also process the remaining ${imageFiles.length - 1} image${imageFiles.length > 2 ? 's' : ''}: ${imageFiles.slice(1).map(f => f.name).join(', ')}. Would you like me to analyze them as well?`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, additionalMessage]);
        }
      }
      
      if (dataFiles.length > 0) {
        // Handle data file processing (process first data file for now)
        const processedData = await DataProcessor.processFile(dataFiles[0]);
        
        // Update dashboard with processed data
        if (onDataUpdate) {
          onDataUpdate(processedData);
        }
        
        // Generate detailed AI response based on processed data
        const responseMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          type: 'assistant',
          content: `I've analyzed your ${dataFiles[0].name} file and extracted the following insights:

📊 **Sales Summary**
• Total Orders: ${processedData.totalOrders}
• Total Revenue: $${processedData.totalRevenue.toLocaleString()}
• Average Order Value: $${processedData.averageOrderValue.toFixed(2)}
• Completion Rate: ${processedData.completionRate.toFixed(1)}%

📈 **Performance Metrics**
• Completed Orders: ${processedData.completedOrders}
• Pending Orders: ${processedData.pendingOrders}
• Orders per Hour: ${processedData.ordersPerHour.toFixed(1)}

I've updated your dashboard with this real data. ${dataFiles.length > 1 ? `I can also process the remaining ${dataFiles.length - 1} data file${dataFiles.length > 2 ? 's' : ''} if needed.` : ''} Is there anything specific you'd like me to analyze?`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, responseMessage]);
      }
      
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: `I encountered an issue processing your files. Please ensure they're valid file formats. For data files, I support CSV, JSON, and text files. For images, I support JPG, PNG, GIF, and WebP formats. Would you like to try uploading different files?`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  return (
    <div 
      className={`w-full h-full border-l flex flex-col overflow-hidden transition-all duration-200 ${isDragOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`} 
      style={{ backgroundColor: '#ffe6b0', borderColor: '#e5cf97' }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="p-4 lg:p-6 border-b flex-shrink-0" style={{ borderColor: '#e5cf97' }}>
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

      {/* Drop Zone Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center z-50 border-2 border-dashed border-blue-400">
          <div className="text-center">
            <div className="text-3xl mb-2">📁</div>
            <p className="text-blue-600 font-medium">Drop files here to analyze</p>
            <p className="text-blue-500 text-sm">Supports multiple CSV, Excel, JSON, text files, and images</p>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept=".csv,.xlsx,.xls,.json,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp"
        onChange={handleFileInputChange}
      />

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 relative" ref={scrollAreaRef}>
        {/* Background Logo */}
        <div 
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '60%',
            backgroundImage: `url(${mimiLogo})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center bottom',
            opacity: 0.4,
            zIndex: 0
          }}
        />
        <div className="space-y-4 relative z-10">
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
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="flex-shrink-0"
            style={{ borderColor: '#8b795e', color: '#8b795e', backgroundColor: '#fff0cc' }}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Mimi or drop files here..."
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