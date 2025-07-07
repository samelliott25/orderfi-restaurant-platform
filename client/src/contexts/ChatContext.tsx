import { createContext, useContext, useState, useEffect } from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface ChatState {
  messages: ChatMessage[];
  inputValue: string;
  isListening: boolean;
}

interface ChatContextType {
  isSidebarMode: boolean;
  setIsSidebarMode: (mode: boolean) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  chatState: ChatState;
  setChatState: (state: ChatState) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  chatContext: 'customer' | 'onboarding' | 'operations';
  setChatContext: (context: 'customer' | 'onboarding' | 'operations') => void;
  onboardingState: any;
  setOnboardingState: (state: any) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Storage keys
const CHAT_STORAGE_KEY = 'orderfi-chat-state';

// Initial chat state
const getInitialChatState = (): ChatState => {
  try {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        messages: parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      };
    }
  } catch (error) {
    console.warn('Failed to load chat state:', error);
  }
  return {
    messages: [
      {
        id: '1',
        type: 'assistant',
        content: "Hi! I'm your AI assistant. How can I help you today?",
        timestamp: new Date()
      }
    ],
    inputValue: '',
    isListening: false
  };
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarMode, setIsSidebarMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chatState, setChatState] = useState<ChatState>(getInitialChatState);
  const [isLoading, setIsLoading] = useState(false);
  const [chatContext, setChatContext] = useState<'customer' | 'onboarding' | 'operations'>('customer');
  const [onboardingState, setOnboardingState] = useState<any>({ step: 'welcome' });

  // Persist sidebar mode state
  useEffect(() => {
    const saved = localStorage.getItem('orderfi-chat-sidebar-mode');
    if (saved) {
      setIsSidebarMode(JSON.parse(saved));
    }
  }, []);

  // Persist chat open state
  useEffect(() => {
    const saved = localStorage.getItem('orderfi-chat-open');
    if (saved) {
      setIsOpen(JSON.parse(saved));
    }
  }, []);

  // Persist chat context
  useEffect(() => {
    const saved = localStorage.getItem('orderfi-chat-context');
    if (saved) {
      setChatContext(JSON.parse(saved));
    }
  }, []);

  // Persist onboarding state
  useEffect(() => {
    const saved = localStorage.getItem('orderfi-onboarding-state');
    if (saved) {
      setOnboardingState(JSON.parse(saved));
    }
  }, []);

  const handleSetSidebarMode = (mode: boolean) => {
    setIsSidebarMode(mode);
    localStorage.setItem('orderfi-chat-sidebar-mode', JSON.stringify(mode));
  };

  const handleSetIsOpen = (open: boolean) => {
    setIsOpen(open);
    localStorage.setItem('orderfi-chat-open', JSON.stringify(open));
  };

  const handleSetChatState = (newState: ChatState) => {
    setChatState(newState);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newState));
  };

  const handleSetChatContext = (context: 'customer' | 'onboarding' | 'operations') => {
    setChatContext(context);
    localStorage.setItem('orderfi-chat-context', JSON.stringify(context));
  };

  const handleSetOnboardingState = (state: any) => {
    setOnboardingState(state);
    localStorage.setItem('orderfi-onboarding-state', JSON.stringify(state));
  };

  return (
    <ChatContext.Provider value={{ 
      isSidebarMode, 
      setIsSidebarMode: handleSetSidebarMode,
      isOpen,
      setIsOpen: handleSetIsOpen,
      chatState,
      setChatState: handleSetChatState,
      isLoading,
      setIsLoading,
      chatContext,
      setChatContext: handleSetChatContext,
      onboardingState,
      setOnboardingState: handleSetOnboardingState
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}