'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from './LoginForm';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'cashier' | 'kitchen' | 'admin' | 'manager';
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, requiredRole, fallback }: AuthGuardProps) {
  const { user, isAuthenticated, initialized, hasRole } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (initialized) {
      if (!isAuthenticated) {
        setShowLogin(true);
      } else if (requiredRole && !hasRole(requiredRole)) {
        setShowLogin(true);
      } else {
        setShowLogin(false);
      }
    }
  }, [initialized, isAuthenticated, requiredRole, hasRole]);

  // Show loading while checking authentication
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated or doesn't have required role
  if (showLogin) {
    return <LoginForm requiredRole={requiredRole} onSuccess={() => setShowLogin(false)} />;
  }

  // Show fallback if provided and user doesn't have access
  if (fallback && requiredRole && !hasRole(requiredRole)) {
    return <>{fallback}</>;
  }

  // Show protected content
  return <>{children}</>;
}
