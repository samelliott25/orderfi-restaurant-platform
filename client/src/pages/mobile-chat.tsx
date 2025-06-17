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
    <div className="h-screen" style={{ backgroundColor: '#ffe6b0' }}>
      <FluidChatInterface 
        restaurantId={1} 
        welcomeMessage=""
      />
    </div>
  );
}