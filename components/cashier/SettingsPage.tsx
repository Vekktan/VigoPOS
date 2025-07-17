'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Store, Users, Plus, Trash2 } from 'lucide-react';
import type { Order } from '@/app/cashier/page';

interface SettingsPageProps {
  orders: Order[];
}

interface BusinessInfo {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  npwp: string;
}

interface CashierUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
  createdAt: Date;
}

export function SettingsPage({ orders }: SettingsPageProps) {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: 'CoffeePOS',
    logo: '',
    address: 'Jl. Kopi No. 123, Jakarta',
    phone: '+62 21 1234 5678',
    email: 'info@coffeepos.com',
    npwp: '12.345.678.9-012.000',
  });

  const [users, setUsers] = useState<CashierUser[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@coffeepos.com',
      role: 'admin',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Cashier 1',
      email: 'cashier1@coffeepos.com',
      role: 'cashier',
      createdAt: new Date('2024-01-15'),
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'cashier' as 'admin' | 'cashier',
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;

    const user: CashierUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: new Date(),
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'cashier' });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            <p className="text-gray-600">Manage restaurant settings and user accounts</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Store className="w-5 h-5" />
                <span>Business Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <Input value={businessInfo.name} onChange={(e) => setBusinessInfo((prev) => ({ ...prev, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input value={businessInfo.phone} onChange={(e) => setBusinessInfo((prev) => ({ ...prev, phone: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <Textarea value={businessInfo.address} onChange={(e) => setBusinessInfo((prev) => ({ ...prev, address: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input type="email" value={businessInfo.email} onChange={(e) => setBusinessInfo((prev) => ({ ...prev, email: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NPWP</label>
                  <Input value={businessInfo.npwp} onChange={(e) => setBusinessInfo((prev) => ({ ...prev, npwp: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <Input placeholder="https://example.com/logo.png" value={businessInfo.logo} onChange={(e) => setBusinessInfo((prev) => ({ ...prev, logo: e.target.value }))} />
              </div>

              <Button className="bg-orange-500 hover:bg-orange-500">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>User Management</span>
                </div>
                <Badge variant="secondary">{users.length} users</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add User Form */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">Add New User</h4>
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="Full name" value={newUser.name} onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))} />
                  <Input type="email" placeholder="Email address" value={newUser.email} onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))} />
                  <div className="flex space-x-2">
                    <Select value={newUser.role} onValueChange={(value: 'admin' | 'cashier') => setNewUser((prev) => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cashier">Cashier</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleAddUser} className="bg-orange-500 hover:bg-orange-500">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Users List */}
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h4 className="font-medium text-gray-800">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Created: {user.createdAt.toLocaleDateString()}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
