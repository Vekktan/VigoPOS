'use client';

import { Bell, Clock, User, Phone, Loader2, CheckCircle, XCircle, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { QRISNotification } from '@/app/cashier/page';
import { useEffect, useState } from 'react';

interface NotificationPageProps {
  notifications: QRISNotification[];
  onNotificationAction: (notificationId: string, action: 'accept' | 'reject' | 'send-to-kitchen') => void;
  loading?: boolean;
  error?: string | null;
}

export function NotificationPage({ notifications, onNotificationAction, loading = false, error = null }: NotificationPageProps) {
  const [newNotifications, setNewNotifications] = useState<Set<string>>(new Set());

  // Track new notifications for animation
  useEffect(() => {
    const newIds = notifications
      .filter(n => !newNotifications.has(n.id))
      .map(n => n.id);
    
    if (newIds.length > 0) {
      setNewNotifications(prev => new Set([...prev, ...newIds]));
      
      // Remove animation after 3 seconds
      setTimeout(() => {
        setNewNotifications(prev => {
          const updated = new Set(prev);
          newIds.forEach(id => updated.delete(id));
          return updated;
        });
      }, 3000);
    }
  }, [notifications, newNotifications]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari yang lalu`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Notifikasi</h2>
              <p className="text-gray-600">Kelola notifikasi pesanan QRIS masuk</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <span className="text-gray-600">Memuat notifikasi...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Notifikasi</h2>
              <p className="text-gray-600">Kelola notifikasi pesanan QRIS masuk</p>
            </div>
          </div>
        </div>
        
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <Bell className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-red-600 text-lg mb-2">Terjadi kesalahan</p>
          <p className="text-gray-500">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-orange-600 hover:bg-orange-700"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Notifikasi</h2>
            <p className="text-gray-600">Kelola notifikasi pesanan QRIS masuk</p>
          </div>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Bell className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg">Tidak ada notifikasi</p>
          <p className="text-gray-400">Notifikasi pesanan QRIS akan muncul di sini</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`hover:shadow-lg transition-all duration-500 border-l-4 border-l-orange-500 ${
                newNotifications.has(notification.id) 
                  ? 'animate-pulse bg-orange-50 border-l-green-500 shadow-lg' 
                  : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>Pesanan Baru - Meja {notification.tableNumber}</span>
                      <Badge className="bg-orange-100 text-orange-800">QRIS</Badge>
                      {newNotifications.has(notification.id) && (
                        <Badge className="bg-green-100 text-green-800 animate-pulse">BARU</Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(notification.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{notification.orderType === 'dine-in' ? 'Dine In' : 'Bawa Pulang'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{notification.customerPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Item Pesanan:</h4>
                    <div className="space-y-2">
                      {notification.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex-1">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-600 ml-2">x{item.quantity}</span>
                          </div>
                          <span className="font-medium text-orange-500">Rp {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-lg font-bold text-orange-500">Rp {notification.total.toLocaleString()}</span>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button 
                      onClick={() => onNotificationAction(notification.id, 'reject')} 
                      variant="outline" 
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Tolak
                    </Button>
                    <Button 
                      onClick={() => onNotificationAction(notification.id, 'accept')} 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Terima
                    </Button>
                    <Button 
                      onClick={() => onNotificationAction(notification.id, 'send-to-kitchen')} 
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <ChefHat className="w-4 h-4 mr-2" />
                      Kirim ke Dapur
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
