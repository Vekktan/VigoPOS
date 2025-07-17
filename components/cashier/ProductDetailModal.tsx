'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Star, Plus, Minus } from 'lucide-react';
import { StatusIndicator } from '@/components/StatusIndicator';
import type { MenuItem } from '@/app/cashier/page';

interface ProductDetailModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, options?: { [key: string]: string[] }) => void;
}

export function ProductDetailModal({ item, isOpen, onClose, onAddToCart }: ProductDetailModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({});
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setSelectedOptions({});
      setQuantity(1);
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  const calculateTotalPrice = () => {
    let totalPrice = item.price;

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

    return totalPrice * quantity;
  };

  const validateOptions = () => {
    if (!item.options) return true;

    for (const [optionKey, option] of Object.entries(item.options)) {
      if (option.required) {
        const selected = selectedOptions[optionKey];
        if (!selected || selected.length === 0) {
          setErrorMessage(`Silakan pilih ${optionKey}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleOptionChange = (optionKey: string, value: string, checked: boolean) => {
    setSelectedOptions((prev) => {
      const option = item.options?.[optionKey];
      if (!option) return prev;

      const currentValues = prev[optionKey] || [];

      if (option.type === 'single') {
        return {
          ...prev,
          [optionKey]: checked ? [value] : [],
        };
      } else {
        return {
          ...prev,
          [optionKey]: checked ? [...currentValues, value] : currentValues.filter((v) => v !== value),
        };
      }
    });

    // Clear error when user makes a selection
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleAddToCart = async () => {
    if (!validateOptions()) {
      setStatus('error');
      return;
    }

    setStatus('processing');

    try {
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      for (let i = 0; i < quantity; i++) {
        onAddToCart(item, selectedOptions);
      }

      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Gagal menambahkan item ke keranjang. Silakan coba lagi.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{item.name}</span>
            {item.isPromo && (
              <Badge className="bg-red-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                PROMO
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative">
            <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-full h-64 object-cover rounded-lg" />
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Deskripsi</h4>
            <p className="text-gray-600">{item.description}</p>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-500">Rp {item.price.toLocaleString()}</span>
            {item.originalPrice && <span className="text-lg text-gray-400 line-through">Rp {item.originalPrice.toLocaleString()}</span>}
          </div>

          {/* Options */}
          {item.options && Object.keys(item.options).length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800">Sesuaikan Pesanan Anda</h4>

              {Object.entries(item.options).map(([optionKey, option]) => (
                <div key={optionKey} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-medium text-gray-700 capitalize">{optionKey}</h5>
                    {option.required && (
                      <Badge variant="destructive" className="text-xs">
                        Wajib
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {option.type === 'single' ? 'Pilih satu' : 'Pilih beberapa'}
                    </Badge>
                  </div>

                  {option.type === 'single' ? (
                    <RadioGroup value={selectedOptions[optionKey]?.[0] || ''} onValueChange={(value) => handleOptionChange(optionKey, value, true)}>
                      {option.values.map((optionValue) => (
                        <div key={optionValue.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={optionValue.name} id={`${optionKey}-${optionValue.name}`} />
                            <Label htmlFor={`${optionKey}-${optionValue.name}`} className="font-medium">
                              {optionValue.name}
                            </Label>
                          </div>
                          {optionValue.price > 0 && <span className="text-sm font-medium text-green-600">+Rp {optionValue.price.toLocaleString()}</span>}
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="space-y-2">
                      {option.values.map((optionValue) => (
                        <div key={optionValue.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${optionKey}-${optionValue.name}`}
                              checked={selectedOptions[optionKey]?.includes(optionValue.name) || false}
                              onCheckedChange={(checked) => handleOptionChange(optionKey, optionValue.name, !!checked)}
                            />
                            <Label htmlFor={`${optionKey}-${optionValue.name}`} className="font-medium">
                              {optionValue.name}
                            </Label>
                          </div>
                          {optionValue.price > 0 && <span className="text-sm font-medium text-green-600">+Rp {optionValue.price.toLocaleString()}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">Jumlah</span>
            <div className="flex items-center space-x-3">
              <Button size="sm" variant="outline" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-bold text-lg w-8 text-center">{quantity}</span>
              <Button size="sm" variant="outline" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Status Indicator */}
          <StatusIndicator status={status} message={errorMessage} />

          {/* Total and Add to Cart */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-gray-800">Total</span>
              <span className="text-2xl font-bold text-orange-500">Rp {calculateTotalPrice().toLocaleString()}</span>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={status === 'processing'}>
                Batal
              </Button>
              <Button onClick={handleAddToCart} className="flex-1 bg-orange-500 hover:bg-orange-500" disabled={status === 'processing' || status === 'success'}>
                {status === 'processing' ? 'Menambahkan...' : status === 'success' ? 'Ditambahkan!' : 'Tambah ke Keranjang'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
