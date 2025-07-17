'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, MapPin, Phone, Search } from 'lucide-react';
import type { Order } from '@/app/cashier/page';

interface HistoryPageProps {
  orders: Order[];
}

export function HistoryPage({ orders }: HistoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || order.customerPhone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || order.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-500';
      case 'rejected':
        return 'bg-red-500';
      case 'sent-to-kitchen':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSourceColor = (source: Order['source']) => {
    return source === 'qris' ? 'bg-purple-500' : 'bg-orange-500';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
            <p className="text-gray-600">All cashier and QRIS table orders</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search by ID, name, or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="sent-to-kitchen">Sent to Kitchen</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="cashier">Cashier</SelectItem>
              <SelectItem value="qris">QRIS Table</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-3">
                    <span>{order.id}</span>
                    <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status.replace('-', ' ').toUpperCase()}</Badge>
                    <Badge className={`${getSourceColor(order.source)} text-white`}>{order.source.toUpperCase()}</Badge>
                  </CardTitle>
                  <div className="text-sm text-gray-500">{order.timestamp.toLocaleString()}</div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{order.customerPhone}</span>
                  </div>
                  {order.tableNumber && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Table {order.tableNumber}</span>
                    </div>
                  )}
                  <Badge variant={order.orderType === 'dine-in' ? 'default' : 'secondary'}>{order.orderType}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Order Items:</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span>
                            {item.quantity}x {item.name}
                            {item.selectedSize && ` (${item.selectedSize})`}
                            {item.notes && <span className="text-gray-500 italic"> - {item.notes}</span>}
                          </span>
                          <span className="font-medium text-orange-500">Rp {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">Payment: {order.paymentMethod.toUpperCase()}</span>
                    </div>
                    <div className="text-lg font-bold text-orange-500">Total: Rp {order.total.toLocaleString()}</div>
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
