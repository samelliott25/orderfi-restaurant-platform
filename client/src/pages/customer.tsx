import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatInterface } from "@/components/chat-interface";
import { OrderSummary } from "@/components/order-summary";
import { Bot, Settings, MessageSquare, Clock, Star, MapPin, Phone } from "lucide-react";
import { restaurantApi } from "@/lib/api";

const RESTAURANT_ID = 1; // Default restaurant for demo

export default function CustomerPage() {
  // Fetch restaurant data
  const { data: restaurant, isLoading } = useQuery({
    queryKey: [`/api/restaurants/${RESTAURANT_ID}`],
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bot className="text-2xl text-primary" />
                <span className="text-xl font-bold text-gray-900">AgentChef</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
              <Button asChild>
                <Link href="/customer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Order Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Restaurant Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {restaurant?.name || "Loading..."}
            </h1>
            <p className="text-gray-600 mt-2">
              {restaurant?.description || "Authentic cuisine • Order with our AI assistant"}
            </p>
            <div className="flex items-center justify-center space-x-4 mt-3">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="mr-1 h-4 w-4" />
                <span>Open until 10 PM</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="mr-1 h-4 w-4 text-yellow-500" />
                <span>4.8 (324 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface 
              restaurantId={RESTAURANT_ID}
              welcomeMessage={restaurant?.welcomeMessage}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <OrderSummary />

            {/* Restaurant Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="mr-2 text-primary h-5 w-5" />
                Restaurant Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 text-gray-400 h-4 w-4" />
                  <span>123 Main Street, Downtown</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="mr-2 text-gray-400 h-4 w-4" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-2 text-gray-400 h-4 w-4" />
                  <span>Mon-Sun: 11 AM - 10 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
