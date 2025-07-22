'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Calendar, Download, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/app/cashier/page';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function SalesReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [hourlyChartDate, setHourlyChartDate] = useState('today');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  // Tambahkan state untuk bulan top items
  const [topItemsMonth, setTopItemsMonth] = useState<'this' | 'last' | 'twoAgo'>('this');

  // Ambil data orders dari Supabase untuk 1 tahun terakhir saja
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const now = new Date();
      const yearAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 365);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('created_at', yearAgo.toISOString());
      if (error) {
        setOrders([]);
        setLoading(false);
        return;
      }
      const mappedOrders: Order[] = (data || []).map((order: any) => ({
        id: order.id,
        items: order.items || [],
        customerName: order.customer_name || '',
        customerPhone: order.customer_phone || '',
        orderType: order.order_type || 'dine-in',
        tableNumber: order.table_number || undefined,
        paymentMethod: order.payment_method || 'cash',
        total: order.total_price || 0,
        status: order.status || 'accepted',
        timestamp: new Date(order.created_at),
        source: order.source || 'cashier',
        notes: order.notes || '',
      }));
      setOrders(mappedOrders);
      setLoading(false);
    };
    fetchOrders();
  }, []); // hanya fetch sekali

  // Filter orders untuk summary saja
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
  // Summary cards hanya pakai filteredOrders
  const filteredOrders = filterOrdersByPeriod(selectedPeriod);
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;

  // Perbaiki rentang waktu bulanan
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  // Generate daftar bulan unik dari data transaksi
  const getAvailableMonths = () => {
    const months = new Set<string>();
    orders.forEach(order => {
      const d = order.timestamp;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.add(key);
    });
    // Urutkan dari terbaru ke terlama
    return Array.from(months).sort((a: string, b: string) => b.localeCompare(a));
  };

  // Label bulan
  const getMonthLabel = (key: string) => {
    const [year, month] = key.split('-');
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

  // Filter orders by bulan
  const filterOrdersByMonthKey = (monthKey: string) => {
    if (!monthKey) return [];
    const [year, month] = monthKey.split('-');
    const start = new Date(parseInt(year), parseInt(month) - 1, 1);
    const end = new Date(parseInt(year), parseInt(month), 1);
    return orders.filter(order => order.timestamp >= start && order.timestamp < end);
  };

  // State untuk dropdown bulan
  const availableMonths: string[] = getAvailableMonths();
  const [comparisonMonth1, setComparisonMonth1] = useState<string>(availableMonths[0] || '');
  const [comparisonMonth2, setComparisonMonth2] = useState<string>(availableMonths[1] || '');

  // Monthly comparison data
  const getMonthlyComparison = () => {
    const orders1 = filterOrdersByMonthKey(comparisonMonth1);
    const orders2 = filterOrdersByMonthKey(comparisonMonth2);
    const revenue1 = orders1.reduce((sum, order) => sum + order.total, 0);
    const revenue2 = orders2.reduce((sum, order) => sum + order.total, 0);
    const percentageChange = revenue2 > 0 ? ((revenue1 - revenue2) / revenue2) * 100 : 0;
    return {
      month1: { revenue: revenue1, orders: orders1.length },
      month2: { revenue: revenue2, orders: orders2.length },
      percentageChange,
      isGrowth: revenue1 > revenue2,
    };
  };
  const monthlyComparison = getMonthlyComparison();

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

  const hourlyTransactions = getHourlyTransactions();
  const maxHourlyCount = Math.max(...hourlyTransactions.map((h) => h.count), 1);

  // Fungsi untuk filter orders per bulan
  let topItemsOrders: typeof orders = [];
  if (topItemsMonth === 'this') {
    topItemsOrders = orders.filter((order) => order.timestamp >= thisMonth);
  } else if (topItemsMonth === 'last') {
    topItemsOrders = orders.filter((order) => order.timestamp >= lastMonth && order.timestamp < thisMonth);
  } else if (topItemsMonth === 'twoAgo') {
    topItemsOrders = orders.filter((order) => order.timestamp >= twoMonthsAgo && order.timestamp < lastMonth);
  }

  // Hitung top selling items dari orders bulan yang dipilih
  const itemSales = new Map<string, { name: string; quantity: number; revenue: number }>();
  topItemsOrders.forEach((order) => {
    order.items.forEach((item) => {
      // Gunakan id produk, jika tidak ada fallback ke nama produk (lowercase, trim)
      const key = item.id ? String(item.id) : (item.name || '').toLowerCase().trim();
      const existing = itemSales.get(key) || { name: item.name, quantity: 0, revenue: 0 };
      existing.quantity += item.quantity;
      existing.revenue += (item.price || 0) * (item.quantity || 0);
      itemSales.set(key, existing);
    });
  });
  const topItems = Array.from(itemSales.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 3);

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

  // Ganti seluruh isi return (JSX) dengan tampilan baru dari kode user, tanpa mengubah logika perhitungan dan filter data.
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
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Ringkasan Penjualan</span>
            </CardTitle>
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </CardContent>
      </Card>

      {/* Monthly Comparison Chart */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Perbandingan Penjualan Bulanan</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={comparisonMonth1 || ''} onValueChange={setComparisonMonth1}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((key: string) => (
                    <SelectItem key={key} value={key}>{getMonthLabel(key)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500">vs</span>
              <Select value={comparisonMonth2 || ''} onValueChange={setComparisonMonth2}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((key: string) => (
                    <SelectItem key={key} value={key}>{getMonthLabel(key)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">{getMonthLabel(comparisonMonth1)}</p>
                <div className="bg-orange-100 rounded-lg p-4">
                  <p className="text-xl font-bold text-orange-500">Rp {monthlyComparison.month1.revenue.toLocaleString()}</p>
                  <p className="text-sm text-orange-500">{monthlyComparison.month1.orders} pesanan</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">{getMonthLabel(comparisonMonth2)}</p>
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="text-xl font-bold text-green-600">Rp {monthlyComparison.month2.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-500">{monthlyComparison.month2.orders} pesanan</p>
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
            <div className="flex items-center justify-between">
              <CardTitle>Item Terlaris</CardTitle>
              <Select value={topItemsMonth} onValueChange={v => setTopItemsMonth(v as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this">Bulan Ini</SelectItem>
                  <SelectItem value="last">Bulan Lalu</SelectItem>
                  <SelectItem value="twoAgo">2 Bulan Lalu</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <div className="flex items-center justify-between">
              <CardTitle>Metode Pembayaran</CardTitle>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hari Ini</SelectItem>
                  <SelectItem value="week">7 Hari Terakhir</SelectItem>
                  <SelectItem value="month">30 Hari Terakhir</SelectItem>
                  <SelectItem value="year">1 Tahun Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
