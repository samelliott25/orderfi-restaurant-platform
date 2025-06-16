import { apiRequest } from "./queryClient";

export interface ChatMessage {
  message: string;
  restaurantId: number;
  sessionId: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface ChatResponse {
  message: string;
  suggestedItems?: Array<{
    id: number;
    name: string;
    description: string;
    price: string;
  }>;
}

export const chatApi = {
  sendMessage: async (data: ChatMessage): Promise<ChatResponse> => {
    const response = await apiRequest("POST", "/api/chat", data);
    return response.json();
  },
};

export const restaurantApi = {
  getRestaurant: async (id: number) => {
    const response = await apiRequest("GET", `/api/restaurants/${id}`);
    return response.json();
  },
  
  updateRestaurant: async (id: number, data: any) => {
    const response = await apiRequest("PUT", `/api/restaurants/${id}`, data);
    return response.json();
  },

  getMenuItems: async (restaurantId: number) => {
    const response = await apiRequest("GET", `/api/restaurants/${restaurantId}/menu`);
    return response.json();
  },

  createMenuItem: async (restaurantId: number, data: any) => {
    const response = await apiRequest("POST", `/api/restaurants/${restaurantId}/menu`, data);
    return response.json();
  },

  updateMenuItem: async (id: number, data: any) => {
    const response = await apiRequest("PUT", `/api/menu-items/${id}`, data);
    return response.json();
  },

  deleteMenuItem: async (id: number) => {
    await apiRequest("DELETE", `/api/menu-items/${id}`);
  },

  getFAQs: async (restaurantId: number) => {
    const response = await apiRequest("GET", `/api/restaurants/${restaurantId}/faqs`);
    return response.json();
  },

  createFAQ: async (restaurantId: number, data: any) => {
    const response = await apiRequest("POST", `/api/restaurants/${restaurantId}/faqs`, data);
    return response.json();
  },

  deleteFAQ: async (id: number) => {
    await apiRequest("DELETE", `/api/faqs/${id}`);
  },
};

export const orderApi = {
  createOrder: async (data: any) => {
    const response = await apiRequest("POST", "/api/orders", data);
    return response.json();
  },

  getOrder: async (id: number) => {
    const response = await apiRequest("GET", `/api/orders/${id}`);
    return response.json();
  },
};

export const paymentApi = {
  createCheckout: async (orderId: number, amount: number) => {
    const response = await apiRequest("POST", "/api/payment/create-checkout", {
      orderId,
      amount,
    });
    return response.json();
  },
};
