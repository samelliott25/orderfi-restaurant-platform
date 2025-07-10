import { useState } from 'react';
import { ItemCard } from './ItemCard';
import { ItemModal } from './ItemModal';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number | string;
  image_url?: string;
  category: string;
  voice_aliases?: string[];
  aliases?: string[];
  modifiers?: Modifier[];
}

interface Modifier {
  id: number;
  name: string;
  price_delta: number;
  required?: boolean;
}

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem, modifiers: Modifier[], quantity: number) => void;
  searchQuery?: string;
  activeCategory?: string;
}

export function MenuGrid({ items, onAddToCart, searchQuery = '', activeCategory = 'all' }: MenuGridProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    if (searchQuery === '') {
      const matchesCategory = activeCategory === 'all' || 
        item.category.toLowerCase() === activeCategory.toLowerCase() ||
        item.category.toLowerCase().includes(activeCategory.toLowerCase());
      return matchesCategory;
    }

    // Enhanced search with pluralization handling
    const normalizeForSearch = (text: string): string => {
      return text.toLowerCase().replace(/s$/, ''); // Remove trailing 's' for pluralization
    };

    const searchTerms = searchQuery.toLowerCase().split(/\s+/);
    const itemName = item.name.toLowerCase();
    const itemDescription = item.description.toLowerCase();
    const itemCategory = item.category.toLowerCase();
    
    // Check if ANY search term matches ANY part of the item
    const matchesSearch = searchTerms.some(term => {
      const normalizedTerm = normalizeForSearch(term);
      const normalizedItemName = normalizeForSearch(itemName);
      const normalizedDescription = normalizeForSearch(itemDescription);
      
      const directMatch = itemName.includes(term) || itemDescription.includes(term) || itemCategory.includes(term);
      const normalizedMatch = normalizedItemName.includes(normalizedTerm) || normalizedDescription.includes(normalizedTerm) || normalizeForSearch(itemCategory).includes(normalizedTerm);
      const reverseMatch = term.includes(normalizedItemName.split(' ')[0]);
      const aliasesToCheck = item.voice_aliases || item.aliases || [];
      const aliasMatch = aliasesToCheck.some(alias => 
        alias.toLowerCase().includes(term) || 
        normalizeForSearch(alias.toLowerCase()).includes(normalizedTerm)
      );
      
      const matches = directMatch || normalizedMatch || reverseMatch || aliasMatch;
      
      // Debug logging for search
      if (matches) {
        console.log(`SEARCH MATCH: "${term}" found in "${item.name}"`, {
          term,
          normalizedTerm,
          itemName,
          normalizedItemName,
          directMatch,
          normalizedMatch,
          reverseMatch,
          aliasMatch
        });
      }
      
      return matches;
    });

    const matchesCategory = activeCategory === 'all' || 
      item.category.toLowerCase() === activeCategory.toLowerCase() ||
      item.category.toLowerCase().includes(activeCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddToCart = (modifiers: Modifier[], quantity: number) => {
    if (selectedItem) {
      onAddToCart(selectedItem, modifiers, quantity);
      setIsModalOpen(false);
      setSelectedItem(null);
    }
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numPrice.toFixed(2)}`;
  };

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No items found
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery ? `No items match "${searchQuery}"` : 'No items in this category'}
          </p>
        </div>
      </div>
    );
  }

  // Group items by category for horizontal scrolling layout
  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Define category order for better UX
  const categoryOrder = ['Starters', 'Mains', 'Desserts', 'Bar Snacks', 'Buffalo Wings', 'Dawgs', 'Tacos', 'Plant Powered', 'Burgers', 'From our grill'];
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  // If showing all categories or no search, show category-based horizontal scrolling
  if (activeCategory === 'all' && !searchQuery) {
    return (
      <>
        <div className="space-y-6">
          {sortedCategories.map((category) => (
            <div key={category} className="space-y-3">
              <h2 className="font-semibold text-lg playwrite-font bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent px-4">
                {category}
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 pl-4 scrollbar-hide">
                {groupedItems[category].map((item) => (
                  <div key={item.id} className="flex-shrink-0 w-[90vw] sm:w-[85vw] md:w-[80vw] lg:w-[75vw] xl:w-[70vw]">
                    <ItemCard
                      item={item}
                      onAddClick={() => handleItemClick(item)}
                      formatPrice={formatPrice}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <ItemModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
          formatPrice={formatPrice}
        />
      </>
    );
  }

  // For specific category or search results, show grid layout
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onAddClick={() => handleItemClick(item)}
            formatPrice={formatPrice}
          />
        ))}
      </div>

      <ItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
        formatPrice={formatPrice}
      />
    </>
  );
}