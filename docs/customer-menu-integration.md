# Customer Menu Integration

Dokumen ini menjelaskan integrasi aplikasi customer untuk mengambil menu items dari tabel items di Supabase dan menghapus data dummy.

## Perubahan yang Dibuat

### 1. Hook Menu Items

Membuat hook baru `hooks/useMenuItems.ts` yang:
- Mengambil data menu items dari tabel `items` di Supabase
- Mengambil data kategori dari tabel `categories`
- Mengambil data opsi item dari tabel `item_options` dan `item_option_values`
- Menyediakan real-time updates menggunakan Supabase subscriptions
- Menangani loading state dan error handling

### 2. Interface Updates

Memperbarui interface untuk menyesuaikan dengan struktur data Supabase:

```typescript
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description: string;
  isPromo: boolean;
  options: ProductOption[];
}

export interface ProductOption {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: {
    id: string;
    name: string;
    price: number;
    available: boolean;
  }[];
}
```

### 3. Customer App Updates

Memperbarui `app/customer/page.tsx`:
- Mengganti data dummy `menuItems` dengan hook `useMenuItems`
- Menambahkan loading state dan error handling
- Mempertahankan semua fitur UI yang sudah ada
- Menambahkan dukungan untuk promo items dan original price
- Menambahkan empty state ketika tidak ada menu ditemukan
- **Menghapus biaya layanan (service charge)** - Total langsung dari harga item

### 4. Script Seeding

Membuat script `scripts/seed-menu-items.ts` untuk:
- Menambahkan kategori yang sesuai dengan tampilan customer app
- Menambahkan menu items dengan opsi yang lengkap
- Menambahkan data promo dan original price
- Menambahkan opsi seperti size, sugar level, dan extra shot

## Struktur Data

### Categories
- Coffee (☕)
- Milk Based (🥛)
- Makanan (🍽️)
- Dessert (🍰)

### Menu Items
1. **Americano** - Coffee category
2. **Cappuccino** - Coffee category
3. **Matcha Latte** - Milk Based category
4. **Caramel Macchiato** - Milk Based category (PROMO)
5. **Croissant** - Makanan category
6. **Sandwich Club** - Makanan category
7. **Tiramisu** - Dessert category
8. **Cheesecake** - Dessert category

### Options Structure
Setiap item minuman memiliki opsi:
- **Pilihan Size**: Small (0), Medium (+3000), Large (+5000)
- **Tingkat Gula**: Normal, Sedikit, Tanpa Gula
- **Extra Shot**: No (0), Yes (+5000)

## Cara Penggunaan

### 1. Setup Database

Pastikan schema database sudah dijalankan di Supabase:

```sql
-- Copy dan paste isi dari database/schema.sql
```

### 2. Seed Menu Data

Jalankan script seeding untuk menambahkan data menu:

```bash
npm run seed-menu
```

### 3. Test Customer App

1. Buka aplikasi customer di `localhost:3000/customer`
2. Menu akan dimuat dari Supabase
3. Kategori akan otomatis diambil dari database
4. Opsi item akan tersedia sesuai dengan data di database

## Fitur yang Dipertahankan

✅ **UI/UX**: Tampilan tetap sama seperti sebelumnya
✅ **Search**: Pencarian menu tetap berfungsi
✅ **Category Filter**: Filter berdasarkan kategori tetap ada
✅ **Product Detail**: Halaman detail produk tetap sama
✅ **Cart**: Keranjang belanja tetap berfungsi
✅ **Options**: Opsi item tetap tersedia
✅ **Promo Badge**: Badge promo untuk item yang sedang promo
✅ **Original Price**: Harga asli untuk item promo

## Fitur Baru

🔄 **Real-time Updates**: Menu update otomatis ketika ada perubahan di database
💾 **Data Persisten**: Data tersimpan di database, tidak hilang saat refresh
📱 **Dynamic Categories**: Kategori diambil dari database, bukan hardcoded
⚡ **Loading States**: Loading indicator saat memuat data
🛡️ **Error Handling**: Error handling yang proper
🎯 **Promo Support**: Dukungan untuk item promo dengan harga asli
💰 **No Service Charge**: Total harga langsung tanpa biaya layanan

## Perubahan Pricing

### Sebelumnya:
- Subtotal: Rp 18.000
- Biaya Layanan (10%): Rp 1.800
- Total: Rp 19.800

### Sekarang:
- Total: Rp 18.000 (langsung dari harga item)

## Real-time Features

Sistem menggunakan Supabase real-time subscriptions untuk:
- Update menu otomatis ketika ada item baru
- Update harga dan opsi secara real-time
- Update status promo secara real-time
- Update kategori secara real-time

## Troubleshooting

### 1. Menu tidak muncul
- Periksa koneksi Supabase
- Pastikan tabel `items`, `categories`, `item_options`, dan `item_option_values` sudah dibuat
- Jalankan `npm run seed-menu` untuk menambahkan data
- Cek console untuk error

### 2. Kategori tidak muncul
- Pastikan tabel `categories` sudah diisi
- Periksa relasi antara `items` dan `categories`
- Cek apakah `category_id` di tabel `items` valid

### 3. Opsi item tidak muncul
- Pastikan tabel `item_options` dan `item_option_values` sudah diisi
- Periksa relasi antara `items` dan `item_options`
- Cek apakah `item_id` di tabel `item_options` valid

### 4. Real-time tidak berfungsi
- Pastikan Supabase real-time sudah diaktifkan
- Periksa Row Level Security (RLS) policies
- Cek network connectivity

## Keuntungan Implementasi Ini

1. **Centralized Data**: Menu dikelola dari satu tempat (Supabase)
2. **Real-time**: Update otomatis tanpa refresh
3. **Scalable**: Mudah menambah/mengubah menu
4. **Consistent**: Data konsisten antara customer app dan cashier app
5. **Maintainable**: Kode terstruktur dengan baik
6. **Flexible**: Mudah menambah kategori dan opsi baru
7. **Transparent Pricing**: Harga langsung tanpa biaya tersembunyi 