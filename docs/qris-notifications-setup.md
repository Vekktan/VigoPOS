# QRIS Notifications Setup

Dokumen ini menjelaskan implementasi notifikasi QRIS yang menggunakan data asli dari Supabase untuk menggantikan data dummy.

## Perubahan yang Dibuat

### 1. Database Schema

Menambahkan tabel baru ke `database/schema.sql`:

#### Tabel `orders`
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_number VARCHAR(10),
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20) NOT NULL,
  order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('dine-in', 'takeaway')),
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('qris', 'debit', 'cash')),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'sent-to-kitchen', 'preparing', 'ready', 'delivered')),
  source VARCHAR(20) NOT NULL DEFAULT 'qris' CHECK (source IN ('cashier', 'qris')),
  items JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabel `qris_notifications`
```sql
CREATE TABLE qris_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  table_number VARCHAR(10) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('dine-in', 'takeaway')),
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'sent-to-kitchen')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Type Definitions

Memperbarui `lib/supabase.ts` dengan menambahkan types untuk tabel baru.

### 3. Hook QRIS Notifications

Membuat hook baru `hooks/useQRISNotifications.ts` yang:
- Mengambil data notifikasi QRIS dari Supabase
- Menyediakan real-time updates menggunakan Supabase subscriptions
- Menangani aksi accept/reject/send-to-kitchen
- Membuat order di database ketika notifikasi diterima

### 4. API Endpoint

Membuat endpoint baru `app/api/qris-orders/route.ts` untuk:
- Menerima pesanan QRIS dari customer app
- Menyimpan order dan notification ke Supabase
- Mengembalikan response yang sesuai

### 5. Customer App Integration

Memperbarui `apps/customer-app/services/orderApi.ts` dengan method `createQRISOrder()` untuk mengirim pesanan ke endpoint QRIS.

### 6. UI Updates

Memperbarui `components/cashier/NotificationPage.tsx` dengan:
- Loading state
- Error handling
- Real-time updates

## Cara Penggunaan

### 1. Setup Database

Jalankan schema SQL di Supabase SQL Editor:

```sql
-- Copy dan paste isi dari database/schema.sql
```

### 2. Seed Data (Opsional)

Untuk testing, jalankan script seeding:

```bash
npx tsx scripts/seed-qris-notifications.ts
```

### 3. Environment Variables

Pastikan environment variables sudah diset:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Testing

1. Buka aplikasi cashier di halaman notification
2. Data dummy akan diganti dengan data dari Supabase
3. Notifikasi akan muncul secara real-time ketika ada pesanan QRIS baru
4. Aksi accept/reject/send-to-kitchen akan menyimpan status ke database

## Fitur Real-time

Sistem menggunakan Supabase real-time subscriptions untuk:
- Menerima notifikasi baru secara otomatis
- Menghapus notifikasi yang sudah diproses
- Update status real-time tanpa refresh halaman

## Struktur Data

### QRIS Notification
```typescript
interface QRISNotification {
  id: string;
  tableNumber: string;
  items: CartItem[];
  orderType: 'dine-in' | 'takeaway';
  customerPhone: string;
  total: number;
  timestamp: Date;
}
```

### Order
```typescript
interface Order {
  id: string;
  tableNumber?: string;
  customerName: string;
  customerPhone: string;
  orderType: 'dine-in' | 'takeaway';
  paymentMethod: 'qris' | 'debit' | 'cash';
  total: number;
  status: 'pending' | 'accepted' | 'rejected' | 'sent-to-kitchen';
  source: 'cashier' | 'qris';
  timestamp: Date;
  items: CartItem[];
  notes?: string;
}
```

## Troubleshooting

### 1. Notifikasi tidak muncul
- Periksa koneksi Supabase
- Pastikan tabel `qris_notifications` sudah dibuat
- Cek console untuk error

### 2. Real-time tidak berfungsi
- Pastikan Supabase real-time sudah diaktifkan
- Periksa Row Level Security (RLS) policies
- Cek network connectivity

### 3. Error saat aksi
- Periksa console untuk error detail
- Pastikan permissions database sudah benar
- Cek struktur data yang dikirim

## Keuntungan Implementasi Ini

1. **Data Persisten**: Data tersimpan di database, tidak hilang saat refresh
2. **Real-time**: Update otomatis tanpa refresh halaman
3. **Scalable**: Bisa menangani banyak notifikasi sekaligus
4. **Reliable**: Menggunakan Supabase yang reliable dan secure
5. **Maintainable**: Kode terstruktur dengan baik dan mudah di-maintain 