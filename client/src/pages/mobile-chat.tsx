import { useQuery } from "@tanstack/react-query";
import { FluidChatInterface } from "@/components/fluid-chat-interface";
import { restaurantApi } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import mimiLogo from "@assets/5ff63cd3-a67c-49ab-a371-14b12a36506d_1750080680868.png";

export default function MobileChatPage() {
  const { data: restaurant, isLoading } = useQuery({
    queryKey: ['/api/restaurants/1'],
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary animate-pulse"></div>
          <p className="text-muted-foreground">Loading Mimi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#F5E6D3' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-white relative z-20" style={{ backgroundColor: '#F5E6D3' }}>
        <Link href="/">
          <div className="p-2 rounded-full hover:bg-secondary/50 transition-colors cursor-pointer">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </div>
        </Link>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full p-1">
            <img 
              src={mimiLogo} 
              alt="Mimi" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600">Chat with your AI waitress</p>
          </div>
        </div>

        <div className="w-9"> {/* Spacer for symmetry */}</div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <FluidChatInterface 
          restaurantId={1} 
          welcomeMessage={restaurant?.welcomeMessage || "Hi! I'm Mimi, your AI waitress. I'm here to help you explore our delicious menu and place your order. What can I get started for you today?"}
        />
      </div>
    </div>
  );
}