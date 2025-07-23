# Troubleshooting QRIS Payment Issues

Panduan ini membantu mengatasi masalah "Terjadi kesalahan saat membuat pesanan" saat melakukan simulasi pembayaran QRIS.

## Langkah Diagnostik

### 1. Periksa Database Setup

Jalankan script diagnostik untuk memeriksa setup database:

```bash
npm run check-db
```

Script ini akan memeriksa:
- ✅ Tabel `orders` dan `qris_notifications` sudah ada
- ✅ Tabel `items` dan `categories` sudah ada
- ✅ Data menu sudah di-seed
- ✅ Kemampuan membuat order dan notification

### 2. Periksa Console Logs

Buka Developer Tools (F12) di browser dan periksa:
- **Console tab**: Error messages dari JavaScript
- **Network tab**: API request/response untuk `/api/qris-orders`

### 3. Periksa Server Logs

Jika menjalankan development server, periksa terminal untuk:
- Error messages dari API endpoint
- Database connection issues
- Validation errors

## Masalah Umum dan Solusi

### 1. Tabel Belum Dibuat

**Gejala**: Error "relation does not exist"

**Solusi**:
1. Buka Supabase Dashboard
2. Buka SQL Editor
3. Copy dan paste isi `database/schema.sql`
4. Jalankan query

### 2. Data Menu Kosong

**Gejala**: Customer app tidak menampilkan menu

**Solusi**:
```bash
npm run seed-menu
```

### 3. Supabase Connection Issues

**Gejala**: Error "Failed to fetch" atau connection timeout

**Solusi**:
1. Periksa environment variables di `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
2. Pastikan URL dan key benar
3. Periksa Supabase project status

### 4. RLS (Row Level Security) Issues

**Gejala**: Error "new row violates row-level security policy"

**Solusi**:
1. Buka Supabase Dashboard
2. Buka Authentication > Policies
3. Pastikan tabel `orders` dan `qris_notifications` memiliki policy yang mengizinkan INSERT
4. Atau sementara disable RLS untuk testing

### 5. Data Validation Errors

**Gejala**: Error "invalid input syntax" atau constraint violations

**Solusi**:
1. Periksa format data yang dikirim
2. Pastikan `order_type` adalah 'dine-in' atau 'takeaway'
3. Pastikan `payment_method` adalah 'qris'
4. Pastikan `total_amount` adalah angka positif

## Debugging Steps

### Step 1: Periksa Request Data

Tambahkan logging di customer app untuk melihat data yang dikirim:

```typescript
console.log('Sending order data:', orderData);
```

### Step 2: Periksa API Response

Tambahkan logging di API endpoint (sudah ada):

```typescript
console.log('Received QRIS order request:', JSON.stringify(body, null, 2));
```

### Step 3: Test Database Connection

Jalankan script test:

```bash
npm run check-db
```

### Step 4: Test Manual Order Creation

Coba buat order manual di Supabase SQL Editor:

```sql
INSERT INTO orders (
  table_number,
  customer_name,
  customer_phone,
  order_type,
  payment_method,
  total_amount,
  status,
  source,
  items,
  notes
) VALUES (
  'TEST',
  'Test Customer',
  '+62 812-3456-7890',
  'dine-in',
  'qris',
  50000,
  'pending',
  'qris',
  '[{"id": "test", "name": "Test Item", "price": 50000, "quantity": 1}]',
  'Test order'
);
```

## Environment Variables Checklist

Pastikan file `.env.local` berisi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Project Setup Checklist

1. ✅ Project dibuat di Supabase
2. ✅ Database schema dijalankan
3. ✅ API keys dikonfigurasi
4. ✅ RLS policies dikonfigurasi (atau disabled untuk testing)
5. ✅ Real-time enabled untuk tabel `qris_notifications`

## Testing Flow

### 1. Test Database Connection
```bash
npm run check-db
```

### 2. Test Menu Loading
1. Buka `localhost:3000/customer`
2. Pastikan menu muncul
3. Jika tidak, jalankan `npm run seed-menu`

### 3. Test Order Creation
1. Tambahkan item ke cart
2. Proses ke QRIS payment
3. Klik "Simulasi Pembayaran Berhasil"
4. Periksa console untuk error messages

### 4. Test Cashier Notification
1. Buka `localhost:3000/cashier`
2. Buka halaman notifikasi
3. Pastikan notifikasi muncul dengan animasi

## Common Error Messages

### "Failed to create order"
- Periksa database connection
- Periksa RLS policies
- Periksa data validation

### "Missing required fields"
- Pastikan `customerPhone` diisi
- Pastikan `orderType` valid
- Pastikan `items` array tidak kosong

### "Invalid input syntax"
- Periksa format data
- Pastikan tipe data sesuai schema

### "Connection timeout"
- Periksa internet connection
- Periksa Supabase project status
- Periksa API keys

## Getting Help

Jika masalah masih berlanjut:

1. **Collect Logs**: Ambil screenshot dari console dan network tab
2. **Check Database**: Jalankan `npm run check-db` dan share output
3. **Test Environment**: Pastikan semua environment variables benar
4. **Supabase Status**: Periksa status Supabase project

## Prevention

Untuk menghindari masalah di masa depan:

1. ✅ Selalu jalankan schema.sql saat setup baru
2. ✅ Seed data menu setelah setup database
3. ✅ Test order creation sebelum deploy
4. ✅ Monitor Supabase project status
5. ✅ Backup database secara berkala 