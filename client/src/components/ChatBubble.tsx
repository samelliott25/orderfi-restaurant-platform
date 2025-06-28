// Logo will be rendered as text for now

interface ChatBubbleProps {
  message: string;
  isUser?: boolean;
  timestamp?: Date;
}

export function ChatBubble({ message, isUser = false, timestamp }: ChatBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-3`}>
        {/* Avatar */}
        {!isUser && (
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-background border-3 border-green-700 p-1 retro-shadow">
            <div className="w-full h-full bg-[#8b795e] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
          </div>
        )}
        
        {/* Message Bubble */}
        <div className={`message-bubble-retro ${
          isUser 
            ? 'bg-orange-500 text-white user-bubble' 
            : 'bg-background border-3 border-green-700 mimi-bubble'
        }`}>
          <p className="text-lg leading-relaxed retro-text-message">
            {message}
          </p>
          {timestamp && (
            <p className="text-xs opacity-60 mt-2">
              {formatTime(timestamp)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}