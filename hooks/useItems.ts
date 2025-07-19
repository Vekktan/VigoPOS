import { useState, useEffect, useCallback } from 'react';
import { itemApi } from '@/services/api';
import type { MenuItem } from '@/app/cashier/page';

export function useItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all items
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemApi.getAll();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new item
  const createItem = useCallback(async (item: Omit<MenuItem, 'id'>, options?: MenuItem['options']) => {
    try {
      setError(null);
      const newItem = await itemApi.create(item, options);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item');
      console.error('Error creating item:', err);
      throw err;
    }
  }, []);

  // Update item
  const updateItem = useCallback(async (id: string, updates: Partial<Omit<MenuItem, 'id'>>, options?: MenuItem['options']) => {
    try {
      setError(null);
      const updatedItem = await itemApi.update(id, updates, options);
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      console.error('Error updating item:', err);
      throw err;
    }
  }, []);

  // Delete item
  const deleteItem = useCallback(async (id: string) => {
    try {
      setError(null);
      await itemApi.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      console.error('Error deleting item:', err);
      throw err;
    }
  }, []);

  // Get item by ID
  const getItemById = useCallback(async (id: string) => {
    try {
      setError(null);
      return await itemApi.getById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch item');
      console.error('Error fetching item:', err);
      return null;
    }
  }, []);

  // Load items on mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    getItemById,
  };
} 