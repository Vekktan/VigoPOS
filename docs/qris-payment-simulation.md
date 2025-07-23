# QRIS Payment Simulation System

Dokumen ini menjelaskan implementasi sistem simulasi pembayaran QRIS dengan real-time updates ke halaman notifikasi kasir.

## Fitur Utama

### 1. Simulasi Pembayaran QRIS
- Tombol simulasi pembayaran berhasil dan gagal
- Status pembayaran real-time
- Feedback visual untuk user

### 2. Real-time Order Creation
- Order otomatis dibuat di Supabase saat pembayaran berhasil
- Notifikasi real-time ke kasir
- Data order lengkap dengan items dan opsi

### 3. Kasir Notification System
- Real-time updates menggunakan Supabase subscriptions
- Animasi untuk notifikasi baru
- Tiga aksi: Terima, Tolak, Kirim ke Dapur
- Status tracking yang akurat

## Alur Sistem

### 1. Customer Flow
```
Customer App → QRIS Payment → Simulasi Pembayaran → Order Creation → Real-time Notification
```

### 2. Cashier Flow
```
Real-time Notification → Review Order → Action (Accept/Reject/Send to Kitchen) → Status Update
```

## Implementasi Teknis

### 1. Customer App Updates

#### State Management
```typescript
const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
const [orderId, setOrderId] = useState<string | null>(null);
```

#### Payment Simulation Functions
```typescript
const handleSimulatePaymentSuccess = async () => {
  // Create order in Supabase
  // Send notification to cashier
  // Update payment status
};

const handleSimulatePaymentFailed = () => {
  // Show failure message
  // Reset payment status
};
```

#### Order Data Structure
```typescript
const orderData = {
  tableNumber: tableNumber,
  customerPhone: customerWhatsApp,
  orderType: orderType.toLowerCase(),
  items: cart.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    image: item.image,
    isPromo: item.isPromo,
    quantity: item.quantity,
    selectedOptions: item.selectedOptions,
    notes: item.notes,
    totalPrice: item.totalPrice,
  })),
  totalAmount: finalTotal,
  notes: additionalNotes,
};
```

### 2. API Endpoint Updates

#### Enhanced Order Creation
- Validasi data yang lebih ketat
- Logging untuk debugging
- Error handling yang lebih baik
- Real-time notification creation

#### Response Structure
```typescript
{
  success: true,
  data: {
    orderId: string,
    notificationId: string,
    message: string
  }
}
```

### 3. Real-time Notification System

#### Supabase Subscriptions
```typescript
const channel = supabase
  .channel('qris_notifications')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'qris_notifications',
      filter: 'status=eq.pending'
    },
    (payload) => {
      // Handle real-time updates
    }
  )
  .subscribe();
```

#### Notification Animation
- Pulse animation untuk notifikasi baru
- Green border untuk highlight
- "BARU" badge dengan animasi
- Auto-remove animation setelah 3 detik

### 4. Cashier Action System

#### Three Action Buttons
1. **Terima** (Accept) - Order diterima dan siap diproses
2. **Tolak** (Reject) - Order ditolak dengan alasan
3. **Kirim ke Dapur** (Send to Kitchen) - Order dikirim langsung ke dapur

#### Action Icons
- ✅ CheckCircle untuk Terima
- ❌ XCircle untuk Tolak
- 👨‍🍳 ChefHat untuk Kirim ke Dapur

## Database Schema

### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number VARCHAR(10),
  customer_name VARCHAR(100),
  customer_phone VARCHAR(20),
  order_type VARCHAR(20),
  payment_method VARCHAR(20),
  total_amount DECIMAL(10,2),
  status VARCHAR(20),
  source VARCHAR(20),
  items JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### QRIS Notifications Table
```sql
CREATE TABLE qris_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  table_number VARCHAR(10),
  customer_phone VARCHAR(20),
  order_type VARCHAR(20),
  items JSONB,
  total_amount DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## UI/UX Features

### 1. Payment Status Display
- **Pending**: QR Code dan tombol simulasi
- **Success**: Green card dengan order ID dan tombol kembali
- **Failed**: Red card dengan pesan error

### 2. Notification Animation
- Pulse effect untuk notifikasi baru
- Color-coded borders (green for new)
- Animated badges
- Smooth transitions

### 3. Action Buttons
- Color-coded buttons (green, red, orange)
- Icons untuk clarity
- Hover effects
- Loading states

## Testing Flow

### 1. Test Payment Success
1. Buka customer app di `localhost:3000/customer`
2. Tambahkan item ke cart
3. Proses ke pembayaran QRIS
4. Klik "Simulasi Pembayaran Berhasil"
5. Verifikasi order muncul di notifikasi kasir

### 2. Test Payment Failure
1. Klik "Simulasi Pembayaran Gagal"
2. Verifikasi pesan error muncul
3. Verifikasi status kembali ke pending

### 3. Test Cashier Actions
1. Buka cashier app di `localhost:3000/cashier`
2. Buka halaman notifikasi
3. Test ketiga tombol aksi
4. Verifikasi notifikasi hilang setelah action

## Error Handling

### 1. Network Errors
- Retry mechanism untuk API calls
- User-friendly error messages
- Fallback states

### 2. Database Errors
- Logging untuk debugging
- Graceful degradation
- Data validation

### 3. Real-time Connection Issues
- Auto-reconnection
- Offline state handling
- Sync when back online

## Performance Optimizations

### 1. Real-time Efficiency
- Filtered subscriptions (only pending notifications)
- Debounced updates
- Optimistic UI updates

### 2. Data Loading
- Lazy loading untuk notifikasi
- Pagination untuk large datasets
- Caching strategies

### 3. UI Performance
- CSS animations instead of JS
- Efficient re-renders
- Memory leak prevention

## Security Considerations

### 1. Data Validation
- Server-side validation for all inputs
- SQL injection prevention
- XSS protection

### 2. Authentication
- Supabase RLS policies
- User session management
- API key protection

### 3. Real-time Security
- Channel authentication
- Message validation
- Rate limiting

## Monitoring & Logging

### 1. Order Tracking
- Order creation logs
- Payment status changes
- Action history

### 2. Real-time Monitoring
- Connection status
- Message delivery
- Error rates

### 3. Performance Metrics
- Response times
- Database query performance
- UI render times

## Future Enhancements

### 1. Advanced Features
- Payment gateway integration
- SMS notifications
- Email confirmations
- Push notifications

### 2. Analytics
- Order analytics
- Payment success rates
- Customer behavior tracking

### 3. Automation
- Auto-accept rules
- Smart routing
- AI-powered recommendations

## Troubleshooting

### 1. Notifications Not Appearing
- Check Supabase real-time settings
- Verify RLS policies
- Check network connectivity
- Review console logs

### 2. Payment Simulation Issues
- Verify API endpoint
- Check request payload
- Review error logs
- Test database connections

### 3. Real-time Connection Problems
- Check Supabase project settings
- Verify channel subscriptions
- Review authentication
- Test with simple payloads

## Keuntungan Sistem Ini

1. **Real-time Experience**: Update instan tanpa refresh
2. **User-friendly**: Interface yang intuitif dan responsif
3. **Scalable**: Mudah menambah fitur baru
4. **Reliable**: Error handling yang robust
5. **Maintainable**: Kode terstruktur dengan baik
6. **Secure**: Implementasi security best practices 