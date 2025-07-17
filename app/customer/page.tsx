'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Plus, Minus, ArrowLeft, Trash2, Download, ChevronDown, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ProductOption {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: {
    id: string;
    name: string;
    price: number;
    available: boolean;
  }[];
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'Coffee' | 'Milk Based' | 'Makanan' | 'Dessert';
  image: string;
  description: string;
  options: ProductOption[];
}

interface CartItem extends MenuItem {
  quantity: number;
  selectedOptions: { [key: string]: string[] };
  notes: string;
  totalPrice: number;
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Americano',
    price: 18000,
    category: 'Coffee',
    image: '/placeholder.svg?height=300&width=300',
    description: 'Rich and bold espresso with hot water, perfect for coffee purists who enjoy the pure taste of coffee beans.',
    options: [
      {
        id: 'size',
        name: 'Pilihan Size',
        type: 'single',
        required: true,
        options: [
          { id: 'small', name: 'Small', price: 0, available: true },
          { id: 'medium', name: 'Medium', price: 3000, available: true },
          { id: 'large', name: 'Large', price: 5000, available: true },
        ],
      },
      {
        id: 'sugar',
        name: 'Tingkat Gula',
        type: 'single',
        required: false,
        options: [
          { id: 'normal', name: 'Normal', price: 0, available: true },
          { id: 'sedikit', name: 'Sedikit', price: 0, available: true },
          { id: 'tanpa', name: 'Tanpa Gula', price: 0, available: true },
        ],
      },
      {
        id: 'extra',
        name: 'Extra Shot (Opsional)',
        type: 'single',
        required: false,
        options: [
          { id: 'no', name: 'No', price: 0, available: true },
          { id: 'yes', name: 'Yes', price: 5000, available: true },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Cappuccino',
    price: 20000,
    category: 'Coffee',
    image: '/placeholder.svg?height=300&width=300',
    description: 'Perfect balance of espresso, steamed milk, and foam creating a creamy and rich coffee experience.',
    options: [
      {
        id: 'size',
        name: 'Pilihan Size',
        type: 'single',
        required: true,
        options: [
          { id: 'small', name: 'Small', price: 0, available: true },
          { id: 'medium', name: 'Medium', price: 3000, available: true },
          { id: 'large', name: 'Large', price: 5000, available: true },
        ],
      },
      {
        id: 'sugar',
        name: 'Tingkat Gula',
        type: 'single',
        required: false,
        options: [
          { id: 'normal', name: 'Normal', price: 0, available: true },
          { id: 'sedikit', name: 'Sedikit', price: 0, available: true },
          { id: 'tanpa', name: 'Tanpa Gula', price: 0, available: true },
        ],
      },
      {
        id: 'extra',
        name: 'Extra Shot (Opsional)',
        type: 'single',
        required: false,
        options: [
          { id: 'no', name: 'No', price: 0, available: true },
          { id: 'yes', name: 'Yes', price: 5000, available: true },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Matcha Latte',
    price: 22000,
    category: 'Milk Based',
    image: '/placeholder.svg?height=300&width=300',
    description: 'Premium Japanese matcha powder blended with steamed milk for a smooth and earthy flavor profile.',
    options: [
      {
        id: 'size',
        name: 'Pilihan Size',
        type: 'single',
        required: true,
        options: [
          { id: 'small', name: 'Small', price: 0, available: true },
          { id: 'medium', name: 'Medium', price: 3000, available: true },
          { id: 'large', name: 'Large', price: 5000, available: true },
        ],
      },
      {
        id: 'sugar',
        name: 'Tingkat Gula',
        type: 'single',
        required: false,
        options: [
          { id: 'normal', name: 'Normal', price: 0, available: true },
          { id: 'sedikit', name: 'Sedikit', price: 0, available: true },
          { id: 'tanpa', name: 'Tanpa Gula', price: 0, available: true },
        ],
      },
      {
        id: 'extra',
        name: 'Extra Shot (Opsional)',
        type: 'single',
        required: false,
        options: [
          { id: 'no', name: 'No', price: 0, available: true },
          { id: 'yes', name: 'Yes', price: 5000, available: true },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Caramel Macchiato',
    price: 25000,
    originalPrice: 30000,
    category: 'Milk Based',
    image: '/placeholder.svg?height=300&width=300',
    description: 'Espresso with vanilla syrup and caramel drizzle, topped with steamed milk foam.',
    options: [
      {
        id: 'size',
        name: 'Pilihan Size',
        type: 'single',
        required: true,
        options: [
          { id: 'small', name: 'Small', price: 0, available: true },
          { id: 'medium', name: 'Medium', price: 3000, available: true },
          { id: 'large', name: 'Large', price: 5000, available: true },
        ],
      },
      {
        id: 'sugar',
        name: 'Tingkat Gula',
        type: 'single',
        required: false,
        options: [
          { id: 'normal', name: 'Normal', price: 0, available: true },
          { id: 'sedikit', name: 'Sedikit', price: 0, available: true },
          { id: 'tanpa', name: 'Tanpa Gula', price: 0, available: true },
        ],
      },
      {
        id: 'extra',
        name: 'Extra Shot (Opsional)',
        type: 'single',
        required: false,
        options: [
          { id: 'no', name: 'No', price: 0, available: true },
          { id: 'yes', name: 'Yes', price: 5000, available: true },
        ],
      },
    ],
  },
  {
    id: '5',
    name: 'Croissant',
    price: 15000,
    category: 'Makanan',
    image: '/placeholder.svg?height=300&width=300',
    description: 'Buttery and flaky French pastry, freshly baked daily with premium butter.',
    options: [],
  },
  {
    id: '6',
    name: 'Sandwich Club',
    price: 28000,
    category: 'Makanan',
    image: '/placeholder.svg?height=300&width=300',
    description: 'Triple layer sandwich with grilled chicken, fresh vegetables, and special sauce.',
    options: [],
  },
  {
    id: '7',
    name: 'Tiramisu',
    price: 18000,
    category: 'Dessert',
    image: '/placeholder.svg?height=300&width=300',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.',
    options: [],
  },
  {
    id: '8',
    name: 'Cheesecake',
    price: 20000,
    category: 'Dessert',
    image: '/placeholder.svg?height=300&width=300',
    description: 'Creamy New York style cheesecake with graham cracker crust.',
    options: [],
  },
];

const categories = ['Coffee', 'Milk Based', 'Makanan', 'Dessert'];

export default function CustomerApp() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Coffee');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'menu' | 'detail' | 'cart' | 'qris'>('menu');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);

  // Product detail states
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({});
  const [notes, setNotes] = useState('');

  // Cart states
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsApp, setCustomerWhatsApp] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [orderType, setOrderType] = useState('Dine In');
  const [tableNumber] = useState('TBL 25');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [editingCartIndex, setEditingCartIndex] = useState<number | null>(null);

  const openProductDetail = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setSelectedOptions({});
    setNotes('');
    setEditingCartIndex(null); // Reset editing index
    setCurrentView('detail');
  };

  const openAddToCartModal = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setSelectedOptions({});
    setNotes('');
    setEditingCartIndex(null); // Reset editing index
    setShowAddToCartModal(true);
  };

  const handleOptionChange = (optionId: string, valueId: string, isMultiple: boolean) => {
    setSelectedOptions((prev) => {
      if (isMultiple) {
        const current = prev[optionId] || [];
        const updated = current.includes(valueId) ? current.filter((id) => id !== valueId) : [...current, valueId];
        return { ...prev, [optionId]: updated };
      } else {
        return { ...prev, [optionId]: [valueId] };
      }
    });
  };

  const calculateTotalPrice = () => {
    if (!selectedItem) return 0;

    let total = selectedItem.price * quantity;

    selectedItem.options.forEach((option) => {
      const selectedValues = selectedOptions[option.id] || [];
      selectedValues.forEach((valueId) => {
        const optionValue = option.options.find((opt) => opt.id === valueId);
        if (optionValue) {
          total += optionValue.price * quantity;
        }
      });
    });

    return total;
  };

  const addToCart = () => {
    if (!selectedItem) return;

    const cartItem: CartItem = {
      ...selectedItem,
      quantity,
      selectedOptions: { ...selectedOptions }, // Deep copy
      notes,
      totalPrice: calculateTotalPrice(),
    };

    if (editingCartIndex !== null) {
      // Mode edit - update item yang sudah ada
      setCart((prev) => prev.map((item, index) => (index === editingCartIndex ? cartItem : item)));
      setEditingCartIndex(null);
      setCurrentView('cart'); // Kembali ke cart setelah edit
    } else {
      // Mode tambah baru
      setCart((prev) => [...prev, cartItem]);
      setCurrentView('menu'); // Kembali ke menu setelah tambah
    }

    setShowAddToCartModal(false);
    // Reset form
    setSelectedItem(null);
    setQuantity(1);
    setSelectedOptions({});
    setNotes('');
  };

  const updateCartItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeCartItem(index);
      return;
    }

    setCart((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, quantity: newQuantity };
          updatedItem.totalPrice = calculateItemPrice(updatedItem);
          return updatedItem;
        }
        return item;
      })
    );
  };

  const removeCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateItemPrice = (item: CartItem) => {
    let total = item.price * item.quantity;

    item.options.forEach((option) => {
      const selectedValues = item.selectedOptions[option.id] || [];
      selectedValues.forEach((valueId) => {
        const optionValue = option.options.find((opt) => opt.id === valueId);
        if (optionValue) {
          total += optionValue.price * item.quantity;
        }
      });
    });

    return total;
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openEditModal = (index: number) => {
    const cartItem = cart[index];

    // Buat MenuItem object dari CartItem
    const menuItem: MenuItem = {
      id: cartItem.id,
      name: cartItem.name,
      price: cartItem.price,
      originalPrice: cartItem.originalPrice,
      category: cartItem.category,
      image: cartItem.image,
      description: cartItem.description,
      options: cartItem.options,
    };

    setSelectedItem(menuItem);
    setQuantity(cartItem.quantity);
    setSelectedOptions({ ...cartItem.selectedOptions }); // Deep copy
    setNotes(cartItem.notes || '');
    setEditingCartIndex(index);
    setShowAddToCartModal(true);
  };

  const closeModal = () => {
    setShowAddToCartModal(false);
    setEditingCartIndex(null);
    setSelectedItem(null);
    setQuantity(1);
    setSelectedOptions({});
    setNotes('');
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const serviceCharge = Math.round(totalCartAmount * 0.1); // 10% service charge
  const finalTotal = totalCartAmount + serviceCharge;

  // Menu View
  if (currentView === 'menu') {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1"></div>
                <h1 className="text-2xl font-bold text-gray-900">ROKA</h1>
                <div className="flex-1 flex justify-end">
                  <Button variant="outline" size="sm" className="relative bg-transparent" onClick={() => setCurrentView('cart')}>
                    <ShoppingCart className="w-5 h-5" />
                    {totalCartItems > 0 && <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">{totalCartItems}</Badge>}
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input placeholder="Cari menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
              </div>

              {/* Category Filter */}
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap px-6 py-2 ${selectedCategory === category ? 'bg-orange-500 hover:bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-500 hover:border-orange-500'}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </header>

          {/* Menu Items Grid */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="relative bg-white rounded-2xl shadow-lg border-0 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    {/* Image Container - Clickable */}
                    <div className="relative mb-4 cursor-pointer" onClick={() => openProductDetail(item)}>
                      <div className="w-full h-40 bg-gray-100 rounded-full mx-auto mt-4 flex items-center justify-center overflow-hidden" style={{ width: '120px', height: '120px' }}>
                        <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-full h-full object-cover rounded-full" />
                      </div>
                    </div>

                    {/* Content - Clickable */}
                    <div className="px-4 pb-4 space-y-1 cursor-pointer" onClick={() => openProductDetail(item)}>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h3>
                      <p className="text-gray-500 text-sm">{item.category}</p>
                      <p className="font-bold text-orange-500 text-lg">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>

                    {/* Add Button - positioned at bottom right edge */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddToCartModal(item);
                      }}
                      className="absolute -bottom-0 -right-0 w-12 h-12 rounded-tl-2xl rounded-br-2xl bg-orange-500 hover:bg-orange-500 p-0 shadow-md border-0"
                    >
                      <Plus className="w-5 h-5 text-white" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Dialog
          open={showAddToCartModal}
          onOpenChange={(open) => {
            if (!open) closeModal();
          }}
        >
          <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto p-0">
            {selectedItem && (
              <div className="flex flex-col h-full">
                {/* HEADER */}
                <div className="flex items-center justify-between p-4 border-b bg-white">
                  <Button variant="ghost" size="sm" onClick={closeModal} className="p-1">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </Button>
                  <h3 className="text-lg font-semibold text-gray-900">{editingCartIndex !== null ? 'Edit pembelian' : 'Custom pembelian'}</h3>

                  <div className="w-8"></div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                  {/* PRODUCT TITLE AND PRICE */}
                  <div className="p-4 bg-white border-b">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xl font-semibold text-gray-900">{selectedItem.name}</h4>
                      <span className="text-lg font-semibold text-gray-900">{selectedItem.price.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* OPTIONS */}
                  <div className="space-y-1">
                    {selectedItem.options.map((option) => (
                      <div key={option.id} className="bg-white border-b">
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="text-base font-medium text-gray-900">{option.name}</h5>
                            <div className="flex items-center space-x-2">
                              {option.required && <span className="text-sm text-orange-500 font-medium">Harus dipilih</span>}
                              <span className="text-sm text-gray-500">Pilih 1</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {option.options.map((opt) => (
                              <div key={opt.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center ${selectedOptions[option.id]?.includes(opt.id) ? 'border-orange-500 bg-orange-500' : 'border-gray-300'}`}
                                    onClick={() => handleOptionChange(option.id, opt.id, false)}
                                  >
                                    {selectedOptions[option.id]?.includes(opt.id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                  </div>
                                  <span className="text-base text-gray-900">{opt.name}</span>
                                </div>
                                <span className="text-base text-gray-900">{opt.price > 0 ? `+${opt.price.toLocaleString('id-ID')}` : 'Gratis'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* NOTES SECTION */}
                  <div className="bg-white border-b p-4">
                    <label className="block text-base font-medium text-gray-900 mb-3">Catatan</label>
                    <Textarea placeholder="Tambahkan catatan khusus..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border-gray-300 focus:border-orange-500 focus:ring-orage-500 text-base" />
                  </div>
                </div>

                {/* BOTTOM SECTION - QUANTITY AND ADD TO CART */}
                <div className="bg-white border-t p-4">
                  {/* QUANTITY SELECTOR */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-medium text-gray-900">Jumlah pembelian</span>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full border-gray-300 hover:bg-gray-50 p-0">
                        <Minus className="w-4 h-4 text-gray-600" />
                      </Button>
                      <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                      <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full border-orange-500 bg-orange-500 hover:bg-orange-600 text-white p-0">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* ADD TO CART BUTTON */}
                  <Button onClick={addToCart} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-base font-semibold rounded-full">
                    {editingCartIndex !== null ? 'Update pembelian' : 'Tambah pembelian'} - {calculateTotalPrice().toLocaleString('id-ID')}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Product Detail View
  if (currentView === 'detail' && selectedItem) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('menu')} className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Detail Produk</h1>
          </div>
        </header>

        <div className="px-6 py-6">
          {/* Product Image */}
          <div className="mb-6">
            <img src={selectedItem.image || '/placeholder.svg'} alt={selectedItem.name} className="w-full h-64 object-cover rounded-2xl" />
          </div>

          {/* Product Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.name}</h1>
            <p className="text-gray-600 mb-4 leading-relaxed">{selectedItem.description}</p>
            <p className="text-2xl font-bold text-orange-500">Rp {selectedItem.price.toLocaleString('id-ID')}</p>
          </div>

          {/* Options */}
          {selectedItem.options.map((option) => (
            <div key={option.id} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {option.name} {option.required && '(Choose 1)'}
              </h3>

              <div className="space-y-2">
                {option.options.map((opt) => (
                  <div key={opt.id} className="flex items-center space-x-3 py-2">
                    <Checkbox
                      id={opt.id}
                      checked={selectedOptions[option.id]?.includes(opt.id) || false}
                      onCheckedChange={(checked) => {
                        if (option.type === 'single') {
                          if (checked) {
                            setSelectedOptions((prev) => ({ ...prev, [option.id]: [opt.id] }));
                          }
                        } else {
                          if (checked) {
                            handleOptionChange(option.id, opt.id, true);
                          } else {
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [option.id]: (prev[option.id] || []).filter((id) => id !== opt.id),
                            }));
                          }
                        }
                      }}
                      disabled={!opt.available}
                      className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    <Label htmlFor={opt.id} className={`flex-1 ${!opt.available ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {opt.name}
                      {opt.price > 0 && ` (+Rp ${opt.price.toLocaleString('id-ID')})`}
                      {!opt.available && ' (Out of Stock)'}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Notes */}
          <div className="mb-6">
            <Label className="text-lg font-semibold text-orange-900 mb-3 block">Catatan</Label>
            <Textarea placeholder="Beri catatan kepada restoran..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
          </div>
        </div>

        {/* Bottom Section - Sticky */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full">
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
              <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-500 text-white border-orange-500">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Total Price */}
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-orange-500">Rp {calculateTotalPrice().toLocaleString('id-ID')}</p>
            </div>
          </div>

          <Button onClick={addToCart} className="w-full bg-orange-500 hover:bg-orange-500 text-white py-4 text-lg font-semibold">
            Add to Cart
          </Button>
        </div>

        {/* Add padding to prevent content from being hidden behind sticky footer */}
        <div className="h-32"></div>
      </div>
    );
  }

  // Cart View
  if (currentView === 'cart') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('menu')} className="mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bayar</h1>
                <p className="text-sm text-gray-600">{tableNumber}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 py-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Keranjang masih kosong</p>
              <Button onClick={() => setCurrentView('menu')} className="bg-orange-500 hover:bg-orange-500 text-white">
                Mulai Belanja
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <Card key={index} className="bg-white shadow-sm border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex flex-row-reverse items-start justify-between gap-4">
                        {/* Gambar Produk (kanan) */}
                        <div className="w-20 h-20 flex-shrink-0">
                          <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        </div>

                        {/* Konten Kiri */}
                        <div className="flex-1 space-y-2">
                          <h4 className="font-bold text-lg text-gray-900">{item.name}</h4>

                          {/* Opsi */}
                          <div className="space-y-1 text-sm text-gray-600">
                            {Object.entries(item.selectedOptions).map(([optionId, values]) => {
                              const option = item.options.find((opt) => opt.id === optionId);
                              if (!option || values.length === 0) return null;

                              return (
                                <div key={optionId}>
                                  {values.map((valueId) => {
                                    const optionValue = option.options.find((opt) => opt.id === valueId);
                                    if (!optionValue) return null;

                                    let displayText = '';
                                    if (option.name === 'Pilihan Size') {
                                      displayText = `Cup Size 19 : Iced - ${optionValue.name}`;
                                    } else if (option.name === 'Tingkat Gula') {
                                      displayText = `Sugar : ${optionValue.name}`;
                                    } else if (option.name === 'Extra Shot (Opsional)') {
                                      if (optionValue.name === 'Yes') {
                                        displayText = `Extra Shot : Yes`;
                                      }
                                    } else {
                                      displayText = `${option.name} : ${optionValue.name}`;
                                    }

                                    return displayText ? (
                                      <div key={valueId} className="flex items-center">
                                        <span className="font-medium text-gray-700">{displayText.split(' : ')[0]} :</span>
                                        <span className="ml-1 text-gray-600">{displayText.split(' : ')[1]}</span>
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              );
                            })}
                          </div>

                          {/* Harga */}
                          <div>
                            <span className="text-xl font-bold text-gray-900">{item.totalPrice.toLocaleString('id-ID')}</span>
                          </div>

                          {/* Tombol Edit & Quantity */}
                          <div className="flex items-center gap-2 flex-wrap pt-2">
                            <Button variant="outline" size="sm" className="flex items-center gap-1 border-gray-300 text-gray-600 hover:bg-gray-50" onClick={() => openEditModal(index)}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit</span>
                            </Button>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
                                className="w-9 h-9 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 p-0 flex items-center justify-center"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="text-lg font-semibold text-gray-900 w-6 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
                                className="w-9 h-9 rounded-full border-2 border-orange-500 bg-orange-500 text-white hover:bg-orange-600 p-0 flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Customer Information */}
              <Card className="mb-6">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Nama Customer</Label>
                    <Input placeholder="Nama Customer" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Nomor WhatsApp</Label>
                    <Input placeholder="Nomor WhatsApp Anda" value={customerWhatsApp} onChange={(e) => setCustomerWhatsApp(e.target.value)} className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Catatan Tambahan</Label>
                    <Textarea placeholder="Tambahkan catatan untuk pesanan..." value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} rows={3} className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                  </div>
                </CardContent>
              </Card>

              {/* Payment and Order Details */}
              <Card className="mb-6">
                <CardContent className="p-4 space-y-4">
                  {/* Payment Method */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Pilihan Pembayaran</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="QRIS">QRIS</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Order Type */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">Jenis Pesanan</Label>
                    <RadioGroup value={orderType} onValueChange={setOrderType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Dine In" id="dine-in" className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
                        <Label htmlFor="dine-in">Dine In</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Take Away" id="take-away" className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500" />
                        <Label htmlFor="take-away">Take Away</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span className="text-orange-500">Rp {totalCartAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Biaya Layanan (10%)</span>
                      <span className="text-orange-500">Rp {serviceCharge.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total</span>
                      <span className="text-orange-500">Rp {finalTotal.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Sticky Footer */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total Akhir:</span>
              <span className="text-xl font-bold text-orange-500">Rp {finalTotal.toLocaleString('id-ID')}</span>
            </div>
            <Button
              className="w-full bg-orange--500 hover:bg-orange-500 text-white py-4 text-lg font-semibold"
              onClick={() => {
                if (paymentMethod === 'QRIS') {
                  setCurrentView('qris');
                } else {
                  alert('Pesanan berhasil dibuat!');
                }
              }}
            >
              Buat Pesanan
            </Button>
          </div>
        )}

        {/* Add padding to prevent content from being hidden behind sticky footer */}
        {cart.length > 0 && <div className="h-32"></div>}
      </div>
    );
  }

  // QRIS Payment View
  if (currentView === 'qris') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setCurrentView('cart')} className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">QRIS Payment</h1>
          </div>
        </header>

        <div className="px-6 py-6">
          {/* QRIS and GPN Logos */}
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className="bg-red-600 text-white px-4 py-2 rounded font-bold text-lg">QRIS</div>
            <div className="bg-orange-500 text-white px-4 py-2 rounded font-bold text-lg">GPN</div>
          </div>

          {/* Merchant Info */}
          <Card className="mb-6">
            <CardContent className="p-4 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">ROKA Coffee Shop</h2>
              <p className="text-gray-600">NMID: 123456789012345</p>
              <p className="text-orange-500 font-semibold text-lg mt-2">Total: Rp {finalTotal.toLocaleString('id-ID')}</p>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                  <img src="/placeholder.svg?height=240&width=240" alt="QR Code" className="w-60 h-60 object-contain" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <Button variant="outline" className="w-full py-3 text-lg border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white bg-transparent">
              Check Payment Status
            </Button>

            <Button variant="outline" className="w-full py-3 text-lg bg-transparent">
              <Download className="w-5 h-5 mr-2" />
              Download QR
            </Button>
          </div>

          {/* How to Pay Dropdown */}
          <Card>
            <CardContent className="p-4">
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <span className="text-gray-700">How to pay with QRIS</span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
