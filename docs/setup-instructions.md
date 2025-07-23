# Setup Instructions - QRIS Payment System

Panduan lengkap untuk setup sistem pembayaran QRIS dengan real-time notifications.

## 1. Setup Supabase Project

### 1.1 Buat Project Supabase
1. Buka [https://supabase.com](https://supabase.com)
2. Login atau daftar akun
3. Klik "New Project"
4. Pilih organization
5. Isi nama project (misal: "vigo-pos")
6. Pilih database password
7. Pilih region terdekat
8. Klik "Create new project"

### 1.2 Setup Database Schema
1. Buka project yang baru dibuat
2. Buka **SQL Editor** di sidebar kiri
3. Copy seluruh isi file `database/schema.sql`
4. Paste ke SQL Editor
5. Klik **Run** untuk menjalankan schema

### 1.3 Dapatkan API Keys
1. Buka **Settings** > **API** di sidebar
2. Copy **Project URL** dan **anon public** key
3. Buat file `.env.local` di root project
4. Isi dengan format berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 2. Setup Environment Variables

### 2.1 Buat File .env.local
```bash
# Di root project, buat file .env.local
touch .env.local
```

### 2.2 Isi Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjM2NTQ3MjAwLCJleHAiOjE5NTIxMjMyMDB9.example
```

## 3. Seed Database dengan Data Sample

### 3.1 Seed Menu Items
```bash
npm run seed-menu
```

### 3.2 Seed QRIS Notifications (Optional)
```bash
npm run seed-qris
```

### 3.3 Check Database Setup
```bash
npm run check-db
```

## 4. Konfigurasi Supabase

### 4.1 Enable Real-time
1. Buka **Database** > **Replication**
2. Pastikan **Real-time** enabled untuk tabel:
   - `qris_notifications`
   - `orders`

### 4.2 Row Level Security (RLS)
Untuk development, Anda bisa disable RLS sementara:

1. Buka **Authentication** > **Policies**
2. Untuk tabel `orders` dan `qris_notifications`
3. Toggle **RLS** ke OFF

Atau buat policy yang mengizinkan semua operasi:

```sql
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE qris_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Enable all operations for orders" ON orders
FOR ALL USING (true) WITH CHECK (true);

-- Create policies for qris_notifications
CREATE POLICY "Enable all operations for qris_notifications" ON qris_notifications
FOR ALL USING (true) WITH CHECK (true);
```

## 5. Test Setup

### 5.1 Test Database Connection
```bash
npm run check-db
```

Expected output:
```
✅ Orders table is accessible
✅ QRIS notifications table is accessible
✅ Items table is accessible (8 items found)
✅ Categories table is accessible (4 categories found)
✅ Test order created successfully
✅ Test notification created successfully
✅ Test data cleaned up
🎉 Database setup check completed!
```

### 5.2 Test Customer App
1. Jalankan development server:
   ```bash
   npm run dev
   ```
2. Buka `http://localhost:3000/customer`
3. Pastikan menu muncul
4. Tambahkan item ke cart
5. Proses ke pembayaran QRIS
6. Klik "Simulasi Pembayaran Berhasil"

### 5.3 Test Cashier App
1. Buka `http://localhost:3000/cashier`
2. Buka halaman notifikasi
3. Pastikan notifikasi muncul dengan animasi
4. Test tombol aksi: Terima, Tolak, Kirim ke Dapur

## 6. Troubleshooting

### 6.1 Error "supabaseUrl is required"
- Pastikan file `.env.local` sudah dibuat
- Pastikan environment variables sudah diisi dengan benar
- Restart development server setelah mengubah `.env.local`

### 6.2 Error "relation does not exist"
- Jalankan schema.sql di Supabase SQL Editor
- Pastikan semua tabel sudah dibuat

### 6.3 Error "new row violates check constraint"
- Pastikan `order_type` adalah `'dine-in'` atau `'takeaway'` (bukan `'dine in'`)
- Pastikan `payment_method` adalah `'qris'`
- Pastikan `total_amount` adalah angka positif

### 6.4 Error "new row violates row-level security policy"
- Disable RLS sementara untuk testing
- Atau buat policy yang mengizinkan operasi

### 6.5 Notifikasi tidak muncul real-time
- Pastikan real-time enabled di Supabase
- Periksa console untuk error
- Pastikan subscription channel berfungsi

## 7. Production Setup

### 7.1 Environment Variables
Untuk production, gunakan environment variables yang aman:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 7.2 RLS Policies
Untuk production, buat RLS policies yang lebih aman:

```sql
-- Example RLS policies for production
CREATE POLICY "Users can view their own orders" ON orders
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON orders
FOR INSERT WITH CHECK (true);
```

### 7.3 Monitoring
- Setup Supabase monitoring
- Monitor real-time connections
- Setup error logging

## 8. Development Workflow

### 8.1 Saat Menambah Fitur Baru
1. Update schema.sql jika perlu
2. Jalankan schema di Supabase
3. Update environment variables jika perlu
4. Test dengan `npm run check-db`
5. Test fitur di customer dan cashier app

### 8.2 Saat Deploy
1. Pastikan semua environment variables sudah diset
2. Jalankan schema di production database
3. Seed data jika diperlukan
4. Test semua fitur

## 9. File Structure

```
VigoPOS/
├── .env.local                    # Environment variables
├── database/
│   └── schema.sql               # Database schema
├── scripts/
│   ├── check-database-setup.ts  # Database check script
│   ├── seed-menu-items.ts       # Menu seeding script
│   └── seed-qris-notifications.ts # QRIS notifications seeding
├── app/
│   ├── api/qris-orders/         # QRIS orders API
│   ├── customer/                # Customer app
│   └── cashier/                 # Cashier app
└── hooks/
    └── useQRISNotifications.ts  # Real-time notifications hook
```

## 10. Support

Jika mengalami masalah:

1. Jalankan `npm run check-db` dan share output
2. Periksa console browser untuk error
3. Periksa terminal untuk server error
4. Pastikan semua environment variables sudah benar
5. Pastikan Supabase project status normal 