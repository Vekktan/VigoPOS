// Contoh request API untuk testing CoffeePOS dengan Supabase

import { itemApi, categoryApi } from '@/services/api';
import type { MenuItem, Category } from '@/app/cashier/page';

// ============================================================================
// CATEGORY API EXAMPLES
// ============================================================================

// 1. Create a new category
export async function createCategoryExample() {
  try {
    const newCategory = await categoryApi.create({
      name: 'Beverages',
      description: 'Hot and cold drinks',
      icon: '🥤'
    });
    console.log('Category created:', newCategory);
    return newCategory;
  } catch (error) {
    console.error('Error creating category:', error);
  }
}

// 2. Get all categories with item count
export async function getCategoriesExample() {
  try {
    const categories = await categoryApi.getWithItemCount();
    console.log('Categories:', categories);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// 3. Update a category
export async function updateCategoryExample(categoryId: string) {
  try {
    const updatedCategory = await categoryApi.update(categoryId, {
      name: 'Updated Beverages',
      description: 'Updated description',
      icon: '🍹'
    });
    console.log('Category updated:', updatedCategory);
    return updatedCategory;
  } catch (error) {
    console.error('Error updating category:', error);
  }
}

// 4. Delete a category
export async function deleteCategoryExample(categoryId: string) {
  try {
    await categoryApi.delete(categoryId);
    console.log('Category deleted successfully');
  } catch (error) {
    console.error('Error deleting category:', error);
  }
}

// ============================================================================
// ITEM API EXAMPLES
// ============================================================================

// 1. Create a new item with options
export async function createItemExample() {
  try {
    const newItem = await itemApi.create({
      name: 'Iced Latte',
      description: 'Smooth espresso with cold milk and ice',
      price: 42000,
      category: '550e8400-e29b-41d4-a716-446655440001', // Coffee category ID
      image: '/placeholder.svg?height=200&width=200',
      isPromo: false,
    }, {
      size: {
        type: 'single',
        required: true,
        values: [
          { name: 'Small', price: 0 },
          { name: 'Medium', price: 3000 },
          { name: 'Large', price: 6000 }
        ]
      },
      milk: {
        type: 'single',
        required: false,
        values: [
          { name: 'Regular Milk', price: 0 },
          { name: 'Oat Milk', price: 5000 },
          { name: 'Almond Milk', price: 5000 },
          { name: 'Soy Milk', price: 4000 }
        ]
      },
      extras: {
        type: 'multiple',
        required: false,
        values: [
          { name: 'Extra Shot', price: 8000 },
          { name: 'Whipped Cream', price: 3000 },
          { name: 'Caramel Syrup', price: 2000 },
          { name: 'Vanilla Syrup', price: 2000 }
        ]
      }
    });
    console.log('Item created:', newItem);
    return newItem;
  } catch (error) {
    console.error('Error creating item:', error);
  }
}

// 2. Create a promotional item
export async function createPromoItemExample() {
  try {
    const promoItem = await itemApi.create({
      name: 'Special Cappuccino',
      description: 'Limited time offer - our signature cappuccino',
      price: 28000, // Discounted price
      originalPrice: 35000, // Original price
      category: '550e8400-e29b-41d4-a716-446655440001', // Coffee category ID
      image: '/placeholder.svg?height=200&width=200',
      isPromo: true,
    }, {
      size: {
        type: 'single',
        required: true,
        values: [
          { name: 'Regular', price: 0 },
          { name: 'Large', price: 5000 }
        ]
      }
    });
    console.log('Promo item created:', promoItem);
    return promoItem;
  } catch (error) {
    console.error('Error creating promo item:', error);
  }
}

// 3. Get all items with options
export async function getItemsExample() {
  try {
    const items = await itemApi.getAll();
    console.log('Items:', items);
    return items;
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

// 4. Get item by ID
export async function getItemByIdExample(itemId: string) {
  try {
    const item = await itemApi.getById(itemId);
    console.log('Item:', item);
    return item;
  } catch (error) {
    console.error('Error fetching item:', error);
  }
}

// 5. Update an item
export async function updateItemExample(itemId: string) {
  try {
    const updatedItem = await itemApi.update(itemId, {
      name: 'Updated Iced Latte',
      description: 'Updated description',
      price: 45000,
      isPromo: true,
      originalPrice: 50000,
    }, {
      size: {
        type: 'single',
        required: true,
        values: [
          { name: 'Small', price: 0 },
          { name: 'Medium', price: 3000 },
          { name: 'Large', price: 6000 },
          { name: 'Extra Large', price: 9000 }
        ]
      }
    });
    console.log('Item updated:', updatedItem);
    return updatedItem;
  } catch (error) {
    console.error('Error updating item:', error);
  }
}

// 6. Delete an item
export async function deleteItemExample(itemId: string) {
  try {
    await itemApi.delete(itemId);
    console.log('Item deleted successfully');
  } catch (error) {
    console.error('Error deleting item:', error);
  }
}

// ============================================================================
// COMPLEX EXAMPLES
// ============================================================================

// Create a complete menu setup
export async function createCompleteMenuExample() {
  try {
    // 1. Create categories
    const coffeeCategory = await categoryApi.create({
      name: 'Coffee',
      description: 'Hot and cold coffee beverages',
      icon: '☕'
    });

    const foodCategory = await categoryApi.create({
      name: 'Food',
      description: 'Main dishes and meals',
      icon: '🍽️'
    });

    const dessertCategory = await categoryApi.create({
      name: 'Desserts',
      description: 'Sweet treats and desserts',
      icon: '🍰'
    });

    console.log('Categories created:', { coffeeCategory, foodCategory, dessertCategory });

    // 2. Create items for each category
    const items = [];

    // Coffee items
    const americano = await itemApi.create({
      name: 'Americano',
      description: 'Classic black coffee made with espresso and hot water',
      price: 32000,
      category: coffeeCategory.id,
      image: '/placeholder.svg?height=200&width=200',
      isPromo: false,
    }, {
      size: {
        type: 'single',
        required: true,
        values: [
          { name: 'Small', price: 0 },
          { name: 'Medium', price: 2000 },
          { name: 'Large', price: 4000 }
        ]
      },
      strength: {
        type: 'single',
        required: false,
        values: [
          { name: 'Regular', price: 0 },
          { name: 'Strong', price: 1000 },
          { name: 'Extra Strong', price: 2000 }
        ]
      }
    });
    items.push(americano);

    // Food items
    const sandwich = await itemApi.create({
      name: 'Club Sandwich',
      description: 'Triple-layered sandwich with grilled chicken, bacon, lettuce, tomato, and mayo',
      price: 45000,
      category: foodCategory.id,
      image: '/placeholder.svg?height=200&width=200',
      isPromo: false,
    }, {
      bread: {
        type: 'single',
        required: true,
        values: [
          { name: 'White Bread', price: 0 },
          { name: 'Whole Wheat', price: 2000 },
          { name: 'Sourdough', price: 3000 }
        ]
      },
      extras: {
        type: 'multiple',
        required: false,
        values: [
          { name: 'Extra Cheese', price: 3000 },
          { name: 'Extra Bacon', price: 5000 },
          { name: 'Avocado', price: 4000 }
        ]
      }
    });
    items.push(sandwich);

    // Dessert items
    const cake = await itemApi.create({
      name: 'Chocolate Cake',
      description: 'Rich, moist chocolate cake with layers of chocolate ganache',
      price: 35000,
      originalPrice: 40000,
      category: dessertCategory.id,
      image: '/placeholder.svg?height=200&width=200',
      isPromo: true,
    }, {
      size: {
        type: 'single',
        required: true,
        values: [
          { name: 'Slice', price: 0 },
          { name: 'Half Cake', price: 150000 },
          { name: 'Full Cake', price: 280000 }
        ]
      },
      toppings: {
        type: 'multiple',
        required: false,
        values: [
          { name: 'Whipped Cream', price: 3000 },
          { name: 'Chocolate Shavings', price: 2000 },
          { name: 'Fresh Berries', price: 5000 }
        ]
      }
    });
    items.push(cake);

    console.log('Complete menu created:', items);
    return { categories: [coffeeCategory, foodCategory, dessertCategory], items };

  } catch (error) {
    console.error('Error creating complete menu:', error);
  }
}

// ============================================================================
// TESTING UTILITIES
// ============================================================================

// Test all CRUD operations
export async function testAllOperations() {
  console.log('=== Testing Category Operations ===');
  
  // Create category
  const newCategory = await createCategoryExample();
  if (!newCategory) return;

  // Update category
  const updatedCategory = await updateCategoryExample(newCategory.id);
  if (!updatedCategory) return;

  // Get categories
  await getCategoriesExample();

  console.log('=== Testing Item Operations ===');

  // Create item
  const newItem = await createItemExample();
  if (!newItem) return;

  // Update item
  const updatedItem = await updateItemExample(newItem.id);
  if (!updatedItem) return;

  // Get items
  await getItemsExample();

  // Get specific item
  await getItemByIdExample(newItem.id);

  console.log('=== Testing Delete Operations ===');

  // Delete item
  await deleteItemExample(newItem.id);

  // Delete category
  await deleteCategoryExample(newCategory.id);

  console.log('=== All tests completed ===');
}

// Run tests in browser console
export function runTestsInBrowser() {
  // Add to window object for browser console access
  (window as any).testCoffeePOS = {
    createCategoryExample,
    getCategoriesExample,
    updateCategoryExample,
    deleteCategoryExample,
    createItemExample,
    createPromoItemExample,
    getItemsExample,
    getItemByIdExample,
    updateItemExample,
    deleteItemExample,
    createCompleteMenuExample,
    testAllOperations
  };

  console.log('CoffeePOS API tests loaded. Use testCoffeePOS.testAllOperations() to run all tests.');
} 