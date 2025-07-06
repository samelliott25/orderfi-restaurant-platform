import { createContext, useContext, useState, useEffect } from 'react';

interface ChatContextType {
  isSidebarMode: boolean;
  setIsSidebarMode: (mode: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarMode, setIsSidebarMode] = useState(false);

  // Persist sidebar mode state
  useEffect(() => {
    const saved = localStorage.getItem('orderfi-chat-sidebar-mode');
    if (saved) {
      setIsSidebarMode(JSON.parse(saved));
    }
  }, []);

  const handleSetSidebarMode = (mode: boolean) => {
    setIsSidebarMode(mode);
    localStorage.setItem('orderfi-chat-sidebar-mode', JSON.stringify(mode));
  };

  return (
    <ChatContext.Provider value={{ isSidebarMode, setIsSidebarMode: handleSetSidebarMode }}>
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