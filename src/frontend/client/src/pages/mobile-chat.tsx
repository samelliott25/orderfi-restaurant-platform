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
      <div className="h-screen flex items-center justify-center" style={{ backgroundColor: '#ffe6b0' }}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full animate-pulse" style={{ backgroundColor: '#fff0cc' }}></div>
          <p style={{ color: '#8b795e' }}>Loading Mimi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen" style={{ backgroundColor: '#ffe6b0' }}>
      <FluidChatInterface 
        restaurantId={1} 
        welcomeMessage=""
      />
    </div>
  );
}