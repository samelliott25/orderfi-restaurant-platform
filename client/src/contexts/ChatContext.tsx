import { createContext, useContext, useState, useEffect } from 'react';

interface ChatContextType {
  isSidebarMode: boolean;
  setIsSidebarMode: (mode: boolean) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarMode, setIsSidebarMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleSetSidebarMode = (mode: boolean) => {
    setIsSidebarMode(mode);
    localStorage.setItem('orderfi-chat-sidebar-mode', JSON.stringify(mode));
  };

  const handleSetIsOpen = (open: boolean) => {
    setIsOpen(open);
    localStorage.setItem('orderfi-chat-open', JSON.stringify(open));
  };

  return (
    <ChatContext.Provider value={{ 
      isSidebarMode, 
      setIsSidebarMode: handleSetSidebarMode,
      isOpen,
      setIsOpen: handleSetIsOpen
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