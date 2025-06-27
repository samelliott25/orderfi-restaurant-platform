import { DatabaseStorage } from './db-storage.js';

export async function seedDatabase() {
  const storage = new DatabaseStorage();

  console.log('Seeding database with sample data...');

  // Create restaurant
  const restaurant = await storage.createRestaurant({
    name: "Loose Moose",
    description: "A modern American bistro with craft cocktails and seasonal ingredients",
    cuisineType: "American",
    tone: "friendly",
    welcomeMessage: "Welcome to Loose Moose! I'm Mimi, your AI waitress. I can help you explore our menu and place your order. What sounds good today?",
    isActive: true
  });

  // Sample menu items
  const menuItemData = [
    {
      name: "Truffle Mac & Cheese",
      description: "Creamy three-cheese blend with truffle oil and crispy breadcrumbs",
      price: "18.00",
      category: "Appetizers",
      tags: ["vegetarian", "comfort food"],
      restaurantId: restaurant.id
    },
    {
      name: "Moose Burger",
      description: "8oz grass-fed beef, aged cheddar, bacon, lettuce, tomato, special sauce",
      price: "16.00",
      category: "Mains",
      tags: ["signature", "beef"],
      restaurantId: restaurant.id
    },
    {
      name: "Pan-Seared Salmon",
      description: "Atlantic salmon with lemon herb butter, seasonal vegetables, wild rice",
      price: "24.00",
      category: "Mains",
      tags: ["seafood", "healthy"],
      restaurantId: restaurant.id
    },
    {
      name: "Craft Caesar Salad",
      description: "Romaine, house-made croutons, parmesan, anchovy dressing",
      price: "12.00",
      category: "Salads",
      tags: ["vegetarian option"],
      restaurantId: restaurant.id
    },
    {
      name: "Maple Bourbon Wings",
      description: "Crispy wings tossed in maple bourbon glaze, served with ranch",
      price: "14.00",
      category: "Appetizers",
      tags: ["spicy", "popular"],
      restaurantId: restaurant.id
    },
    {
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center, vanilla ice cream",
      price: "9.00",
      category: "Desserts",
      tags: ["dessert", "popular"],
      restaurantId: restaurant.id
    }
  ];

  for (const item of menuItemData) {
    await storage.createMenuItem(item);
  }

  // Sample FAQs
  const faqData = [
    {
      question: "Do you have vegan options?",
      answer: "Yes! We have several vegan dishes including our quinoa bowl, veggie burger, and seasonal salads. Just ask me for vegan recommendations!",
      restaurantId: restaurant.id
    },
    {
      question: "What are your hours?",
      answer: "We're open Tuesday-Sunday, 11am-10pm. Closed Mondays for deep cleaning and staff training.",
      restaurantId: restaurant.id
    },
    {
      question: "Do you take reservations?",
      answer: "Yes, we accept reservations for parties of 4 or more. You can call us or book through our website.",
      restaurantId: restaurant.id
    }
  ];

  for (const faq of faqData) {
    await storage.createFAQ(faq);
  }

  console.log('Database seeded successfully!');
}