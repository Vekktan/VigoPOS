'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { QRISNotification } from '@/app/cashier/page';

export const useQRISNotifications = () => {
  const [notifications, setNotifications] = useState<QRISNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('qris_notifications')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Transform data to match QRISNotification interface
      const transformedNotifications: QRISNotification[] = (data || []).map((notification) => ({
        id: notification.id,
        tableNumber: notification.table_number,
        items: notification.items.map((item: any) => ({
          id: item.id || Math.random().toString(),
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: item.category || 'coffee',
          image: item.image || '/placeholder.svg?height=200&width=200',
          isPromo: item.isPromo || false,
          quantity: item.quantity,
          orderType: notification.order_type,
          totalPrice: item.price * item.quantity,
        })),
        orderType: notification.order_type,
        customerPhone: notification.customer_phone,
        total: notification.total_amount,
        timestamp: new Date(notification.created_at),
      }));

      setNotifications(transformedNotifications);
    } catch (err) {
      console.error('Error fetching QRIS notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNotificationStatus = useCallback(async (
    notificationId: string, 
    action: 'accept' | 'reject' | 'send-to-kitchen'
  ) => {
    try {
      const newStatus = action === 'accept' ? 'accepted' : 
                       action === 'reject' ? 'rejected' : 'sent-to-kitchen';

      const { error: updateError } = await supabase
        .from('qris_notifications')
        .update({ status: newStatus })
        .eq('id', notificationId);

      if (updateError) {
        throw updateError;
      }

      // Remove notification from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));

      // If accepted or sent to kitchen, create order
      if (action === 'accept' || action === 'send-to-kitchen') {
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
          const orderStatus = action === 'accept' ? 'accepted' : 'sent-to-kitchen';
          
          const { error: orderError } = await supabase
            .from('orders')
            .insert([{
              table_number: notification.tableNumber,
              customer_name: `Table ${notification.tableNumber}`,
              customer_phone: notification.customerPhone,
              order_type: notification.orderType,
              payment_method: 'qris',
              total_amount: notification.total,
              status: orderStatus,
              source: 'qris',
              items: notification.items,
              created_at: new Date().toISOString()
            }]);

          if (orderError) {
            console.error('Error creating order:', orderError);
          }
        }
      }

      return true;
    } catch (err) {
      console.error('Error updating notification status:', err);
      return false;
    }
  }, [notifications]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('qris_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'qris_notifications',
          filter: 'status=eq.pending'
        },
        (payload) => {
          console.log('QRIS notification change:', payload);
          
          if (payload.eventType === 'INSERT') {
            // New notification received
            const newNotification = payload.new as any;
            const transformedNotification: QRISNotification = {
              id: newNotification.id,
              tableNumber: newNotification.table_number,
              items: newNotification.items.map((item: any) => ({
                id: item.id || Math.random().toString(),
                name: item.name,
                description: item.description || '',
                price: item.price,
                category: item.category || 'coffee',
                image: item.image || '/placeholder.svg?height=200&width=200',
                isPromo: item.isPromo || false,
                quantity: item.quantity,
                orderType: newNotification.order_type,
                totalPrice: item.price * item.quantity,
              })),
              orderType: newNotification.order_type,
              customerPhone: newNotification.customer_phone,
              total: newNotification.total_amount,
              timestamp: new Date(newNotification.created_at),
            };
            
            console.log('Adding new notification:', transformedNotification);
            setNotifications(prev => [transformedNotification, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            // Notification status updated
            const updatedNotification = payload.new as any;
            if (updatedNotification.status !== 'pending') {
              console.log('Removing notification:', updatedNotification.id);
              setNotifications(prev => prev.filter(n => n.id !== updatedNotification.id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    updateNotificationStatus,
    refetch: fetchNotifications,
  };
}; 