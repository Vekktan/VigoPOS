'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'cashier' | 'kitchen' | 'manager';
  is_active: boolean;
  last_login?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('auth_token');

        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        logout();
      } finally {
        setInitialized(true);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    try {
      // For demo purposes, we'll use a simple authentication
      // In production, you should use proper JWT tokens and server-side validation

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo users (in production, this would be a database query)
      const demoUsers = [
        {
          id: '880e8400-e29b-41d4-a716-446655440001',
          email: 'admin@rokacoffee.com',
          password: '123456',
          full_name: 'Administrator',
          role: 'admin' as const,
          is_active: true,
        },
        {
          id: '880e8400-e29b-41d4-a716-446655440002',
          email: 'cashier@rokacoffee.com',
          password: '123456',
          full_name: 'Cashier Staff',
          role: 'cashier' as const,
          is_active: true,
        },
        {
          id: '880e8400-e29b-41d4-a716-446655440003',
          email: 'kitchen@rokacoffee.com',
          password: '123456',
          full_name: 'Kitchen Staff',
          role: 'kitchen' as const,
          is_active: true,
        },
        {
          id: '880e8400-e29b-41d4-a716-446655440004',
          email: 'manager@rokacoffee.com',
          password: '123456',
          full_name: 'Manager',
          role: 'manager' as const,
          is_active: true,
        },
      ];

      const foundUser = demoUsers.find((u) => u.email === email && u.password === password);

      if (foundUser && foundUser.is_active) {
        const userData: User = {
          id: foundUser.id,
          email: foundUser.email,
          full_name: foundUser.full_name,
          role: foundUser.role,
          is_active: foundUser.is_active,
          last_login: new Date().toISOString(),
        };

        // Store user data and token
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('auth_token', 'demo_token_' + Date.now());

        setUser(userData);

        // Update last login in database (optional)
        try {
          await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', foundUser.id);
        } catch (error) {
          console.warn('Failed to update last login:', error);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  const hasRole = useCallback(
    (role: User['role']) => {
      return user?.role === role || user?.role === 'admin';
    },
    [user]
  );

  return {
    user,
    loading,
    initialized,
    isAuthenticated,
    login,
    logout,
    hasRole,
  };
};
