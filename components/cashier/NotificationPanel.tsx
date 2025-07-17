'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bell, Clock, MapPin, Phone } from 'lucide-react';
import type { QRISNotification } from '@/app/cashier/page';

interface NotificationPanelProps {
  notifications: QRISNotification[];
  onAction: (notificationId: string, action: 'accept' | 'reject' | 'send-to-kitchen') => void;
}

export function NotificationPanel({ notifications, onAction }: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getMotivationalQuote = (phone: string) => {
    const lastDigit = Number.parseInt(phone.slice(-1));
    const quotes = [
      'Terima kasih telah memilih CoffeePOS. Nikmati kopi terbaik kami! ☕',
      'Selamat menikmati! Semoga hari Anda semakin bersemangat! 🌟',
      'Kopi yang sempurna untuk orang yang sempurna seperti Anda! ❤️',
      'Terima kasih atas kepercayaan Anda. Selamat menikmati! 🙏',
      'Semoga kopi kami membawa kebahagiaan di hari Anda! 😊',
      'Nikmati setiap tegukan kopi spesial kami! ✨',
      'Terima kasih sudah menjadi bagian keluarga CoffeePOS! 🏠',
      'Kopi terbaik untuk pelanggan terbaik! 🏆',
      'Semoga kopi kami memberikan energi positif untuk Anda! ⚡',
      'Terima kasih! Sampai jumpa di kunjungan berikutnya! 👋',
    ];
    return quotes[lastDigit] || quotes[0];
  };

  const generateAcceptanceReceipt = (notification: QRISNotification) => {
    const subtotal = notification.total / 1.1; // Assuming 10% tax
    const tax = notification.total - subtotal;

    return `
🧾 *PESANAN DITERIMA - COFFEEPOS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 ${new Date().toLocaleDateString('id-ID')}
🕐 ${new Date().toLocaleTimeString('id-ID')}
🏪 Table ${notification.tableNumber}
📱 ${notification.customerPhone}
🍽️ ${notification.orderType === 'dine-in' ? 'Dine In' : 'Take Away'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *DETAIL PESANAN:*

${notification.items
  .map((item) => {
    let itemText = `${item.quantity}x ${item.name}`;
    if (item.selectedSize) itemText += ` (${item.selectedSize})`;
    itemText += `\n   💰 Rp ${(item.price * item.quantity).toLocaleString('id-ID')}`;
    return itemText;
  })
  .join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💵 Subtotal: Rp ${Math.round(subtotal).toLocaleString('id-ID')}
🏷️ Pajak (10%): Rp ${Math.round(tax).toLocaleString('id-ID')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 *TOTAL: Rp ${notification.total.toLocaleString('id-ID')}*
💰 Pembayaran: QRIS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ *PESANAN ANDA TELAH DITERIMA*
⏰ Estimasi waktu: 15-20 menit
🔔 Kami akan memberitahu saat pesanan siap

${getMotivationalQuote(notification.customerPhone)}

🏪 CoffeePOS - Jl. Kopi No. 123, Jakarta
📞 +62 21 1234 5678
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();
  };

  const generateRejectionMessage = (notification: QRISNotification) => {
    return `
❌ *PESANAN DITOLAK - COFFEEPOS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mohon maaf, pesanan Anda untuk Table ${notification.tableNumber} tidak dapat kami proses saat ini.

🔄 *ALASAN PENOLAKAN:*
• Beberapa item sedang tidak tersedia
• Kitchen sedang overload
• Atau kendala teknis lainnya

💡 *SOLUSI:*
• Silakan pesan kembali dalam 15-30 menit
• Atau hubungi langsung ke kasir
• Pilih item alternatif yang tersedia

💰 *REFUND:*
Pembayaran Anda akan dikembalikan dalam 1-3 hari kerja ke rekening yang sama.

🙏 Mohon maaf atas ketidaknyamanan ini.
Terima kasih atas pengertian Anda.

🏪 CoffeePOS - Jl. Kopi No. 123, Jakarta
📞 +62 21 1234 5678
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();
  };

  const handleAction = (notificationId: string, action: 'accept' | 'reject' | 'send-to-kitchen') => {
    const notification = notifications.find((n) => n.id === notificationId);
    if (!notification) return;

    let message = '';
    if (action === 'accept') {
      message = generateAcceptanceReceipt(notification);
    } else if (action === 'reject') {
      message = generateRejectionMessage(notification);
    } else {
      message = `Pesanan Table ${notification.tableNumber} telah diteruskan ke kitchen. Estimasi waktu: 15-20 menit.`;
    }

    // Send WhatsApp message
    const whatsappUrl = `https://wa.me/${notification.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Call the parent action handler
    onAction(notificationId, action);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} className="relative bg-orange-500 hover:bg-orange-600 text-white border-orange-500 shadow-lg">
        <Bell className="w-4 h-4 mr-2" />
        Notifikasi
        {notifications.length > 0 && <Badge className="absolute -top-2 -right-2 min-w-[1.5rem] h-6 p-0 text-xs bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-white">{notifications.length}</Badge>}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>QRIS Table Orders</span>
              <Badge variant="secondary">{notifications.length} pending</Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No pending notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>Table {notification.tableNumber}</span>
                        <Badge variant={notification.orderType === 'dine-in' ? 'default' : 'secondary'}>{notification.orderType}</Badge>
                      </CardTitle>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{notification.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{notification.customerPhone}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800">Order Items:</h4>
                      {notification.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>
                            {item.quantity}x {item.name}
                            {item.selectedSize && ` (${item.selectedSize})`}
                          </span>
                          <span className="font-medium text-orange-500">Rp {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Total:</span>
                        <span className="text-orange-500">Rp {notification.total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleAction(notification.id, 'accept')} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                        Terima Pesanan
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleAction(notification.id, 'reject')} className="flex-1">
                        Tolak Pesanan
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleAction(notification.id, 'send-to-kitchen')} className="flex-1">
                        Teruskan ke Kitchen
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
