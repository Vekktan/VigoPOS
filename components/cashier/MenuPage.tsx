'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CartSidebar } from './CartSidebar';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { MenuItem, CartItem, Category, Order } from '@/app/cashier/page';

interface MenuPageProps {
  menuItems: MenuItem[];
  categories: Category[];
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  onOrderComplete: (order: Order) => void;
}

export function MenuPage({ menuItems, categories, cart, setCart, onOrderComplete }: MenuPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (item: MenuItem, options?: { [key: string]: string[] }) => {
    try {
      // Calculate total price including options
      let totalPrice = item.price;
      const selectedOptions = options || {};

      if (item.options) {
        Object.entries(selectedOptions).forEach(([optionKey, selectedValues]) => {
          const option = item.options?.[optionKey];
          if (option) {
            selectedValues.forEach((selectedValue) => {
              const optionValue = option.values.find((v) => v.name === selectedValue);
              if (optionValue) {
                totalPrice += optionValue.price;
              }
            });
          }
        });
      }

      setCart((prev) => {
        const existingIndex = prev.findIndex((cartItem) => cartItem.id === item.id && JSON.stringify(cartItem.selectedOptions) === JSON.stringify(selectedOptions));

        if (existingIndex >= 0) {
          const updatedCart = prev.map((cartItem, index) => (index === existingIndex ? { ...cartItem, quantity: cartItem.quantity + 1, totalPrice: totalPrice * (cartItem.quantity + 1) } : cartItem));

          // Auto-show cart when item is added
          setShowCart(true);
          return updatedCart;
        }

        const newCart = [
          ...prev,
          {
            ...item,
            quantity: 1,
            selectedOptions,
            orderType: 'dine-in',
            notes: '',
            totalPrice,
          },
        ];

        // Auto-show cart when item is added
        setShowCart(true);
        return newCart;
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const allCategories = [{ id: 'all', name: 'Semua', description: '', itemCount: menuItems.length, icon: '🌟' }, ...categories];

  return (
    <ErrorBoundary>
      <div className="flex h-full">
        {/* Main Content */}
        <div className={`flex-1 p-6 transition-all duration-300 ${showCart ? 'mr-80' : ''}`}>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input placeholder="Cari menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12 text-base rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500" />
          </div>

          {/* Category Filter - Updated styling */}
          <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
            {allCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 min-w-fit whitespace-nowrap border
                  ${selectedCategory === category.id ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300'}
                `}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Product Grid - Responsive based on cart visibility */}
          <div className={`grid gap-6 ${showCart ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {filteredItems.map((item) => (
              <ProductCard key={item.id} item={item} onAddToCart={addToCart} onViewDetails={() => setSelectedItem(item)} />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-500 text-lg">Tidak ada menu ditemukan</p>
              <p className="text-gray-400">Coba sesuaikan pencarian atau filter kategori</p>
            </div>
          )}
        </div>

        {/* Cart Sidebar - Show when cart has items */}
        {showCart && cart.length > 0 && <CartSidebar cart={cart} setCart={setCart} onOrderComplete={onOrderComplete} onClose={() => setShowCart(false)} />}

        {/* Product Detail Modal */}
        {selectedItem && <ProductDetailModal item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} onAddToCart={addToCart} />}
      </div>
    </ErrorBoundary>
  );
}
