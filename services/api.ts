import { supabase } from '@/lib/supabase';
import type { MenuItem, Category } from '@/app/cashier/page';

// Category API functions
export const categoryApi = {
  // Get all categories
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }

    return data.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon,
      itemCount: 0, // Will be calculated separately
    }));
  },

  // Create new category
  async create(category: Omit<Category, 'id' | 'itemCount'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        description: category.description,
        icon: category.icon,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      icon: data.icon,
      itemCount: 0,
    };
  },

  // Update category
  async update(id: string, updates: Partial<Omit<Category, 'id' | 'itemCount'>>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: updates.name,
        description: updates.description,
        icon: updates.icon,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      icon: data.icon,
      itemCount: 0, // Will be calculated separately
    };
  },

  // Delete category
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  },

  // Get category with item count
  async getWithItemCount(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        items:items(count)
      `)
      .order('name');

    if (error) {
      console.error('Error fetching categories with item count:', error);
      throw new Error('Failed to fetch categories');
    }

    return data.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon,
      itemCount: (cat.items as any[])[0]?.count || 0,
    }));
  },
};

// Item API functions
export const itemApi = {
  // Get all items with options
  async getAll(): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        categories(name),
        item_options(
          *,
          item_option_values(*)
        )
      `)
      .order('name');

    if (error) {
      console.error('Error fetching items:', error);
      throw new Error('Failed to fetch items');
    }

    return data.map(item => {
      // Convert options to the format expected by MenuItem
      const options: MenuItem['options'] = {};
      if (item.item_options) {
        item.item_options.forEach((option: any) => {
          const optionKey = option.name.toLowerCase().replace(/\s+/g, '');
          options[optionKey] = {
            type: option.type,
            required: option.required,
            values: option.item_option_values.map((value: any) => ({
              name: value.name,
              price: value.price,
            })),
          };
        });
      }

      return {
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        originalPrice: item.original_price || undefined,
        category: item.category_id,
        image: item.image_url || '/placeholder.svg?height=200&width=200',
        isPromo: item.is_promo,
        options: Object.keys(options).length > 0 ? options : undefined,
      };
    });
  },

  // Create new item with options
  async create(item: Omit<MenuItem, 'id'>, options?: MenuItem['options']): Promise<MenuItem> {
    // Start a transaction
    const { data: itemData, error: itemError } = await supabase
      .from('items')
      .insert({
        name: item.name,
        description: item.description,
        price: item.price,
        original_price: item.originalPrice || null,
        category_id: item.category,
        image_url: item.image,
        is_promo: item.isPromo,
      })
      .select()
      .single();

    if (itemError) {
      console.error('Error creating item:', itemError);
      throw new Error('Failed to create item');
    }

    // Insert options if provided
    if (options && Object.keys(options).length > 0) {
      for (const [optionKey, option] of Object.entries(options)) {
        const { data: optionData, error: optionError } = await supabase
          .from('item_options')
          .insert({
            item_id: itemData.id,
            name: optionKey.charAt(0).toUpperCase() + optionKey.slice(1),
            type: option.type,
            required: option.required,
          })
          .select()
          .single();

        if (optionError) {
          console.error('Error creating item option:', optionError);
          throw new Error('Failed to create item option');
        }

        // Insert option values
        if (option.values.length > 0) {
          const optionValues = option.values.map(value => ({
            item_option_id: optionData.id,
            name: value.name,
            price: value.price,
          }));

          const { error: valuesError } = await supabase
            .from('item_option_values')
            .insert(optionValues);

          if (valuesError) {
            console.error('Error creating item option values:', valuesError);
            throw new Error('Failed to create item option values');
          }
        }
      }
    }

    return {
      id: itemData.id,
      name: itemData.name,
      description: itemData.description || '',
      price: itemData.price,
      originalPrice: itemData.original_price || undefined,
      category: itemData.category_id,
      image: itemData.image_url || '/placeholder.svg?height=200&width=200',
      isPromo: itemData.is_promo,
      options,
    };
  },

  // Update item with options
  async update(id: string, updates: Partial<Omit<MenuItem, 'id'>>, options?: MenuItem['options']): Promise<MenuItem> {
    // Update item
    const { data: itemData, error: itemError } = await supabase
      .from('items')
      .update({
        name: updates.name,
        description: updates.description,
        price: updates.price,
        original_price: updates.originalPrice || null,
        category_id: updates.category,
        image_url: updates.image,
        is_promo: updates.isPromo,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (itemError) {
      console.error('Error updating item:', itemError);
      throw new Error('Failed to update item');
    }

    // Delete existing options and recreate them
    if (options !== undefined) {
      // Delete existing options (this will cascade delete option values)
      await supabase
        .from('item_options')
        .delete()
        .eq('item_id', id);

      // Insert new options
      if (options && Object.keys(options).length > 0) {
        for (const [optionKey, option] of Object.entries(options)) {
          const { data: optionData, error: optionError } = await supabase
            .from('item_options')
            .insert({
              item_id: id,
              name: optionKey.charAt(0).toUpperCase() + optionKey.slice(1),
              type: option.type,
              required: option.required,
            })
            .select()
            .single();

          if (optionError) {
            console.error('Error creating item option:', optionError);
            throw new Error('Failed to create item option');
          }

          // Insert option values
          if (option.values.length > 0) {
            const optionValues = option.values.map(value => ({
              item_option_id: optionData.id,
              name: value.name,
              price: value.price,
            }));

            const { error: valuesError } = await supabase
              .from('item_option_values')
              .insert(optionValues);

            if (valuesError) {
              console.error('Error creating item option values:', valuesError);
              throw new Error('Failed to create item option values');
            }
          }
        }
      }
    }

    return {
      id: itemData.id,
      name: itemData.name,
      description: itemData.description || '',
      price: itemData.price,
      originalPrice: itemData.original_price || undefined,
      category: itemData.category_id,
      image: itemData.image_url || '/placeholder.svg?height=200&width=200',
      isPromo: itemData.is_promo,
      options,
    };
  },

  // Delete item
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
      throw new Error('Failed to delete item');
    }
  },

  // Get item by ID with options
  async getById(id: string): Promise<MenuItem | null> {
    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        categories(name),
        item_options(
          *,
          item_option_values(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching item:', error);
      return null;
    }

    // Convert options to the format expected by MenuItem
    const options: MenuItem['options'] = {};
    if (data.item_options) {
      data.item_options.forEach((option: any) => {
        const optionKey = option.name.toLowerCase().replace(/\s+/g, '');
        options[optionKey] = {
          type: option.type,
          required: option.required,
          values: option.item_option_values.map((value: any) => ({
            name: value.name,
            price: value.price,
          })),
        };
      });
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: data.price,
      originalPrice: data.original_price || undefined,
      category: data.category_id,
      image: data.image_url || '/placeholder.svg?height=200&width=200',
      isPromo: data.is_promo,
      options: Object.keys(options).length > 0 ? options : undefined,
    };
  },
}; 