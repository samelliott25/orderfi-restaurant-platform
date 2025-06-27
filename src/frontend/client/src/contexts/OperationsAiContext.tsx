import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { ProcessedData } from "@/services/dataProcessor";

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

interface OperationsAiContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activeTask: TaskAction | null;
  setActiveTask: React.Dispatch<React.SetStateAction<TaskAction | null>>;
  dashboardData: ProcessedData | null;
  setDashboardData: React.Dispatch<React.SetStateAction<ProcessedData | null>>;
}

const OperationsAiContext = createContext<OperationsAiContextType | undefined>(undefined);

export function OperationsAiProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskAction | null>(null);
  const [dashboardData, setDashboardData] = useState<ProcessedData | null>(null);

  useEffect(() => {
    // Initialize with welcome message only if messages are empty
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        type: "assistant",
        content: "Hello! I'm Mimi, your Operations AI Agent. I can help you run your restaurant business autonomously - from generating reports to managing suppliers and analyzing data. What would you like me to help you with today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  return (
    <OperationsAiContext.Provider value={{
      messages,
      setMessages,
      isLoading,
      setIsLoading,
      activeTask,
      setActiveTask,
      dashboardData,
      setDashboardData
    }}>
      {children}
    </OperationsAiContext.Provider>
  );
}

export function useOperationsAi() {
  const context = useContext(OperationsAiContext);
  if (context === undefined) {
    throw new Error('useOperationsAi must be used within an OperationsAiProvider');
  }
  return context;
}