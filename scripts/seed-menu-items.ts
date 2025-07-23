import { supabase } from '../lib/supabase';

async function seedMenuItems() {
  console.log('Seeding menu items...');

  // First, ensure categories exist
  const categories = [
    { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Coffee', description: 'Hot and cold coffee beverages', icon: '☕' },
    { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Milk Based', description: 'Milk-based beverages', icon: '🥛' },
    { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Makanan', description: 'Main dishes and meals', icon: '🍽️' },
    { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Dessert', description: 'Sweet treats and desserts', icon: '🍰' }
  ];

  // Insert categories
  for (const category of categories) {
    const { error } = await supabase
      .from('categories')
      .upsert([category], { onConflict: 'id' });
    
    if (error) {
      console.error(`Error upserting category ${category.name}:`, error);
    } else {
      console.log(`Category ${category.name} upserted successfully`);
    }
  }

  // Menu items data
  const menuItems = [
    {
      id: '660e8400-e29b-41d4-a716-446655440001',
      name: 'Americano',
      description: 'Rich and bold espresso with hot water, perfect for coffee purists who enjoy the pure taste of coffee beans.',
      price: 18000,
      original_price: null,
      category_id: '550e8400-e29b-41d4-a716-446655440001',
      image_url: '/placeholder.svg?height=300&width=300',
      is_promo: false,
      options: [
        {
          name: 'Pilihan Size',
          type: 'single' as const,
          required: true,
          values: [
            { name: 'Small', price: 0 },
            { name: 'Medium', price: 3000 },
            { name: 'Large', price: 5000 },
          ],
        },
        {
          name: 'Tingkat Gula',
          type: 'single' as const,
          required: false,
          values: [
            { name: 'Normal', price: 0 },
            { name: 'Sedikit', price: 0 },
            { name: 'Tanpa Gula', price: 0 },
          ],
        },
        {
          name: 'Extra Shot (Opsional)',
          type: 'single' as const,
          required: false,
          values: [
            { name: 'No', price: 0 },
            { name: 'Yes', price: 5000 },
          ],
        },
      ],
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440002',
      name: 'Cappuccino',
      description: 'Perfect balance of espresso, steamed milk, and foam creating a creamy and rich coffee experience.',
      price: 20000,
      original_price: null,
      category_id: '550e8400-e29b-41d4-a716-446655440001',
      image_url: '/placeholder.svg?height=300&width=300',
      is_promo: false,
      options: [
        {
          name: 'Pilihan Size',
          type: 'single' as const,
          required: true,
          values: [
            { name: 'Small', price: 0 },
            { name: 'Medium', price: 3000 },
            { name: 'Large', price: 5000 },
          ],
        },
        {
          name: 'Tingkat Gula',
          type: 'single' as const,
          required: false,
          values: [
            { name: 'Normal', price: 0 },
            { name: 'Sedikit', price: 0 },
            { name: 'Tanpa Gula', price: 0 },
          ],
        },
        {
          name: 'Extra Shot (Opsional)',
          type: 'single' as const,
          required: false,
          values: [
            { name: 'No', price: 0 },
            { name: 'Yes', price: 5000 },
          ],
        },
      ],
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440003',
      name: 'Matcha Latte',
      description: 'Premium Japanese matcha powder blended with steamed milk for a smooth and earthy flavor profile.',
      price: 22000,
      original_price: null,
      category_id: '550e8400-e29b-41d4-a716-446655440002',
      image_url: '/placeholder.svg?height=300&width=300',
      is_promo: false,
      options: [
        {
          name: 'Pilihan Size',
          type: 'single' as const,
          required: true,
          values: [
            { name: 'Small', price: 0 },
            { name: 'Medium', price: 3000 },
            { name: 'Large', price: 5000 },
          ],
        },
        {
          name: 'Tingkat Gula',
          type: 'single' as const,
          required: false,
          values: [
            { name: 'Normal', price: 0 },
            { name: 'Sedikit', price: 0 },
            { name: 'Tanpa Gula', price: 0 },
          ],
        },
        {
          name: 'Extra Shot (Opsional)',
          type: 'single' as const,
          required: false,
          values: [
            { name: 'No', price: 0 },
            { name: 'Yes', price: 5000 },
          ],
        },
      ],
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440004',
      name: 'Caramel Macchiato',
      description: 'Espresso with vanilla syrup and caramel drizzle, topped with steamed milk foam.',
      price: 25000,
      original_price: 30000,
      category_id: '550e8400-e29b-41d4-a716-446655440002',
      image_url: '/placeholder.svg?height=300&width=300',
      is_promo: true,
      options: [
        {
          name: 'Pilihan Size',
          type: 'single' as const,
          required: true,
          values: [
            { name: 'Small', price: 0 },
            { name: 'Medium', price: 3000 },
            { name: 'Large', price: 5000 },
          ],
        },
        {
          name: 'Tingkat Gula',
          type: 'single' as const,
          required: false,
          values: [
            { name: 'Normal', price: 0 },
            { name: 'Sedikit', price: 0 },
            { name: 'Tanpa Gula', price: 0 },
          ],
        },
        {
          name: 'Extra Shot (Opsional)',
          type: 'single' as const,
          required: false,
          values: [
            { name: 'No', price: 0 },
            { name: 'Yes', price: 5000 },
          ],
        },
      ],
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440005',
      name: 'Croissant',
      description: 'Buttery and flaky French pastry, freshly baked daily with premium butter.',
      price: 15000,
      original_price: null,
      category_id: '550e8400-e29b-41d4-a716-446655440003',
      image_url: '/placeholder.svg?height=300&width=300',
      is_promo: false,
      options: [],
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440006',
      name: 'Sandwich Club',
      description: 'Triple layer sandwich with grilled chicken, fresh vegetables, and special sauce.',
      price: 28000,
      original_price: null,
      category_id: '550e8400-e29b-41d4-a716-446655440003',
      image_url: '/placeholder.svg?height=300&width=300',
      is_promo: false,
      options: [],
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440007',
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.',
      price: 18000,
      original_price: null,
      category_id: '550e8400-e29b-41d4-a716-446655440004',
      image_url: '/placeholder.svg?height=300&width=300',
      is_promo: false,
      options: [],
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440008',
      name: 'Cheesecake',
      description: 'Creamy New York style cheesecake with graham cracker crust.',
      price: 20000,
      original_price: null,
      category_id: '550e8400-e29b-41d4-a716-446655440004',
      image_url: '/placeholder.svg?height=300&width=300',
      is_promo: false,
      options: [],
    },
  ];

  // Insert menu items and their options
  for (const item of menuItems) {
    // Insert the item
    const { data: insertedItem, error: itemError } = await supabase
      .from('items')
      .upsert([{
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        original_price: item.original_price,
        category_id: item.category_id,
        image_url: item.image_url,
        is_promo: item.is_promo,
      }], { onConflict: 'id' })
      .select()
      .single();

    if (itemError) {
      console.error(`Error upserting item ${item.name}:`, itemError);
      continue;
    }

    console.log(`Item ${item.name} upserted successfully`);

    // Insert options for this item
    for (const option of item.options) {
      const { data: insertedOption, error: optionError } = await supabase
        .from('item_options')
        .upsert([{
          item_id: item.id,
          name: option.name,
          type: option.type,
          required: option.required,
        }], { onConflict: 'item_id,name' })
        .select()
        .single();

      if (optionError) {
        console.error(`Error upserting option ${option.name} for ${item.name}:`, optionError);
        continue;
      }

      // Insert option values
      for (const value of option.values) {
        const { error: valueError } = await supabase
          .from('item_option_values')
          .upsert([{
            item_option_id: insertedOption.id,
            name: value.name,
            price: value.price,
          }], { onConflict: 'item_option_id,name' });

        if (valueError) {
          console.error(`Error upserting value ${value.name} for option ${option.name}:`, valueError);
        }
      }
    }
  }

  console.log('Menu items seeded successfully!');
}

// Run the seeding function
seedMenuItems(); 