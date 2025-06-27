interface MenuCategory {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  priority: number;
}

interface CategoryRule {
  category: string;
  patterns: string[];
  priceRange?: { min?: number; max?: number };
  keywords: string[];
}

export class MenuCategorizationService {
  private categories: MenuCategory[] = [
    {
      id: 'appetizer',
      name: 'Appetizers',
      description: 'Starters and small plates',
      keywords: ['appetizer', 'starter', 'small plate', 'sharing', 'dip', 'wings', 'nachos', 'bruschetta', 'calamari', 'poppers', 'bites'],
      priority: 1
    },
    {
      id: 'salad',
      name: 'Salads',
      description: 'Fresh salads and healthy options',
      keywords: ['salad', 'greens', 'lettuce', 'spinach', 'caesar', 'garden', 'mixed greens', 'kale', 'arugula'],
      priority: 2
    },
    {
      id: 'soup',
      name: 'Soups',
      description: 'Hot soups and broths',
      keywords: ['soup', 'broth', 'bisque', 'chowder', 'stew', 'minestrone', 'tomato soup', 'chicken soup'],
      priority: 3
    },
    {
      id: 'main',
      name: 'Main Courses',
      description: 'Main dishes and entrees',
      keywords: ['main', 'entree', 'dish', 'plate', 'chicken', 'beef', 'pork', 'fish', 'salmon', 'steak', 'pasta', 'burger', 'sandwich'],
      priority: 4
    },
    {
      id: 'pasta',
      name: 'Pasta',
      description: 'Pasta dishes and Italian cuisine',
      keywords: ['pasta', 'spaghetti', 'linguine', 'penne', 'ravioli', 'lasagna', 'fettuccine', 'carbonara', 'bolognese', 'alfredo'],
      priority: 5
    },
    {
      id: 'pizza',
      name: 'Pizza',
      description: 'Pizzas and flatbreads',
      keywords: ['pizza', 'flatbread', 'margherita', 'pepperoni', 'hawaiian', 'supreme', 'veggie pizza'],
      priority: 6
    },
    {
      id: 'burger',
      name: 'Burgers',
      description: 'Burgers and sandwiches',
      keywords: ['burger', 'sandwich', 'club', 'wrap', 'panini', 'sub', 'hoagie', 'melt', 'blt'],
      priority: 7
    },
    {
      id: 'seafood',
      name: 'Seafood',
      description: 'Fresh seafood dishes',
      keywords: ['seafood', 'fish', 'salmon', 'tuna', 'shrimp', 'lobster', 'crab', 'scallops', 'mussels', 'oysters'],
      priority: 8
    },
    {
      id: 'side',
      name: 'Sides',
      description: 'Side dishes and accompaniments',
      keywords: ['side', 'fries', 'potato', 'rice', 'vegetables', 'bread', 'rolls', 'coleslaw', 'beans', 'corn'],
      priority: 9
    },
    {
      id: 'dessert',
      name: 'Desserts',
      description: 'Sweet treats and desserts',
      keywords: ['dessert', 'cake', 'pie', 'ice cream', 'chocolate', 'cheesecake', 'brownie', 'cookie', 'pudding', 'tart'],
      priority: 10
    },
    {
      id: 'beverage',
      name: 'Beverages',
      description: 'Drinks and beverages',
      keywords: ['drink', 'beverage', 'soda', 'juice', 'coffee', 'tea', 'water', 'lemonade', 'smoothie', 'shake'],
      priority: 11
    },
    {
      id: 'alcohol',
      name: 'Alcoholic Beverages',
      description: 'Beer, wine, and cocktails',
      keywords: ['beer', 'wine', 'cocktail', 'martini', 'whiskey', 'vodka', 'rum', 'gin', 'tequila', 'margarita'],
      priority: 12
    }
  ];

  private categoryRules: CategoryRule[] = [
    {
      category: 'appetizer',
      patterns: ['^(appetizer|starter|small plate)', 'wings?$', 'nachos?$', 'dip$', 'poppers?$'],
      priceRange: { max: 15 },
      keywords: ['share', 'small', 'starter', 'bite']
    },
    {
      category: 'salad',
      patterns: ['salad$', 'greens?$', 'caesar', 'garden'],
      keywords: ['lettuce', 'spinach', 'mixed', 'fresh']
    },
    {
      category: 'soup',
      patterns: ['soup$', 'broth$', 'bisque$', 'chowder$'],
      keywords: ['hot', 'warm', 'bowl']
    },
    {
      category: 'main',
      patterns: ['(chicken|beef|pork|fish|salmon|steak)', 'plate$', 'dish$'],
      priceRange: { min: 15 },
      keywords: ['grilled', 'roasted', 'pan-seared', 'braised']
    },
    {
      category: 'pasta',
      patterns: ['(pasta|spaghetti|linguine|penne|ravioli|lasagna|fettuccine)'],
      keywords: ['sauce', 'cheese', 'cream', 'tomato']
    },
    {
      category: 'pizza',
      patterns: ['pizza$', 'flatbread$'],
      keywords: ['cheese', 'crust', 'topping']
    },
    {
      category: 'burger',
      patterns: ['burger$', 'sandwich$', 'wrap$'],
      keywords: ['bun', 'bread', 'roll']
    },
    {
      category: 'seafood',
      patterns: ['(fish|salmon|tuna|shrimp|lobster|crab|scallops)'],
      keywords: ['fresh', 'grilled', 'pan-seared']
    },
    {
      category: 'side',
      patterns: ['(fries|potato|rice|vegetables?)$', '^side'],
      priceRange: { max: 10 },
      keywords: ['served with', 'comes with']
    },
    {
      category: 'dessert',
      patterns: ['(cake|pie|ice cream|chocolate|cheesecake|brownie)$'],
      keywords: ['sweet', 'vanilla', 'chocolate', 'berry']
    },
    {
      category: 'beverage',
      patterns: ['(soda|juice|coffee|tea|water)$'],
      priceRange: { max: 8 },
      keywords: ['drink', 'cold', 'hot', 'fresh']
    }
  ];

  categorizeMenuItem(name: string, description: string = '', price: string = '0'): string {
    const normalizedName = name.toLowerCase().trim();
    const normalizedDescription = description.toLowerCase().trim();
    const priceNum = parseFloat(price.replace(/[^0-9.]/g, ''));
    const combinedText = `${normalizedName} ${normalizedDescription}`;

    // Score each category
    const categoryScores: { [key: string]: number } = {};

    for (const rule of this.categoryRules) {
      let score = 0;

      // Pattern matching
      for (const pattern of rule.patterns) {
        const regex = new RegExp(pattern, 'i');
        if (regex.test(normalizedName)) score += 3;
        if (regex.test(normalizedDescription)) score += 2;
      }

      // Keyword matching
      for (const keyword of rule.keywords) {
        if (combinedText.includes(keyword)) score += 1;
      }

      // Price range matching
      if (rule.priceRange) {
        if (rule.priceRange.min && priceNum >= rule.priceRange.min) score += 1;
        if (rule.priceRange.max && priceNum <= rule.priceRange.max) score += 1;
      }

      categoryScores[rule.category] = score;
    }

    // Additional keyword scoring for all categories
    for (const category of this.categories) {
      if (!categoryScores[category.id]) categoryScores[category.id] = 0;
      
      for (const keyword of category.keywords) {
        if (combinedText.includes(keyword)) {
          categoryScores[category.id] += 1;
        }
      }
    }

    // Find highest scoring category
    let bestCategory = 'main';
    let highestScore = 0;

    for (const [category, score] of Object.entries(categoryScores)) {
      if (score > highestScore) {
        highestScore = score;
        bestCategory = category;
      }
    }

    // Convert category ID to display name
    const categoryInfo = this.categories.find(c => c.id === bestCategory);
    return categoryInfo ? categoryInfo.name : 'Main Courses';
  }

  categorizeMenuItems(items: Array<{ name: string; description?: string; price?: string }>): Array<{ name: string; description?: string; price?: string; category: string }> {
    return items.map(item => ({
      ...item,
      category: this.categorizeMenuItem(item.name, item.description || '', item.price || '0')
    }));
  }

  getCategories(): MenuCategory[] {
    return [...this.categories];
  }

  getCategoryByName(name: string): MenuCategory | undefined {
    return this.categories.find(c => c.name.toLowerCase() === name.toLowerCase());
  }

  validateCategory(categoryName: string): boolean {
    return this.categories.some(c => c.name.toLowerCase() === categoryName.toLowerCase());
  }
}

export const menuCategorizationService = new MenuCategorizationService();