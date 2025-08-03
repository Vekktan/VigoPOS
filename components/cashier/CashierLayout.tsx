'use client';

import type { ReactNode } from 'react';
import { Coffee, Tag, History, Package, Settings, Bell, BarChart3 } from 'lucide-react';
import type { NavigationPage, QRISNotification } from '@/app/cashier/page';
import { UserInfo } from '@/components/auth/UserInfo';

interface CashierLayoutProps {
  children: ReactNode;
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  notifications: QRISNotification[];
  onNotificationAction: (notificationId: string, action: 'accept' | 'reject' | 'send-to-kitchen') => void;
}

export function CashierLayout({ children, currentPage, onNavigate, notifications, onNotificationAction }: CashierLayoutProps) {
  const navigationItems = [
    { id: 'menu' as const, label: 'Menu', icon: Coffee },
    { id: 'promo' as const, label: 'Promo', icon: Tag },
    { id: 'notification' as const, label: 'Notification', icon: Bell },
    { id: 'history' as const, label: 'History', icon: History },
    { id: 'items' as const, label: 'Items', icon: Package },
    { id: 'sales-report' as const, label: 'Sales Report', icon: BarChart3 },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white flex flex-col shadow-lg fixed left-0 top-0 h-full z-10">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">CoffeePOS</span>
          </div>
        </div>

        {/* Navigation & User Info */}
        <div className="flex-1 flex flex-col justify-between p-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-all duration-200 font-medium relative
                    ${isActive ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' : 'text-zinc-600 hover:bg-gray-50 hover:text-gray-800'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-orange-600' : 'text-zinc-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Info Pindah ke sini */}
          <div className="pt-6 border-t border-gray-100">
            <UserInfo />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header tidak digunakan */}

        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
