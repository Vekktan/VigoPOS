'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description: string;
  isPromo: boolean;
  options: ProductOption[];
}

export interface ProductOption {
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

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch items with their categories
      const { data: items, error: itemsError } = await supabase
        .from('items')
        .select(`
          *,
          categories (
            name
          )
        `)
        .order('name');

      if (itemsError) {
        throw itemsError;
      }

      // Fetch item options for each item
      const itemsWithOptions = await Promise.all(
        (items || []).map(async (item) => {
          const { data: itemOptions, error: optionsError } = await supabase
            .from('item_options')
            .select(`
              *,
              item_option_values (*)
            `)
            .eq('item_id', item.id);

          if (optionsError) {
            console.error(`Error fetching options for item ${item.id}:`, optionsError);
            return null;
          }

          // Transform options to match the expected format
          const transformedOptions: ProductOption[] = (itemOptions || []).map((option) => ({
            id: option.id,
            name: option.name,
            type: option.type,
            required: option.required,
                         options: (option.item_option_values || []).map((value: any) => ({
              id: value.id,
              name: value.name,
              price: value.price,
              available: true, // Default to available
            })),
          }));

          // Transform item to match MenuItem interface
          const menuItem: MenuItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.original_price || undefined,
            category: (item.categories as any)?.name || 'Other',
            image: item.image_url || '/placeholder.svg?height=300&width=300',
            description: item.description || '',
            isPromo: item.is_promo,
            options: transformedOptions,
          };

          return menuItem;
        })
      );

      // Filter out null items and set menu items
      const validItems = itemsWithOptions.filter((item): item is MenuItem => item !== null);
      setMenuItems(validItems);

      // Extract unique categories
      const uniqueCategories = [...new Set(validItems.map(item => item.category))];
      setCategories(uniqueCategories);

    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up real-time subscription for menu updates
  useEffect(() => {
    const channel = supabase
      .channel('menu_items')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
        },
        () => {
          // Refetch menu items when there are changes
          fetchMenuItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMenuItems]);

  // Initial fetch
  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  return {
    menuItems,
    categories,
    loading,
    error,
    refetch: fetchMenuItems,
  };
}; 