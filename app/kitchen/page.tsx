'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Settings, Bell, User, Play, Check, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'new' | 'cooking' | 'ready' | 'overdue';
  category: 'minuman' | 'makanan' | 'dessert';
  orderTime: Date;
  estimatedTime: number; // in minutes
  startTime?: Date;
}

const initialOrders: Order[] = [
  {
    id: 'T03-1425-01',
    tableNumber: 3,
    items: [{ name: 'Es Teh Manis', quantity: 2 }],
    status: 'new',
    category: 'minuman', // Fixed: changed from "Minuman" to "minuman"
    orderTime: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    estimatedTime: 5,
  },
  {
    id: 'T12-1430-02',
    tableNumber: 12,
    items: [
      { name: 'Nasi Goreng Spesial', quantity: 1 },
      { name: 'Ayam Bakar', quantity: 1 },
    ],
    status: 'cooking',
    category: 'makanan',
    orderTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    estimatedTime: 25,
    startTime: new Date(Date.now() - 10 * 60 * 1000), // started 10 minutes ago
  },
  {
    id: 'T07-1435-03',
    tableNumber: 7,
    items: [
      { name: 'Es Krim Vanilla', quantity: 2 },
      { name: 'Pudding Coklat', quantity: 1 },
    ],
    status: 'new',
    category: 'dessert',
    orderTime: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
    estimatedTime: 3,
  },
  {
    id: 'T05-1420-04',
    tableNumber: 5,
    items: [{ name: 'Ayam Bakar', quantity: 2 }],
    status: 'overdue',
    category: 'makanan',
    orderTime: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
    estimatedTime: 25,
    startTime: new Date(Date.now() - 30 * 60 * 1000), // started 30 minutes ago
  },
];

const categoryConfig = {
  minuman: {
    label: '🚀 MINUMAN',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    headerColor: 'bg-orange-500',
  },
  makanan: {
    label: '🍽️ MAKANAN',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    headerColor: 'bg-orange-500',
  },
  dessert: {
    label: '🍰 DESSERT',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    headerColor: 'bg-orange-500',
  },
};

const statusConfig = {
  new: { color: 'bg-green-500', label: 'NEW' },
  cooking: { color: 'bg-yellow-500', label: 'COOKING' },
  ready: { color: 'bg-blue-500', label: 'READY' },
  overdue: { color: 'bg-red-500', label: 'OVERDUE' },
};

export default function KitchenDisplay() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Update order statuses based on time
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          const cookingTime = order.startTime ? (now.getTime() - order.startTime.getTime()) / (1000 * 60) : 0;

          if (order.status === 'cooking' && cookingTime > order.estimatedTime + 5) {
            return { ...order, status: 'overdue' as const };
          }

          return order;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Fixed: removed currentTime dependency to prevent infinite re-renders

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              startTime: newStatus === 'cooking' ? new Date() : order.startTime,
            }
          : order
      )
    );
  };

  const getElapsedTime = (order: Order) => {
    const referenceTime = order.startTime || order.orderTime;
    const elapsed = Math.floor((currentTime.getTime() - referenceTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getOrdersByCategory = (category: Order['category']) => {
    return orders.filter((order) => order.category === category);
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const isOverdue = order.status === 'overdue';
    const isPulse = order.status === 'new' || isOverdue;

    return (
      <Card
        className={`
          ${isPulse ? 'animate-pulse' : ''} 
          ${isOverdue ? 'border-red-500 bg-red-50' : 'bg-white'}
          transition-all duration-300 hover:shadow-lg
        `}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className={`${statusConfig[order.status].color} text-white`}>{order.id}</Badge>
              {isOverdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
            </div>
            <div className="flex items-center space-x-1 text-lg font-mono">
              <Clock className="w-4 h-4" />
              <span className={isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}>{getElapsedTime(order)}</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">Table {order.tableNumber}</div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1 mb-4">
            {order.items.map((item, index) => (
              <div key={index} className="text-sm">
                • {item.name} {item.quantity > 1 && `(${item.quantity})`}
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            {order.status === 'new' && (
              <Button size="sm" onClick={() => updateOrderStatus(order.id, 'cooking')} className="flex-1 bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-1" />
                START
              </Button>
            )}

            {(order.status === 'cooking' || order.status === 'overdue') && (
              <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Check className="w-4 h-4 mr-1" />
                DONE
              </Button>
            )}

            {order.status === 'ready' && <Badge className="flex-1 justify-center py-2 bg-gray-500 text-white">READY FOR PICKUP</Badge>}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-orange-500">KITCHEN DISPLAY</span>
            </Link>
            <div className="text-sm text-orange-500">
              {currentTime.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-orange-500">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-orange-500">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-orange-500">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Minuman Column */}
          <div className={`${categoryConfig['minuman'].bgColor} rounded-lg p-4`}>
            <div className={`${categoryConfig['minuman'].headerColor} text-white p-3 rounded-lg mb-4`}>
              <h2 className="text-lg font-bold text-center">{categoryConfig['minuman'].label}</h2>
            </div>
            <div className="space-y-4">
              {getOrdersByCategory('minuman').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {getOrdersByCategory('minuman').length === 0 && <div className="text-center text-gray-500 py-8">No drink orders</div>}
            </div>
          </div>

          {/* Makanan Column */}
          <div className={`${categoryConfig['makanan'].bgColor} rounded-lg p-4`}>
            <div className={`${categoryConfig['makanan'].headerColor} text-white p-3 rounded-lg mb-4`}>
              <h2 className="text-lg font-bold text-center">{categoryConfig['makanan'].label}</h2>
            </div>
            <div className="space-y-4">
              {getOrdersByCategory('makanan').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {getOrdersByCategory('makanan').length === 0 && <div className="text-center text-gray-500 py-8">No food orders</div>}
            </div>
          </div>

          {/* Dessert Column */}
          <div className={`${categoryConfig['dessert'].bgColor} rounded-lg p-4`}>
            <div className={`${categoryConfig['dessert'].headerColor} text-white p-3 rounded-lg mb-4`}>
              <h2 className="text-lg font-bold text-center">{categoryConfig['dessert'].label}</h2>
            </div>
            <div className="space-y-4">
              {getOrdersByCategory('dessert').map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
              {getOrdersByCategory('dessert').length === 0 && <div className="text-center text-gray-500 py-8">No dessert orders</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
