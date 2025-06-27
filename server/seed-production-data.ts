import { storage } from "./storage.js";

export async function seedProductionData() {
  console.log("🌱 Seeding production data...");

  try {
    // Create test customers for rewards system
    const testCustomers = [
      {
        email: 'alice@example.com',
        name: 'Alice Johnson',
        points: 150,
        tier: 'Silver',
        orders_count: 5
      },
      {
        email: 'bob@example.com', 
        name: 'Bob Smith',
        points: 75,
        tier: 'Bronze',
        orders_count: 2
      },
      {
        email: 'charlie@example.com',
        name: 'Charlie Brown',
        points: 320,
        tier: 'Gold',
        orders_count: 12
      },
      {
        email: 'diana@example.com',
        name: 'Diana Prince',
        points: 580,
        tier: 'Platinum',
        orders_count: 23
      },
      {
        email: 'test@example.com',
        name: 'Test User',
        points: 25,
        tier: 'Bronze',
        orders_count: 1
      }
    ];

    // Create test orders with rewards
    const restaurants = await storage.getAllRestaurants();
    const restaurant = restaurants[0];

    if (restaurant) {
      for (const customer of testCustomers) {
        // Create sample orders for each customer
        for (let i = 0; i < customer.orders_count; i++) {
          const order = await storage.createOrder({
            restaurant_id: restaurant.id,
            customer_email: customer.email,
            customer_name: customer.name,
            items: JSON.stringify([
              { id: 1, name: 'Classic Burger', quantity: 1, price: 12.99 },
              { id: 2, name: 'Fries', quantity: 1, price: 4.99 }
            ]),
            total: "17.98",
            status: 'completed',
            payment_method: 'card',
            notes: `Order ${i + 1} for ${customer.name}`
          });

          console.log(`   ✓ Created order #${order.id} for ${customer.name}`);
        }
      }
    }

    console.log("✅ Production data seeded successfully");
    console.log(`   - ${testCustomers.length} test customers created`);
    console.log(`   - ${testCustomers.reduce((sum, c) => sum + c.orders_count, 0)} orders created`);
    console.log(`   - ${testCustomers.reduce((sum, c) => sum + c.points, 0)} total reward points distributed`);

  } catch (error) {
    console.error("❌ Error seeding production data:", error);
    throw error;
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProductionData()
    .then(() => {
      console.log("🎉 Seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}