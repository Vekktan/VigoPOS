'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Percent, Plus } from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';
import { CartSidebar } from './CartSidebar';
import type { MenuItem, CartItem, Order } from '@/app/cashier/page';

interface PromoPageProps {
  menuItems: MenuItem[];
  cart: CartItem[];
  setCart: (cart: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
  onOrderComplete: (order: Order) => void;
}

export function PromoPage({ menuItems, cart, setCart, onOrderComplete }: PromoPageProps) {
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
        const existingIndex = prev.findIndex((cartItem) => cartItem.id === item.id && JSON.stringify(cartItem.selectedOptions || {}) === JSON.stringify(selectedOptions));

        if (existingIndex >= 0) {
          const updatedCart = prev.map((cartItem, index) =>
            index === existingIndex
              ? {
                  ...cartItem,
                  quantity: cartItem.quantity + 1,
                  totalPrice: totalPrice * (cartItem.quantity + 1),
                }
              : cartItem
          );

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
      console.error('Error adding promo item to cart:', error);
    }
  };

  const handleQuickAdd = (item: MenuItem) => {
    if (item.options && Object.keys(item.options).some((key) => item.options![key].required)) {
      // If has required options, open details modal
      setSelectedItem(item);
    } else {
      // Quick add without options
      addToCart(item);
    }
  };

  return (
    <div className="flex h-full">
      <div className={`flex-1 p-6  transition-all duration-300 ${showCart ? 'mr-80' : ''}`}>
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Percent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Promo Spesial</h2>
              <p className="text-gray-600">Penawaran terbatas dan diskon menarik</p>
            </div>
          </div>
        </div>

        {menuItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak Ada Promo Tersedia</h3>
            <p className="text-gray-500">Periksa kembali nanti untuk penawaran spesial!</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${showCart ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {menuItems.map((item) => (
              <Card key={item.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative" onClick={() => setSelectedItem(item)}>
                    <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-full h-48 object-cover" />
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse">
                      <Star className="w-3 h-3 mr-1" />
                      PROMO
                    </Badge>
                    {item.originalPrice && <Badge className="absolute top-3 right-3 bg-green-500 text-white shadow-lg">{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF</Badge>}

                    {/* Quick Add Button */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAdd(item);
                        }}
                        className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg hover:shadow-xl"
                      >
                        <Plus className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4" onClick={() => setSelectedItem(item)}>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-red-600">Rp {item.price.toLocaleString()}</span>
                        {item.originalPrice && <span className="text-sm text-gray-400 line-through">Rp {item.originalPrice.toLocaleString()}</span>}
                      </div>
                      <div className="flex flex-col items-end space-y-1 text-xs leading-tight">
                        {item.originalPrice && (
                          <Badge variant="outline" className="text-green-600 border-green-600 text-[10px]">
                            Hemat Rp {(item.originalPrice - item.price).toLocaleString()}
                          </Badge>
                        )}
                        {item.options && Object.keys(item.options).length > 0 && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-600 text-[10px]">
                            Dapat Disesuaikan
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && cart.length > 0 && <CartSidebar cart={cart} setCart={setCart} onOrderComplete={onOrderComplete} onClose={() => setShowCart(false)} />}

      {/* Product Detail Modal */}
      {selectedItem && <ProductDetailModal item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} onAddToCart={addToCart} />}
    </div>
  );
}
