'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Package, Plus, Edit, Trash2, Tag, Percent, DollarSign } from 'lucide-react';
import type { MenuItem, Category } from '@/app/cashier/page';

interface ItemsPageProps {
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

interface ItemOption {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  values: Array<{
    name: string;
    price: number;
  }>;
}

const availableIcons = [
  { value: '☕', label: 'Coffee' },
  { value: '🍽️', label: 'Food' },
  { value: '🍪', label: 'Snacks' },
  { value: '🍰', label: 'Dessert' },
  { value: '🥤', label: 'Drinks' },
  { value: '🍕', label: 'Pizza' },
  { value: '🍔', label: 'Burger' },
  { value: '🍜', label: 'Noodles' },
  { value: '🍣', label: 'Sushi' },
  { value: '🥗', label: 'Salad' },
  { value: '🍦', label: 'Ice Cream' },
  { value: '🧁', label: 'Cupcake' },
];

export function ItemsPage({ menuItems, setMenuItems, categories, setCategories }: ItemsPageProps) {
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Item form state
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    isPromo: false,
    discountPercentage: '',
    options: [] as ItemOption[],
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: '',
  });

  const resetItemForm = () => {
    setItemForm({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      image: '',
      isPromo: false,
      discountPercentage: '',
      options: [],
    });
    setEditingItem(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      icon: '',
    });
    setEditingCategory(null);
  };

  const addOption = () => {
    const newOption: ItemOption = {
      id: Date.now().toString(),
      name: '',
      type: 'single',
      required: false,
      values: [{ name: '', price: 0 }],
    };
    setItemForm((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
  };

  const updateOption = (optionId: string, updates: Partial<ItemOption>) => {
    setItemForm((prev) => ({
      ...prev,
      options: prev.options.map((option) => (option.id === optionId ? { ...option, ...updates } : option)),
    }));
  };

  const removeOption = (optionId: string) => {
    setItemForm((prev) => ({
      ...prev,
      options: prev.options.filter((option) => option.id !== optionId),
    }));
  };

  const addOptionValue = (optionId: string) => {
    setItemForm((prev) => ({
      ...prev,
      options: prev.options.map((option) => (option.id === optionId ? { ...option, values: [...option.values, { name: '', price: 0 }] } : option)),
    }));
  };

  const updateOptionValue = (optionId: string, valueIndex: number, updates: { name?: string; price?: number }) => {
    setItemForm((prev) => ({
      ...prev,
      options: prev.options.map((option) =>
        option.id === optionId
          ? {
              ...option,
              values: option.values.map((value, index) => (index === valueIndex ? { ...value, ...updates } : value)),
            }
          : option
      ),
    }));
  };

  const removeOptionValue = (optionId: string, valueIndex: number) => {
    setItemForm((prev) => ({
      ...prev,
      options: prev.options.map((option) =>
        option.id === optionId
          ? {
              ...option,
              values: option.values.filter((_, index) => index !== valueIndex),
            }
          : option
      ),
    }));
  };

  const calculateDiscountedPrice = () => {
    if (!itemForm.price || !itemForm.discountPercentage) return '';
    const originalPrice = Number.parseFloat(itemForm.price);
    const discount = Number.parseFloat(itemForm.discountPercentage);
    const discountedPrice = originalPrice - (originalPrice * discount) / 100;
    return Math.round(discountedPrice).toString();
  };

  const handleSaveItem = () => {
    if (!itemForm.name || !itemForm.price || !itemForm.category) return;

    let finalPrice = Number.parseInt(itemForm.price);
    let originalPrice = undefined;

    // Handle discount calculation
    if (itemForm.isPromo && itemForm.discountPercentage) {
      originalPrice = Number.parseInt(itemForm.price);
      const discount = Number.parseFloat(itemForm.discountPercentage);
      finalPrice = Math.round(originalPrice - (originalPrice * discount) / 100);
    }

    // Convert options to the format expected by MenuItem
    const options: MenuItem['options'] = {};
    itemForm.options.forEach((option) => {
      if (option.name && option.values.filter((v) => v.name.trim()).length > 0) {
        const optionKey = option.name.toLowerCase().replace(/\s+/g, '');
        options[optionKey] = {
          type: option.type,
          required: option.required,
          values: option.values.filter((v) => v.name.trim()),
        };
      }
    });

    const newItem: MenuItem = {
      id: editingItem?.id || `item-${Date.now()}`,
      name: itemForm.name,
      description: itemForm.description,
      price: finalPrice,
      originalPrice: originalPrice,
      category: itemForm.category,
      image: itemForm.image || '/placeholder.svg?height=200&width=200',
      isPromo: itemForm.isPromo,
      options: Object.keys(options).length > 0 ? options : undefined,
    };

    if (editingItem) {
      setMenuItems(menuItems.map((item) => (item.id === editingItem.id ? newItem : item)));
    } else {
      setMenuItems([...menuItems, newItem]);
    }

    // Update category item count
    setCategories(
      categories.map((cat) => ({
        ...cat,
        itemCount: menuItems.filter((item) => item.category === cat.id).length,
      }))
    );

    setShowItemDialog(false);
    resetItemForm();
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name || !categoryForm.icon) {
      alert('Nama kategori dan ikon harus diisi!');
      return;
    }

    const newCategory: Category = {
      id: editingCategory?.id || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
      name: categoryForm.name,
      description: categoryForm.description,
      itemCount: editingCategory?.itemCount || 0,
      icon: categoryForm.icon,
    };

    if (editingCategory) {
      setCategories(categories.map((cat) => (cat.id === editingCategory.id ? newCategory : cat)));
    } else {
      setCategories([...categories, newCategory]);
    }

    setShowCategoryDialog(false);
    resetCategoryForm();
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);

    // Convert options back to form format
    const options: ItemOption[] = [];
    if (item.options) {
      Object.entries(item.options).forEach(([key, option], index) => {
        options.push({
          id: `${index}`,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          type: option.type,
          required: option.required,
          values: option.values,
        });
      });
    }

    let discountPercentage = '';
    if (item.isPromo && item.originalPrice) {
      discountPercentage = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100).toString();
    }

    setItemForm({
      name: item.name,
      description: item.description,
      price: (item.originalPrice || item.price).toString(),
      originalPrice: item.originalPrice?.toString() || '',
      category: item.category,
      image: item.image,
      isPromo: item.isPromo,
      discountPercentage: discountPercentage,
      options: options,
    });
    setShowItemDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      icon: category.icon,
    });
    setShowCategoryDialog(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== itemId));
    // Update category item counts
    setCategories(
      categories.map((cat) => ({
        ...cat,
        itemCount: menuItems.filter((item) => item.category === cat.id && item.id !== itemId).length,
      }))
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId));
    // Remove items in this category
    setMenuItems(menuItems.filter((item) => item.category !== categoryId));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
              <p className="text-gray-600">Manage menu items and categories with custom options</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="items" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Menu Items ({menuItems.length})</h3>
            <Button
              onClick={() => {
                resetItemForm();
                setShowItemDialog(true);
              }}
              className="bg-orange-500 hover:bg-orange-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <span>{item.name}</span>
                        {item.isPromo && (
                          <Badge className="bg-red-500 text-white">
                            <Tag className="w-3 h-3 mr-1" />
                            PROMO
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => handleEditItem(item)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-orange-500">Rp {item.price.toLocaleString()}</span>
                      {item.originalPrice && <span className="text-sm text-gray-400 line-through">Rp {item.originalPrice.toLocaleString()}</span>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{item.category}</Badge>
                      {item.options && Object.keys(item.options).length > 0 && <Badge className="text-xs bg-orange-500 text-white">{Object.keys(item.options).length} Options</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Categories ({categories.length})</h3>
            <Button
              onClick={() => {
                resetCategoryForm();
                setShowCategoryDialog(true);
              }}
              className="bg-orange-500 hover:bg-orange-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <span className="text-2xl">{category.icon}</span>
                        <span>{category.name}</span>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(category.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{category.itemCount} items</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Item Dialog */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input placeholder="Item name" value={itemForm.name} onChange={(e) => setItemForm((prev) => ({ ...prev, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Select value={itemForm.category} onValueChange={(value) => setItemForm((prev) => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Textarea placeholder="Item description" value={itemForm.description} onChange={(e) => setItemForm((prev) => ({ ...prev, description: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rp)</label>
                <Input type="number" placeholder="0" value={itemForm.price} onChange={(e) => setItemForm((prev) => ({ ...prev, price: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <Input placeholder="https://example.com/image.jpg" value={itemForm.image} onChange={(e) => setItemForm((prev) => ({ ...prev, image: e.target.value }))} />
              </div>
            </div>

            {/* Promo Section */}
            <div className="border rounded-lg p-4 bg-red-50">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox id="isPromo" checked={itemForm.isPromo} onCheckedChange={(checked) => setItemForm((prev) => ({ ...prev, isPromo: !!checked }))} />
                <label htmlFor="isPromo" className="text-sm font-medium text-gray-700 flex items-center">
                  <Percent className="w-4 h-4 mr-1" />
                  Mark as promotional item
                </label>
              </div>

              {itemForm.isPromo && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                    <Input type="number" placeholder="0" value={itemForm.discountPercentage} onChange={(e) => setItemForm((prev) => ({ ...prev, discountPercentage: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Final Price</label>
                    <Input value={calculateDiscountedPrice()} disabled className="bg-gray-100" />
                  </div>
                </div>
              )}
            </div>

            {/* Item Options */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-800 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Item Options (with pricing)
                </h4>
                <Button type="button" onClick={addOption} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
              </div>

              <div className="space-y-4">
                {itemForm.options.map((option) => (
                  <div key={option.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <Input placeholder="Option name (e.g., Size, Sugar Level)" value={option.name} onChange={(e) => updateOption(option.id, { name: e.target.value })} />
                        <div className="flex items-center space-x-2">
                          <Checkbox id={`required-${option.id}`} checked={option.required} onCheckedChange={(checked) => updateOption(option.id, { required: !!checked })} />
                          <Label htmlFor={`required-${option.id}`} className="text-sm">
                            Required
                          </Label>
                        </div>
                      </div>
                      <Button type="button" onClick={() => removeOption(option.id)} size="sm" variant="outline" className="text-red-600 ml-3">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Selection Type</label>
                      <RadioGroup value={option.type} onValueChange={(value: 'single' | 'multiple') => updateOption(option.id, { type: value })} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id={`single-${option.id}`} />
                          <Label htmlFor={`single-${option.id}`}>Single Choice</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="multiple" id={`multiple-${option.id}`} />
                          <Label htmlFor={`multiple-${option.id}`}>Multiple Choice</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Option Values & Prices</label>
                      <div className="space-y-2">
                        {option.values.map((value, valueIndex) => (
                          <div key={valueIndex} className="flex space-x-2">
                            <Input placeholder="Option value (e.g., Small, Medium, Large)" value={value.name} onChange={(e) => updateOptionValue(option.id, valueIndex, { name: e.target.value })} className="flex-1" />
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-600">+Rp</span>
                              <Input type="number" placeholder="0" value={value.price} onChange={(e) => updateOptionValue(option.id, valueIndex, { price: Number(e.target.value) || 0 })} className="w-24" />
                            </div>
                            <Button type="button" onClick={() => removeOptionValue(option.id, valueIndex)} size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button type="button" onClick={() => addOptionValue(option.id)} size="sm" variant="outline" className="w-full">
                          <Plus className="w-4 h-4 mr-1" />
                          Add Value
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button variant="outline" onClick={() => setShowItemDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveItem} className="flex-1 bg-orange-500 hover:bg-orange-500">
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <Input placeholder="Category name" value={categoryForm.name} onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon *</label>
              <Select value={categoryForm.icon} onValueChange={(value) => setCategoryForm((prev) => ({ ...prev, icon: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{icon.value}</span>
                        <span>{icon.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Textarea placeholder="Category description" value={categoryForm.description} onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))} />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button variant="outline" onClick={() => setShowCategoryDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveCategory} className="flex-1 bg-orange-500 hover:bg-orange-500">
                {editingCategory ? 'Update Category' : 'Add Category'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
