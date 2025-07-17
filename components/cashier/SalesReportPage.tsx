'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Calendar, Download, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/app/cashier/page';

interface SalesReportPageProps {
  orders: Order[];
}

export function SalesReportPage({ orders }: SalesReportPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [hourlyChartDate, setHourlyChartDate] = useState('today');

  const filterOrdersByPeriod = (period: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (period) {
      case 'today':
        return orders.filter((order) => order.timestamp >= today);
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orders.filter((order) => order.timestamp >= weekAgo);
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orders.filter((order) => order.timestamp >= monthAgo);
      case 'year':
        const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
        return orders.filter((order) => order.timestamp >= yearAgo);
      default:
        return orders;
    }
  };

  const filteredOrders = filterOrdersByPeriod(selectedPeriod);
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;

  // Monthly comparison data
  const getMonthlyComparison = () => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    const thisMonthOrders = orders.filter((order) => order.timestamp >= thisMonth);
    const lastMonthOrders = orders.filter((order) => order.timestamp >= lastMonth && order.timestamp < thisMonth);
    const twoMonthsAgoOrders = orders.filter((order) => order.timestamp >= twoMonthsAgo && order.timestamp < lastMonth);

    const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const twoMonthsAgoRevenue = twoMonthsAgoOrders.reduce((sum, order) => sum + order.total, 0);

    const percentageChange = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    return {
      thisMonth: { revenue: thisMonthRevenue, orders: thisMonthOrders.length },
      lastMonth: { revenue: lastMonthRevenue, orders: lastMonthOrders.length },
      twoMonthsAgo: { revenue: twoMonthsAgoRevenue, orders: twoMonthsAgoOrders.length },
      percentageChange,
      isGrowth: thisMonthRevenue > lastMonthRevenue,
    };
  };

  // Hourly transactions data
  const getHourlyTransactions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    let targetDate = today;
    if (hourlyChartDate === 'yesterday') {
      targetDate = yesterday;
    }

    const targetOrders = orders.filter((order) => {
      const orderDate = new Date(order.timestamp.getFullYear(), order.timestamp.getMonth(), order.timestamp.getDate());
      return orderDate.getTime() === targetDate.getTime();
    });

    const hourlyData: { [hour: number]: number } = {};

    // Initialize all hours with 0
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = 0;
    }

    targetOrders.forEach((order) => {
      const hour = order.timestamp.getHours();
      hourlyData[hour]++;
    });

    return Object.entries(hourlyData).map(([hour, count]) => ({
      hour: `${hour.padStart(2, '0')}:00`,
      count: count,
    }));
  };

  const monthlyComparison = getMonthlyComparison();
  const hourlyTransactions = getHourlyTransactions();
  const maxHourlyCount = Math.max(...hourlyTransactions.map((h) => h.count), 1);

  // Get top selling items
  const itemSales = new Map<string, { name: string; quantity: number; revenue: number }>();
  filteredOrders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = itemSales.get(item.id) || { name: item.name, quantity: 0, revenue: 0 };
      existing.quantity += item.quantity;
      existing.revenue += item.totalPrice;
      itemSales.set(item.id, existing);
    });
  });

  const topItems = Array.from(itemSales.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Payment method breakdown
  const paymentMethods = filteredOrders.reduce((acc, order) => {
    acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'today':
        return 'Hari Ini';
      case 'week':
        return '7 Hari Terakhir';
      case 'month':
        return '30 Hari Terakhir';
      case 'year':
        return '1 Tahun Terakhir';
      default:
        return 'Semua Waktu';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Laporan Penjualan</h2>
              <p className="text-gray-600">Analisis performa penjualan dan statistik</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="week">7 Hari Terakhir</SelectItem>
                <SelectItem value="month">30 Hari Terakhir</SelectItem>
                <SelectItem value="year">1 Tahun Terakhir</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards - Removed Average Order Value */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel(selectedPeriod)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">{getPeriodLabel(selectedPeriod)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Periode</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPeriodLabel(selectedPeriod)}</div>
            <p className="text-xs text-muted-foreground">Filter aktif</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Comparison Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Perbandingan Penjualan Bulanan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">2 Bulan Lalu</p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-xl font-bold text-gray-600">Rp {monthlyComparison.twoMonthsAgo.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{monthlyComparison.twoMonthsAgo.orders} pesanan</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Bulan Lalu</p>
                <div className="bg-orange-100 rounded-lg p-4">
                  <p className="text-xl font-bold text-orange-500">Rp {monthlyComparison.lastMonth.revenue.toLocaleString()}</p>
                  <p className="text-sm text-orange-500">{monthlyComparison.lastMonth.orders} pesanan</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Bulan Ini</p>
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="text-xl font-bold text-green-600">Rp {monthlyComparison.thisMonth.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-500">{monthlyComparison.thisMonth.orders} pesanan</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${monthlyComparison.isGrowth ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <TrendingUp className={`w-4 h-4 ${monthlyComparison.isGrowth ? '' : 'rotate-180'}`} />
                <span className="font-bold">
                  {monthlyComparison.isGrowth ? '+' : ''}
                  {monthlyComparison.percentageChange.toFixed(1)}%
                </span>
                <span>vs bulan lalu</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Transactions Chart */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Transaksi per Jam</span>
            </CardTitle>
            <Select value={hourlyChartDate} onValueChange={setHourlyChartDate}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="yesterday">Kemarin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2">
              {hourlyTransactions.map((data, index) => (
                <div key={index} className="text-center">
                  <div className="bg-orange-50 rounded p-2 mb-2 h-20 flex items-end justify-center">
                    <div
                      className="bg-orange-500 rounded w-full transition-all duration-300"
                      style={{
                        height: `${(data.count / maxHourlyCount) * 60}px`,
                        minHeight: data.count > 0 ? '4px' : '0px',
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-600">{data.hour}</div>
                  <div className="text-xs font-bold text-orange-500">{data.count}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-500">
              Peak hours:{' '}
              {hourlyTransactions
                .filter((h) => h.count === maxHourlyCount && h.count > 0)
                .map((h) => h.hour)
                .join(', ') || 'No transactions'}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <Card>
          <CardHeader>
            <CardTitle>Item Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-orange-500">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.quantity} terjual</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">Rp {item.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(paymentMethods).map(([method, count]) => (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="capitalize">
                      {method === 'qris' ? 'QRIS' : method === 'debit' ? 'Debit' : 'Tunai'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{count} pesanan</p>
                    <p className="text-sm text-gray-600">{((count / totalOrders) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
