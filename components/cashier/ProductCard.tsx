'use client';

import type React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Star, Info } from 'lucide-react';
import type { MenuItem } from '@/app/cashier/page';

interface ProductCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, options?: { [key: string]: string[] }) => void;
  onViewDetails: () => void;
}

export function ProductCard({ item, onAddToCart, onViewDetails }: ProductCardProps) {
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.options && Object.keys(item.options).some((key) => item.options![key].required)) {
      // If has required options, open details modal
      onViewDetails();
    } else {
      // Quick add without options
      onAddToCart(item);
    }
  };

  return (
    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-md overflow-hidden">
      <CardContent className="p-0">
        <div className="relative" onClick={onViewDetails}>
          <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-full h-48 object-cover" />
          {item.isPromo && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
              <Star className="w-3 h-3 mr-1" />
              PROMO
            </Badge>
          )}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Info className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={handleQuickAdd}
              className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-4" onClick={onViewDetails}>
          <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-orange-500">Rp {item.price.toLocaleString()}</span>
              {item.originalPrice && <span className="text-sm text-gray-400 line-through">Rp {item.originalPrice.toLocaleString()}</span>}
            </div>
            {item.options && Object.keys(item.options).length > 0 && (
              <Badge variant="outline" className="text-xs">
                Dapat Disesuaikan
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
