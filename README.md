# Smart PoS System - Multi-App Architecture

Modern Point of Sale system built with React, TypeScript, and Next.js using a monorepo architecture with development API server.

## 🏗️ Architecture Overview

\`\`\`
smart-pos-system/
├── apps/
│   ├── api-server/       # Development API server with mock data
│   ├── customer-app/     # PWA for customers (mobile-first)
│   ├── cashier-app/      # Desktop app for cashiers
│   └── kitchen-app/      # Touch-friendly app for kitchen
├── packages/
│   └── socket-client/    # WebSocket client library
├── shared/
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Shared React hooks
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   └── services/        # API client base
└── package.json         # Workspace configuration
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
\`\`\`bash
# Install dependencies for all apps
npm run install:all
\`\`\`

### Development
\`\`\`bash
# Run all apps simultaneously (recommended)
npm run dev:all

# Or run individual apps
npm run dev:api      # API Server - Port 3000
npm run dev:customer # Customer App - Port 3001
npm run dev:cashier  # Cashier App - Port 3002  
npm run dev:kitchen  # Kitchen App - Port 3003
\`\`\`

## 🌐 API Server (Development)

The development API server provides:

### **Endpoints:**
- \`GET /api/menu\` - Get menu items
- \`POST /api/orders\` - Create new order
- \`GET /api/orders\` - Get all orders
- \`PUT /api/orders/:id/status\` - Update order status
- \`GET /api/orders/kitchen/queue\` - Get kitchen orders
- \`POST /api/payments/process\` - Process payment
- \`GET /api/tables\` - Get table information

### **Real-time Features:**
- WebSocket connection on port 3000
- Real-time order updates
- Kitchen order notifications
- Payment status updates

### **Mock Data:**
- 10+ realistic menu items
- 20 tables with QR codes
- Sample orders with different statuses
- Simulated payment processing

## 📱 Applications

### Customer App (PWA) - Port 3001
- **Features**: Menu browsing, cart management, order placement
- **API Integration**: Menu fetching, order creation
- **Real-time**: Order status updates via WebSocket

### Cashier App (Desktop) - Port 3002
- **Features**: Order management, payment processing, analytics
- **API Integration**: Order CRUD, payment processing, dashboard analytics
- **Real-time**: Live order updates, kitchen communication

### Kitchen App (Touch-friendly) - Port 3003
- **Features**: Order queue, cooking timers, status management
- **API Integration**: Kitchen order queue, status updates
- **Real-time**: New order notifications, status synchronization

## 🔄 Data Flow with API

1. **Customer** → \`POST /api/orders\` → Creates order
2. **Cashier** → \`PUT /api/orders/:id/status\` → Confirms & sends to kitchen
3. **Kitchen** → \`PUT /api/orders/:id/status\` → Updates cooking status
4. **WebSocket** → Broadcasts updates to all connected clients

## 🛠️ API Features

### **Order Management:**
\`\`\`javascript
// Create order
POST /api/orders
{
  "items": [{"id": "item1", "quantity": 2}],
  "tableNumber": 5,
  "customerName": "John Doe",
  "notes": "Extra spicy"
}

// Update status
PUT /api/orders/ORD-123/status
{
  "status": "preparing"
}
\`\`\`

### **Real-time Events:**
\`\`\`javascript
// Socket events
socket.on('order:created', (order) => { ... })
socket.on('order:status-changed', (data) => { ... })
socket.on('kitchen:new-order', (order) => { ... })
socket.on('payment:completed', (payment) => { ... })
\`\`\`

### **Analytics:**
\`\`\`javascript
GET /api/orders/analytics/dashboard
// Returns: sales, order counts, popular items, etc.
\`\`\`

## 🔧 Configuration

### Environment Variables
\`\`\`bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# Development
NODE_ENV=development
PORT=3000
\`\`\`

## 📊 Mock Data Structure

### **Menu Items:**
- Fast Track: Es Teh, Es Jeruk, Kerupuk
- Main Course: Nasi Goreng, Ayam Bakar, Mie Ayam
- Desserts: Es Krim, Pudding, Es Campur

### **Sample Orders:**
- Different statuses (pending, confirmed, preparing, ready)
- Various payment methods (cash, QRIS, card)
- Realistic timestamps and amounts

### **Tables:**
- 20 tables with different capacities
- QR codes for customer scanning
- Dynamic availability status

## 🚀 Production Deployment

### Build all apps
\`\`\`bash
npm run build:all
\`\`\`

### Replace API Server
For production, replace the mock API server with:
- Real database (PostgreSQL, MongoDB)
- Authentication system
- Payment gateway integration
- Production WebSocket server

## 🔒 Security Features

- CORS configuration for all origins
- Request validation
- Error handling middleware
- Helmet.js security headers

## 📈 Performance Features

- In-memory data storage for fast responses
- WebSocket connection pooling
- Optimistic UI updates
- Efficient data structures

## 🧪 Testing the API

### Health Check
\`\`\`bash
curl http://localhost:3000/api/health
\`\`\`

### Create Order
\`\`\`bash
curl -X POST http://localhost:3000/api/orders \\
  -H "Content-Type: application/json" \\
  -d '{"items":[{"id":"item1","quantity":1}],"tableNumber":5}'
\`\`\`

### Get Menu
\`\`\`bash
curl http://localhost:3000/api/menu
\`\`\`

This development API provides a complete backend simulation for testing and development of the Smart PoS system! 🎉
