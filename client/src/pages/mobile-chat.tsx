import { useQuery } from "@tanstack/react-query";
import { FluidChatInterface } from "@/components/fluid-chat-interface";
import { restaurantApi } from "@/lib/api";
import { Menu } from "lucide-react";
import { Link } from "wouter";
import { type Restaurant } from "@shared/schema";

export default function MobileChatPage() {
  const { data: restaurant, isLoading } = useQuery<Restaurant>({
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
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#ffe6b0' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="p-2 rounded-full hover:bg-black/10 transition-colors cursor-pointer">
          <Menu className="h-6 w-6 text-black" />
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="px-6 py-2 rounded-full border-2 border-black bg-transparent hover:bg-black hover:text-white transition-colors"
            style={{ 
              fontFamily: 'Permanent Marker, cursive',
              fontSize: '16px',
              color: '#000'
            }}
          >
            Sign In
          </button>
          <button 
            className="px-6 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
            style={{ 
              fontFamily: 'Permanent Marker, cursive',
              fontSize: '16px'
            }}
          >
            Anonymous
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <FluidChatInterface 
          restaurantId={1} 
          welcomeMessage=""
        />
      </div>
    </div>
  );
}