# Authentication System Setup

## Overview

Sistem autentikasi telah ditambahkan ke VigoPOS untuk melindungi akses ke halaman Cashier dan Kitchen Display. Sistem ini menggunakan role-based access control (RBAC) dengan 4 role utama:

- **Admin**: Akses penuh ke semua fitur
- **Cashier**: Akses ke halaman cashier
- **Kitchen**: Akses ke halaman kitchen display
- **Manager**: Akses ke semua fitur (setara admin)

## Setup Database

### 1. Jalankan Schema Database

Pastikan tabel `users` sudah dibuat di database Supabase:

```sql
-- Tabel users sudah ada di database/schema.sql
-- Jalankan script schema untuk membuat tabel
```

### 2. Install Dependencies

```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

### 3. Seed Users

Jalankan script untuk membuat user demo:

```bash
npm run seed-users
```

## Demo Credentials

Setelah menjalankan seed script, user berikut akan tersedia:

| Email                  | Password | Role    | Akses           |
| ---------------------- | -------- | ------- | --------------- |
| admin@rokacoffee.com   | 123456   | Admin   | Semua halaman   |
| cashier@rokacoffee.com | 123456   | Cashier | Halaman Cashier |
| kitchen@rokacoffee.com | 123456   | Kitchen | Halaman Kitchen |
| manager@rokacoffee.com | 123456   | Manager | Semua halaman   |

## Komponen Authentication

### 1. LoginForm (`components/auth/LoginForm.tsx`)

Form login dengan fitur:

- Email dan password validation
- Role-based access control
- Loading states
- Error handling
- Password visibility toggle

### 2. AuthGuard (`components/auth/AuthGuard.tsx`)

Komponen untuk melindungi halaman:

- Redirect ke login jika tidak authenticated
- Role validation
- Loading states saat checking auth

### 3. UserInfo (`components/auth/UserInfo.tsx`)

Komponen untuk menampilkan info user:

- Avatar dengan initials
- Dropdown menu
- Logout functionality
- Role display

### 4. useAuth Hook (`hooks/useAuth.ts`)

Custom hook untuk state management:

- Login/logout functions
- User state management
- Role checking
- Local storage persistence

## Implementasi di Halaman

### Cashier Page

```tsx
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function CashierPage() {
  return <AuthGuard requiredRole="cashier">{/* Cashier content */}</AuthGuard>;
}
```

### Kitchen Page

```tsx
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function KitchenPage() {
  return <AuthGuard requiredRole="kitchen">{/* Kitchen content */}</AuthGuard>;
}
```

## Security Features

### 1. Role-Based Access Control

- Setiap halaman dapat dibatasi berdasarkan role
- Admin memiliki akses ke semua halaman
- User hanya bisa mengakses halaman sesuai rolenya

### 2. Session Management

- User session disimpan di localStorage
- Auto-logout saat token expired
- Secure logout dengan clear session

### 3. Password Security

- Password di-hash menggunakan bcrypt
- Salt rounds: 10
- Secure password validation

## Production Considerations

### 1. JWT Implementation

Untuk production, ganti sistem demo dengan JWT:

```typescript
// Implementasi JWT di useAuth hook
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const { token, user } = await response.json();
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return true;
  }
  return false;
};
```

### 2. API Routes

Buat API routes untuk authentication:

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Validate user from database
  // Hash password comparison
  // Generate JWT token
  // Return user data and token
}
```

### 3. Middleware Protection

Tambahkan middleware untuk API protection:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.headers.get('authorization');

  if (!token && request.nextUrl.pathname.startsWith('/api/protected')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}
```

## Troubleshooting

### 1. Login Gagal

- Pastikan user sudah di-seed ke database
- Check email dan password
- Verify role permissions

### 2. Akses Ditolak

- Pastikan user memiliki role yang sesuai
- Check requiredRole di AuthGuard
- Verify user is_active status

### 3. Session Hilang

- Check localStorage di browser
- Verify token expiration
- Clear cache dan reload

## Testing

### Manual Testing

1. Coba login dengan credentials yang salah
2. Test role-based access
3. Test logout functionality
4. Test session persistence

### Automated Testing

```typescript
// __tests__/auth.test.ts
describe('Authentication', () => {
  test('should login with valid credentials', async () => {
    // Test login
  });

  test('should reject invalid credentials', async () => {
    // Test invalid login
  });

  test('should enforce role-based access', async () => {
    // Test role restrictions
  });
});
```

## Monitoring

### Logs

Monitor login attempts dan access patterns:

```typescript
// Log login attempts
console.log(`Login attempt: ${email} at ${new Date().toISOString()}`);

// Log access violations
console.log(`Access denied: ${user.email} tried to access ${requiredRole}`);
```

### Analytics

Track user activity dan role usage untuk optimasi sistem.
