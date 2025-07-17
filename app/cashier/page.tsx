'use client';

import { useState } from 'react';
import { CashierLayout } from '@/components/cashier/CashierLayout';
import { MenuPage } from '@/components/cashier/MenuPage';
import { PromoPage } from '@/components/cashier/PromoPage';
import { HistoryPage } from '@/components/cashier/HistoryPage';
import { ItemsPage } from '@/components/cashier/ItemsPage';
import { SettingsPage } from '@/components/cashier/SettingsPage';
import { NotificationPage } from '@/components/cashier/NotificationPage';
import { SalesReportPage } from '@/components/cashier/SalesReportPage';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export type NavigationPage = 'menu' | 'promo' | 'notification' | 'history' | 'items' | 'sales-report' | 'settings';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  isPromo: boolean;
  options?: {
    [key: string]: {
      type: 'single' | 'multiple';
      required: boolean;
      values: Array<{
        name: string;
        price: number;
      }>;
    };
  };
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedOptions?: { [key: string]: string[] };
  orderType: 'dine-in' | 'takeaway';
  notes?: string;
  totalPrice: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  icon: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  orderType: 'dine-in' | 'takeaway';
  tableNumber?: string;
  paymentMethod: 'qris' | 'debit' | 'cash';
  total: number;
  status: 'accepted' | 'rejected' | 'sent-to-kitchen';
  timestamp: Date;
  source: 'cashier' | 'qris';
  notes?: string;
}

export interface QRISNotification {
  id: string;
  tableNumber: string;
  items: CartItem[];
  orderType: 'dine-in' | 'takeaway';
  customerPhone: string;
  total: number;
  timestamp: Date;
}

// Generate more dummy data
const generateDummyOrders = (): Order[] => {
  const orders: Order[] = [];
  const now = new Date();

  // Generate orders for the last 3 months
  for (let i = 0; i < 150; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);

    const orderDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000 - minutesAgo * 60 * 1000);

    const items = [
      { id: '1', name: 'Cappuccino', price: 35000, quantity: Math.floor(Math.random() * 3) + 1 },
      { id: '2', name: 'Latte', price: 38000, quantity: Math.floor(Math.random() * 2) + 1 },
      { id: '3', name: 'Espresso', price: 17500, quantity: Math.floor(Math.random() * 2) + 1 },
      { id: '4', name: 'Croissant', price: 22000, quantity: Math.floor(Math.random() * 2) + 1 },
      { id: '5', name: 'Americano', price: 32000, quantity: Math.floor(Math.random() * 2) + 1 },
      { id: '6', name: 'Mocha', price: 42000, quantity: Math.floor(Math.random() * 2) + 1 },
      { id: '7', name: 'Sandwich', price: 45000, quantity: Math.floor(Math.random() * 2) + 1 },
      { id: '8', name: 'Cake', price: 35000, quantity: Math.floor(Math.random() * 2) + 1 },
    ];

    const randomItems = items.slice(0, Math.floor(Math.random() * 4) + 1);
    const total = randomItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    orders.push({
      id: `ORD-${String(i + 1).padStart(3, '0')}`,
      items: randomItems.map((item) => ({
        ...item,
        description: 'Sample item',
        category:
          item.name.includes('Coffee') || item.name.includes('Latte') || item.name.includes('Cappuccino') || item.name.includes('Espresso') || item.name.includes('Americano') || item.name.includes('Mocha')
            ? 'coffee'
            : item.name.includes('Sandwich') || item.name.includes('Burger')
            ? 'food'
            : 'snacks',
        image: '/placeholder.svg?height=200&width=200',
        isPromo: Math.random() > 0.8,
        orderType: 'dine-in' as const,
        totalPrice: item.price * item.quantity,
      })),
      customerName: `Customer ${i + 1}`,
      customerPhone: `+62 81${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000)
        .toString()
        .padStart(7, '0')}`,
      orderType: Math.random() > 0.5 ? 'dine-in' : 'takeaway',
      tableNumber: Math.random() > 0.5 ? String(Math.floor(Math.random() * 20) + 1) : undefined,
      paymentMethod: ['qris', 'debit', 'cash'][Math.floor(Math.random() * 3)] as any,
      total,
      status: 'accepted',
      timestamp: orderDate,
      source: Math.random() > 0.5 ? 'cashier' : 'qris',
    });
  }

  return orders.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export default function CashierPage() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('menu');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notifications, setNotifications] = useState<QRISNotification[]>([
    {
      id: 'qris-001',
      tableNumber: '5',
      items: [
        {
          id: '1',
          name: 'Cappuccino',
          description: 'Espresso with steamed milk foam',
          price: 35000,
          category: 'coffee',
          image: '/placeholder.svg?height=200&width=200',
          isPromo: false,
          quantity: 2,
          orderType: 'dine-in',
          totalPrice: 70000,
        },
      ],
      orderType: 'dine-in',
      customerPhone: '+62 817-449-496',
      total: 70000,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: 'qris-002',
      tableNumber: '12',
      items: [
        {
          id: '2',
          name: 'Latte',
          description: 'Smooth espresso with steamed milk',
          price: 38000,
          category: 'coffee',
          image: '/placeholder.svg?height=200&width=200',
          isPromo: false,
          quantity: 1,
          orderType: 'takeaway',
          totalPrice: 38000,
        },
      ],
      orderType: 'takeaway',
      customerPhone: '+62 877-8277-0107',
      total: 38000,
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
    },
  ]);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Cappuccino',
      description: 'Rich espresso topped with steamed milk foam and a sprinkle of cocoa powder. Our signature cappuccino is made with premium arabica beans and perfectly frothed milk for a creamy, indulgent experience.',
      price: 35000,
      category: 'coffee',
      image: '/placeholder.svg?height=200&width=200',
      isPromo: false,
      options: {
        size: {
          type: 'single',
          required: true,
          values: [
            { name: 'Small', price: 0 },
            { name: 'Regular', price: 0 },
            { name: 'Large', price: 5000 },
          ],
        },
        sugar: {
          type: 'single',
          required: true,
          values: [
            { name: 'No Sugar', price: 0 },
            { name: 'Less Sugar', price: 0 },
            { name: 'Normal Sugar', price: 0 },
            { name: 'Extra Sugar', price: 0 },
          ],
        },
        extras: {
          type: 'multiple',
          required: false,
          values: [
            { name: 'Extra Shot', price: 8000 },
            { name: 'Decaf', price: 0 },
            { name: 'Oat Milk', price: 5000 },
            { name: 'Almond Milk', price: 5000 },
          ],
        },
      },
    },
    {
      id: '2',
      name: 'Latte',
      description: 'Smooth and creamy latte made with espresso and steamed milk, topped with beautiful latte art. Perfect balance of coffee and milk for a comforting drink.',
      price: 38000,
      category: 'coffee',
      image: '/placeholder.svg?height=200&width=200',
      isPromo: false,
      options: {
        size: {
          type: 'single',
          required: true,
          values: [
            { name: 'Small', price: 0 },
            { name: 'Regular', price: 0 },
            { name: 'Large', price: 5000 },
          ],
        },
        flavor: {
          type: 'single',
          required: false,
          values: [
            { name: 'Original', price: 0 },
            { name: 'Vanilla', price: 3000 },
            { name: 'Caramel', price: 3000 },
            { name: 'Hazelnut', price: 3000 },
          ],
        },
      },
    },
    {
      id: '3',
      name: 'Espresso',
      description: "Pure, intense espresso shot made from premium arabica beans. Bold and rich flavor that's perfect for coffee purists.",
      price: 17500,
      originalPrice: 25000,
      category: 'coffee',
      image: '/placeholder.svg?height=200&width=200',
      isPromo: true,
    },
    {
      id: '4',
      name: 'Croissant',
      description: 'Buttery, flaky French pastry baked fresh daily. Light, airy texture with golden crispy exterior. Perfect with your morning coffee.',
      price: 22000,
      category: 'snacks',
      image: '/placeholder.svg?height=200&width=200',
      isPromo: false,
      options: {
        filling: {
          type: 'single',
          required: false,
          values: [
            { name: 'Plain', price: 0 },
            { name: 'Chocolate', price: 5000 },
            { name: 'Almond', price: 5000 },
            { name: 'Ham & Cheese', price: 8000 },
          ],
        },
      },
    },
    {
      id: '5',
      name: 'Americano',
      description: "Classic black coffee made with espresso and hot water. Clean, bold flavor that highlights the coffee's natural characteristics.",
      price: 32000,
      category: 'coffee',
      image: '/placeholder.svg?height=200&width=200',
      isPromo: false,
    },
    {
      id: '6',
      name: 'Mocha',
      description: 'Decadent blend of espresso, steamed milk, and rich chocolate syrup, topped with whipped cream. The perfect treat for chocolate lovers.',
      price: 42000,
      category: 'coffee',
      image: '/placeholder.svg?height=200&width=200',
      isPromo: false,
      options: {
        chocolate: {
          type: 'single',
          required: false,
          values: [
            { name: 'Milk Chocolate', price: 0 },
            { name: 'Dark Chocolate', price: 2000 },
            { name: 'White Chocolate', price: 2000 },
          ],
        },
        toppings: {
          type: 'multiple',
          required: false,
          values: [
            { name: 'Whipped Cream', price: 3000 },
            { name: 'Marshmallow', price: 2000 },
            { name: 'Chocolate Chips', price: 3000 },
          ],
        },
      },
    },
    {
      id: '7',
      name: 'Club Sandwich',
      description: 'Triple-layered sandwich with grilled chicken, bacon, lettuce, tomato, and mayo on toasted bread. Served with crispy fries.',
      price: 45000,
      category: 'food',
      image: '/placeholder.svg?height=200&width=200',
      isPromo: false,
    },
    {
      id: '8',
      name: 'Chocolate Cake',
      description: 'Rich, moist chocolate cake with layers of chocolate ganache. Topped with chocolate shavings and served with vanilla ice cream.',
      price: 35000,
      category: 'dessert',
      image: '/placeholder.svg?height=200&width=200',
      isPromo: false,
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: 'coffee', name: 'Coffee', description: 'Hot and cold coffee beverages', itemCount: 5, icon: '☕' },
    { id: 'food', name: 'Food', description: 'Main dishes and meals', itemCount: 1, icon: '🍽️' },
    { id: 'snacks', name: 'Snacks', description: 'Light bites and pastries', itemCount: 1, icon: '🍪' },
    { id: 'dessert', name: 'Dessert', description: 'Sweet treats and desserts', itemCount: 1, icon: '🍰' },
  ]);

  const [orders, setOrders] = useState<Order[]>(generateDummyOrders());

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'menu':
        return (
          <MenuPage
            menuItems={menuItems}
            categories={categories}
            cart={cart}
            setCart={setCart}
            onOrderComplete={(order) => {
              setOrders((prev) => [order, ...prev]);
              setCart([]);
            }}
          />
        );
      case 'promo':
        return <PromoPage menuItems={menuItems.filter((item) => item.isPromo)} cart={cart} setCart={setCart} />;
      case 'notification':
        return <NotificationPage notifications={notifications} onNotificationAction={() => {}} />;
      case 'history':
        return <HistoryPage orders={orders} />;
      case 'items':
        return <ItemsPage menuItems={menuItems} setMenuItems={setMenuItems} categories={categories} setCategories={setCategories} />;
      case 'sales-report':
        return <SalesReportPage orders={orders} />;
      case 'settings':
        return <SettingsPage orders={orders} />;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <CashierLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        notifications={currentPage === 'menu' ? notifications : []}
        onNotificationAction={(notificationId, action) => {
          const notification = notifications.find((n) => n.id === notificationId);
          if (!notification) return;

          if (action === 'accept' || action === 'reject' || action === 'send-to-kitchen') {
            // Create order from notification
            const order: Order = {
              id: `ORD-${Date.now()}`,
              items: notification.items,
              customerName: `Table ${notification.tableNumber}`,
              customerPhone: notification.customerPhone,
              orderType: notification.orderType,
              tableNumber: notification.tableNumber,
              paymentMethod: 'qris',
              total: notification.total,
              status: action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'sent-to-kitchen',
              timestamp: new Date(),
              source: 'qris',
            };

            setOrders((prev) => [order, ...prev]);
            setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

            // WhatsApp Integration
            const phoneNumber = notification.customerPhone.replace(/[^0-9]/g, '');
            const lastDigit = Number.parseInt(phoneNumber.slice(-1));

            const motivationalQuotes = [
              'Hidup ini seperti kopi, pahit di awal tapi nikmat di akhir! ☕',
              'Semangat seperti espresso, kecil tapi bertenaga! 💪',
              'Hari yang indah dimulai dengan kopi yang sempurna! 🌅',
              'Kopi terbaik adalah yang dinikmati bersama orang terkasih! ❤️',
              'Setiap tegukan kopi adalah momen kebahagiaan kecil! 😊',
              'Kopi mengajarkan kita untuk menikmati proses, bukan hanya hasil! 🎯',
              'Seperti kopi yang diseduh dengan sabar, kesuksesan butuh waktu! ⏰',
              'Kopi hangat, hati tenang, pikiran jernih! 🧘',
              'Dalam secangkir kopi, ada cerita dan kenangan indah! 📖',
              'Kopi adalah pelukan hangat dalam bentuk minuman! 🤗',
            ];

            const quote = motivationalQuotes[lastDigit];

            if (action === 'accept') {
              const receiptText = `
🎉 *PESANAN DITERIMA* 🎉

📋 *Detail Pesanan:*
ID: ${order.id}
Meja: ${notification.tableNumber}
Tipe: ${notification.orderType === 'dine-in' ? 'Dine In' : 'Takeaway'}

📝 *Item Pesanan:*
${notification.items.map((item) => `• ${item.name} x${item.quantity} - Rp ${(item.price * item.quantity).toLocaleString()}`).join('\n')}

💰 *Total: Rp ${notification.total.toLocaleString()}*

⏰ *Estimasi: 15-20 menit*
📍 *Status: Sedang diproses*

${quote}

Terima kasih telah mempercayai CoffeePOS! 🙏
              `.trim();

              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(receiptText)}`;
              window.open(whatsappUrl, '_blank');
            } else if (action === 'reject') {
              const rejectionText = `
😔 *PESANAN DITOLAK*

📋 *Detail Pesanan:*
ID: ${order.id}
Meja: ${notification.tableNumber}

❌ *Alasan:* Mohon maaf, beberapa item tidak tersedia saat ini

💡 *Solusi:*
• Silakan pesan ulang dengan menu yang tersedia
• Hubungi kasir untuk rekomendasi menu serupa
• Cek menu promo hari ini

${quote}

Mohon maaf atas ketidaknyamanannya 🙏
              `.trim();

              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(rejectionText)}`;
              window.open(whatsappUrl, '_blank');
            }
          }
        }}
      >
        {renderCurrentPage()}
      </CashierLayout>
    </ErrorBoundary>
  );
}
