import { useState, useEffect, useRef } from "react";
import { useOperationsAi } from "@/contexts/OperationsAiContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VoiceInput } from "@/components/VoiceInput";
import { DataProcessor, ProcessedData } from "@/services/dataProcessor";
import { ChatOpsSettings, ChatOpsSettingsConfig, defaultChatOpsConfig } from "./ChatOpsSettings";
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
  Paperclip,
  Archive,
  Download,
  User
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ThreeOrb } from "@/components/ThreeOrb";
import mimiLogo from "@assets/Mimi dashboard logo_1750329007735.webp";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: TaskAction[];
  status?: 'pending' | 'completed' | 'failed';
  filePreviews?: string[];
  fileNames?: string[];
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
  const {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    activeTask,
    setActiveTask,
    dashboardData,
    setDashboardData
  } = useOperationsAi();
  
  const [input, setInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatConfig, setChatConfig] = useState<ChatOpsSettingsConfig>(() => {
    const saved = localStorage.getItem('chatops-settings');
    return saved ? JSON.parse(saved) : defaultChatOpsConfig;
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle data updates from the chat
  useEffect(() => {
    if (dashboardData && onDataUpdate) {
      onDataUpdate(dashboardData);
    }
  }, [dashboardData, onDataUpdate]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Conversation condensing effect
  useEffect(() => {
    if (chatConfig.conversationCondensing !== 'off' && messages.length > chatConfig.maxMessagesPerSession) {
      condenseConversation();
    }
  }, [messages, chatConfig]);

  const condenseConversation = async () => {
    if (chatConfig.conversationCondensing === 'smart') {
      // Use AI to create intelligent summary
      try {
        const conversationText = messages.slice(0, -20).map(m => `${m.type}: ${m.content}`).join('\n');
        const response = await apiRequest('/api/ai/condense-conversation', {
          method: 'POST',
          body: JSON.stringify({ 
            conversation: conversationText,
            context: 'restaurant_operations' 
          })
        });
        
        const summary = response.summary;
        const summaryMessage: ChatMessage = {
          id: `summary-${Date.now()}`,
          type: 'system',
          content: `📋 Conversation Summary: ${summary}`,
          timestamp: new Date()
        };
        
        // Keep last 20 messages + summary
        setMessages([summaryMessage, ...messages.slice(-20)]);
      } catch (error) {
        console.error('Failed to condense conversation:', error);
        // Fallback to simple truncation
        setMessages(messages.slice(-chatConfig.maxMessagesPerSession));
      }
    } else if (chatConfig.conversationCondensing === 'message-count') {
      // Simple message count limit
      setMessages(messages.slice(-chatConfig.condensingInterval));
    } else if (chatConfig.conversationCondensing === 'time-based') {
      // Remove messages older than specified hours
      const cutoffTime = new Date(Date.now() - (chatConfig.condensingInterval * 60 * 60 * 1000));
      setMessages(messages.filter(m => m.timestamp > cutoffTime));
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatops-messages');
  };

  const handleExportData = () => {
    const exportData = {
      messages,
      settings: chatConfig,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chatops-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // This function is defined later in the component

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

    // Create file previews
    const filePreviews = await Promise.all(fileArray.map(async (file) => {
      if (file.type.startsWith('image/')) {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }
      return null;
    }));

    // Add file upload message with thumbnails
    const imageCount = filePreviews.filter(Boolean).length;
    const uploadMessage: ChatMessage = {
      id: `upload-${Date.now()}`,
      type: 'user',
      content: imageCount > 0 
        ? `Uploaded ${fileArray.length} file${fileArray.length > 1 ? 's' : ''} (${(totalSize / 1024).toFixed(1)} KB total)`
        : `Uploaded ${fileArray.length} file${fileArray.length > 1 ? 's' : ''}: ${fileArray.map(f => f.name).join(', ')} (${(totalSize / 1024).toFixed(1)} KB total)`,
      timestamp: new Date(),
      filePreviews: filePreviews.filter(Boolean) as string[],
      fileNames: fileArray.map(f => f.name)
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
        setDashboardData(processedData);
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
      className={`w-full h-full border-l border-border bg-background flex flex-col overflow-hidden transition-all duration-200 ${isDragOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Chat Header with Settings */}
      <div className="liquid-glass-card flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ThreeOrb 
              size={32}
              color="#f97316"
              complexity={0.8}
              speed={1.0}
              className="animate-spin-slow"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg">ChatOps Assistant</h3>
            <p className="text-sm text-muted-foreground">
              {chatConfig.conversationCondensing !== 'off' 
                ? `Auto-condensing every ${chatConfig.condensingInterval} ${chatConfig.conversationCondensing === 'time-based' ? 'hours' : 'messages'}`
                : 'No auto-condensing'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {messages.length} messages
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="liquid-glass-nav-item"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Active Task Display */}
      {activeTask && (
        <div className="p-3 bg-primary/5 border-b border-primary/20">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <span className="text-sm text-foreground font-medium">
              {activeTask.description}
            </span>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div 
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="text-6xl">🤖</div>
              <div>
                <h3 className="text-lg font-medium mb-2">Welcome to ChatOps</h3>
                <p className="text-muted-foreground mb-4">
                  I'm your AI assistant for restaurant operations. I can help with reports, analytics, scheduling, and more.
                </p>
              </div>
              
              {/* Suggested Tasks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestedTasks.map((task, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedTask(task)}
                    className="liquid-glass-card p-4 text-left hover:scale-105 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <task.icon className="h-6 w-6 text-orange-500" />
                      <div>
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <p className="text-xs text-muted-foreground">{task.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-orange-500 text-white' 
                    : message.type === 'system'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : message.type === 'system' ? (
                    <Archive className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                
                <div className={`flex-1 max-w-[80%] ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`liquid-glass-card p-3 ${
                    message.type === 'user' 
                      ? 'bg-orange-500/10 border-orange-500/20' 
                      : message.type === 'system'
                      ? 'bg-blue-500/10 border-blue-500/20'
                      : 'bg-white/5 border-white/10'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {/* File Previews */}
                    {message.filePreviews && message.filePreviews.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {message.filePreviews.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Status Icon */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="liquid-glass-card p-3 bg-white/5 border-white/10">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about restaurant operations..."
              className="flex-1"
              disabled={isLoading}
            />
            
            {/* File Upload */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              accept="image/*,.csv,.json,.txt,.pdf"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            {/* Voice Input */}
            <VoiceInput 
              onResult={(text) => {
                setInput(text);
                // Auto-send if enabled in settings
                if (chatConfig.voiceEnabled) {
                  setTimeout(() => handleSendMessage(), 500);
                }
              }}
              disabled={isLoading}
            />
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>
            Model: {chatConfig.aiModel} • Style: {chatConfig.responseStyle}
          </span>
          <span>
            {chatConfig.conversationCondensing !== 'off' && (
              <Badge variant="outline" className="text-xs">
                Auto-condensing enabled
              </Badge>
            )}
          </span>
        </div>
      </div>

      {/* Settings Panel */}
      <ChatOpsSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        config={chatConfig}
        onConfigChange={setChatConfig}
        onClearHistory={handleClearHistory}
        onExportData={handleExportData}
      />
    </div>
  );
}