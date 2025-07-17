'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Minus, Trash2, CreditCard, Smartphone, Banknote, X } from 'lucide-react';
import { StatusIndicator } from '@/components/StatusIndicator';
import type { CartItem, Order } from '@/app/cashier/page';

interface CartSidebarProps {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  onOrderComplete: (order: Order) => void;
  onClose: () => void;
}

export function CartSidebar({ cart, setCart, onOrderComplete, onClose }: CartSidebarProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<'qris' | 'debit' | 'cash'>('cash');
  const [globalOrderType, setGlobalOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');

  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [globalNotes, setGlobalNotes] = useState('');

  const updateCartItem = (index: number, updates: Partial<CartItem>) => {
    setCart(cart.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    if (newCart.length === 0) onClose();
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }
    const item = cart[index];
    const pricePerItem = item.totalPrice / item.quantity;
    updateCartItem(index, {
      quantity: newQuantity,
      totalPrice: pricePerItem * newQuantity,
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const validateForm = () => {
    if (!customerName.trim()) {
      setErrorMessage('Nama pelanggan wajib diisi');
      return false;
    }
    if (!customerPhone.trim()) {
      setErrorMessage('Nomor telepon pelanggan wajib diisi');
      return false;
    }
    return true;
  };

  const handleCheckout = () => {
    setErrorMessage('');
    setShowConfirmation(true);
  };

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

  const generateReceipt = () => {
    const receipt = `
🧾 *STRUK PEMBELIAN COFFEEPOS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 ${new Date().toLocaleDateString('id-ID')}
🕐 ${new Date().toLocaleTimeString('id-ID')}
👤 ${customerName}
📱 ${customerPhone}
🏪 ${globalOrderType === 'dine-in' ? 'Dine In' : 'Bawa Pulang'}
📝 Catatan: ${globalNotes || '-'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 *DETAIL PESANAN:*

${cart
  .map((item) => {
    let itemText = `${item.quantity}x ${item.name}`;
    if (item.selectedOptions) {
      Object.entries(item.selectedOptions).forEach(([key, values]) => {
        if (values.length > 0) {
          itemText += `\n   ${key}: ${values.join(', ')}`;
        }
      });
    }
    itemText += `\n   💰 Rp ${item.totalPrice.toLocaleString('id-ID')}`;
    return itemText;
  })
  .join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💵 Subtotal: Rp ${subtotal.toLocaleString('id-ID')}
🏷️ Pajak (10%): Rp ${tax.toLocaleString('id-ID')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💳 *TOTAL: Rp ${total.toLocaleString('id-ID')}*
💰 Pembayaran: ${selectedPayment.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${getMotivationalQuote(customerPhone)}

🏪 CoffeePOS - Jl. Kopi No. 123, Jakarta
📞 +62 21 1234 5678
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();
    return receipt;
  };

  const handleConfirmOrder = async () => {
    if (!validateForm()) {
      setStatus('error');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const order: Order = {
        id: `ORD-${Date.now()}`,
        items: cart.map((item) => ({ ...item, orderType: globalOrderType })),
        customerName,
        customerPhone,
        orderType: globalOrderType,

        paymentMethod: selectedPayment,
        total,
        status: 'accepted',
        timestamp: new Date(),
        source: 'cashier',
        notes: globalNotes, // ✅ Tambahkan catatan umum ke Order
      };

      setStatus('success');

      const receipt = generateReceipt();
      const phoneNumber = customerPhone.replace(/[^0-9]/g, '');
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(receipt)}`;
      window.open(whatsappUrl, '_blank');

      setTimeout(() => {
        onOrderComplete(order);
        setShowConfirmation(false);
        setCustomerName('');
        setCustomerPhone('');

        setGlobalNotes('');
        onClose();
      }, 1500);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Pembayaran gagal. Silakan coba lagi.');
    }
  };

  return (
    <>
      <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-xl flex flex-col z-20">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-orange-500 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Pesanan Saat Ini</h2>
            <div className="flex items-center space-x-2">
              <Badge className="bg-white/20 text-white text-xs">{cart.reduce((sum, item) => sum + item.quantity, 0)} item</Badge>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 h-6 w-6 p-0">
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Global Order Type */}
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <label className="block text-xs font-medium text-gray-700 mb-1">Tipe Pesanan</label>
          <Select value={globalOrderType} onValueChange={(value: 'dine-in' | 'takeaway') => setGlobalOrderType(value)}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dine-in">Dine In</SelectItem>
              <SelectItem value="takeaway">Bawa Pulang</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Catatan Umum</label>
            <Textarea placeholder="Permintaan khusus (opsional)" value={globalNotes} onChange={(e) => setGlobalNotes(e.target.value)} maxLength={30} rows={1} className="h-[28px] resize-none text-xs px-2 py-0.5 leading-none min-h-0" />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            {cart.map((item, index) => (
              <Card key={`${item.id}-${index}`} className="border border-gray-100 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-start space-x-2">
                    <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-800 truncate">{item.name}</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>Dasar: Rp {item.price.toLocaleString()}</p>

                        {/* Show selected options */}
                        {item.selectedOptions &&
                          Object.entries(item.selectedOptions).map(
                            ([key, values]) =>
                              values.length > 0 && (
                                <p key={key} className="text-xs">
                                  {key}: {values.join(', ')}
                                </p>
                              )
                          )}
                      </div>
                      <p className="text-sm font-bold text-orange-500">Rp {(item.totalPrice / item.quantity).toLocaleString()} /pcs</p>
                    </div>
                    <button onClick={() => removeFromCart(index)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => updateQuantity(index, item.quantity - 1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(index, item.quantity + 1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-orange-500">Rp {item.totalPrice.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Section */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-sm text-gray-800 mb-2">Metode Pembayaran</h3>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setSelectedPayment('cash')}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all text-xs ${selectedPayment === 'cash' ? 'bg-orange-500 text-white shadow-lg' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
                >
                  <Banknote className="w-4 h-4 mb-1" />
                  <span className="font-medium">Tunai</span>
                </button>
                <button
                  onClick={() => setSelectedPayment('qris')}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all text-xs ${selectedPayment === 'qris' ? 'bg-orange-500 text-white shadow-lg' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
                >
                  <Smartphone className="w-4 h-4 mb-1" />
                  <span className="font-medium">QRIS</span>
                </button>
                <button
                  onClick={() => setSelectedPayment('debit')}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all text-xs ${selectedPayment === 'debit' ? 'bg-orange-500 text-white shadow-lg' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
                >
                  <CreditCard className="w-4 h-4 mb-1" />
                  <span className="font-medium">Debit</span>
                </button>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Pajak (10%)</span>
                <span>Rp {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm border-t border-gray-200 pt-1">
                <span>Total</span>
                <span className="text-orange-500">Rp {total.toLocaleString()}</span>
              </div>
            </div>

            <StatusIndicator status={status} message={errorMessage} />

            <Button onClick={handleCheckout} className="w-full bg-orange-500 hover:from-orange-500 hover:to-orange-500 text-white py-2 text-sm font-semibold shadow-lg" disabled={status === 'processing'}>
              {status === 'processing' ? 'Memproses...' : 'Lanjut ke Pembayaran'}
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800">Konfirmasi Pesanan</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nama Pelanggan</label>
              <Input placeholder="Masukkan nama pelanggan" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="h-8 text-sm" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nomor WhatsApp</label>
              <Input placeholder="+62 xxx-xxxx-xxxx" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="h-8 text-sm" />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
              <h4 className="font-medium text-gray-800 mb-2 text-sm">Ringkasan Pesanan:</h4>
              <div className="space-y-1 text-xs">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>Rp {item.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-1 mt-2 font-bold flex justify-between">
                  <span>Total:</span>
                  <span>Rp {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-xs text-orange-500 italic text-center">{customerPhone ? getMotivationalQuote(customerPhone) : 'Terima kasih telah memilih CoffeePOS!'}</p>
            </div>

            <StatusIndicator status={status} message={errorMessage} />

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowConfirmation(false)} className="flex-1 text-sm" disabled={status === 'processing'}>
                Batal
              </Button>
              <Button onClick={handleConfirmOrder} disabled={!customerName || !customerPhone || status === 'processing'} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-sm">
                {status === 'processing' ? 'Memproses...' : status === 'success' ? 'Berhasil!' : 'Selesaikan Pembayaran'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
