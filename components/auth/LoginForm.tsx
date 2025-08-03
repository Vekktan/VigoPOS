'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Coffee } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  requiredRole?: 'cashier' | 'kitchen' | 'admin' | 'manager';
  onSuccess?: () => void;
}

export function LoginForm({ requiredRole, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    try {
      const success = await login(email, password);

      if (success) {
        if (requiredRole) {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if (user.role !== requiredRole && user.role !== 'admin') {
            setError(`Akses ditolak. Anda memerlukan role ${requiredRole}`);
            return;
          }
        }

        onSuccess?.();
      } else {
        setError('Email atau password salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'cashier':
        return 'Cashier';
      case 'kitchen':
        return 'Kitchen';
      case 'admin':
        return 'Administrator';
      case 'manager':
        return 'Manager';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* KIRI: FORM LOGIN */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                  <Coffee className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">ROKA Coffee</CardTitle>
              <CardDescription className="text-gray-600">{requiredRole ? `Login sebagai ${getRoleDisplayName(requiredRole)}` : 'Silakan login untuk melanjutkan'}</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan password Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 text-base pr-12 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      disabled={loading}
                    />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)} disabled={loading}>
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">Demo credentials:</p>
                <div className="mt-2 space-y-1 text-xs text-gray-400">
                  <p>Cashier: cashier@rokacoffee.com</p>
                  <p>Kitchen: kitchen@rokacoffee.com</p>
                  <p>Admin: admin@rokacoffee.com</p>
                  <p>Password: 123456</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KANAN: GAMBAR ILUSTRASI */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-white-500">
          <div className="relative w-[90%] h-[90%] max-w-md bg-black rounded-2xl shadow-lg flex items-center justify-center p-6">
            <img
              src="/group-129.png" // Ganti sesuai path terbaru jika perlu
              alt="Login Illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
