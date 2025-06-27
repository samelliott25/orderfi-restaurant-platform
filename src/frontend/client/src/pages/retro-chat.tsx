import { useState } from 'react';
import { ChatBubble } from '@/components/ChatBubble';
import { SwipeConfirmButton } from '@/components/SwipeConfirmButton';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export default function RetroChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: "Hey there, sugar! Want to start with a drink?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const [currentStep, setCurrentStep] = useState<'initial' | 'drinks' | 'menu'>('initial');

  const handleThirstyConfirm = () => {
    // Add user confirmation message
    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      message: "Yes, I'm thirsty!",
      isUser: true,
      timestamp: new Date()
    };

    // Add Mimi's response
    const mimiResponse: ChatMessage = {
      id: Date.now().toString() + '-mimi',
      message: "Great! Let's grab that drink 🍹 What'll it be? We've got ice-cold sodas, fresh juices, or maybe something with a little fizz?",
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, mimiResponse]);
    setCurrentStep('drinks');
  };

  return (
    <div className="min-h-screen retro-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b-4 border-green-700">
        <Link href="/">
          <div className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <ArrowLeft className="h-5 w-5 text-green-700" />
          </div>
        </Link>
        
        <h1 className="retro-text-header">Mimi's Diner</h1>
        
        <div className="w-9"></div>
      </div>

      {/* Chat Container */}
      <div className="max-w-md mx-auto p-4">
        <div className="retro-card">
          {/* Messages */}
          <div className="space-y-4 mb-6">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message.message}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
          </div>

          {/* Swipe Action */}
          {currentStep === 'initial' && (
            <div className="space-y-3">
              <SwipeConfirmButton
                text="Swipe right if you're thirsty!"
                onConfirm={handleThirstyConfirm}
              />
              <p className="text-center text-sm text-gray-600 retro-text-message">
                Or tap to confirm
              </p>
            </div>
          )}

          {/* Drink Options */}
          {currentStep === 'drinks' && (
            <div className="space-y-3">
              <p className="text-center text-lg retro-text-message text-green-800 font-bold">
                Pick your poison, hon!
              </p>
              <div className="grid grid-cols-1 gap-3">
                {['🥤 Ice-Cold Soda', '🍊 Fresh Orange Juice', '🫧 Sparkling Water', '☕ Coffee'].map((drink) => (
                  <button
                    key={drink}
                    className="w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-xl retro-text-message font-bold border-3 border-green-800 retro-shadow transition-all hover:transform hover:translate-y-1"
                    onClick={() => {
                      const userChoice: ChatMessage = {
                        id: Date.now().toString() + '-choice',
                        message: `I'll have a ${drink}`,
                        isUser: true,
                        timestamp: new Date()
                      };
                      
                      const mimiReply: ChatMessage = {
                        id: Date.now().toString() + '-reply',
                        message: `Perfect choice! One ${drink} coming right up! Now, how about something to munch on?`,
                        isUser: false,
                        timestamp: new Date()
                      };
                      
                      setMessages(prev => [...prev, userChoice, mimiReply]);
                      setCurrentStep('menu');
                    }}
                  >
                    {drink}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Menu Transition */}
          {currentStep === 'menu' && (
            <div className="text-center space-y-4">
              <p className="retro-text-message text-green-800 font-bold">
                Ready to explore our full menu?
              </p>
              <Link href="/customer">
                <button className="w-full p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl retro-text-message font-bold border-3 border-orange-700 retro-shadow transition-all hover:transform hover:translate-y-1">
                  Let's see the menu! 🍽️
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}