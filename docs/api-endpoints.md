# CoffeePOS API Documentation

## Overview

CoffeePOS menggunakan Supabase sebagai backend dengan struktur database yang terdiri dari 4 tabel utama:
- `categories` - Kategori menu
- `items` - Item menu
- `item_options` - Opsi item (seperti ukuran, rasa)
- `item_option_values` - Nilai opsi dengan harga

## Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Items Table
```sql
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10,2) CHECK (original_price >= 0),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  image_url TEXT,
  is_promo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Item Options Table
```sql
CREATE TABLE item_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('single', 'multiple')),
  required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(item_id, name)
);
```

### Item Option Values Table
```sql
CREATE TABLE item_option_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_option_id UUID NOT NULL REFERENCES item_options(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(item_option_id, name)
);
```

## API Endpoints

### Categories API

#### 1. Get All Categories
```typescript
// GET /categories
const categories = await categoryApi.getAll();
```

**Response:**
```typescript
Category[] = [
  {
    id: string;
    name: string;
    description: string;
    icon: string;
    itemCount: number;
  }
]
```

#### 2. Get Categories with Item Count
```typescript
// GET /categories?include=item_count
const categories = await categoryApi.getWithItemCount();
```

**Response:**
```typescript
Category[] = [
  {
    id: string;
    name: string;
    description: string;
    icon: string;
    itemCount: number; // Calculated from items table
  }
]
```

#### 3. Create Category
```typescript
// POST /categories
const newCategory = await categoryApi.create({
  name: string;
  description?: string;
  icon: string;
});
```

**Request Body:**
```typescript
{
  name: "Coffee";
  description: "Hot and cold coffee beverages";
  icon: "☕";
}
```

**Response:**
```typescript
{
  id: string;
  name: string;
  description: string;
  icon: string;
  itemCount: number;
}
```

#### 4. Update Category
```typescript
// PUT /categories/:id
const updatedCategory = await categoryApi.update(categoryId, {
  name?: string;
  description?: string;
  icon?: string;
});
```

**Request Body:**
```typescript
{
  name: "Updated Coffee";
  description: "Updated description";
  icon: "☕";
}
```

#### 5. Delete Category
```typescript
// DELETE /categories/:id
await categoryApi.delete(categoryId);
```

**Response:** `204 No Content`

### Items API

#### 1. Get All Items
```typescript
// GET /items?include=options
const items = await itemApi.getAll();
```

**Response:**
```typescript
MenuItem[] = [
  {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    image: string;
    isPromo: boolean;
    options?: {
      [key: string]: {
        type: 'single' | 'multiple';
        required: boolean;
        values: Array<{
          name: string;
          price: number;
        }>;
      };
    };
  }
]
```

#### 2. Get Item by ID
```typescript
// GET /items/:id
const item = await itemApi.getById(itemId);
```

**Response:** Same as single item in array above

#### 3. Create Item
```typescript
// POST /items
const newItem = await itemApi.create(itemData, options);
```

**Request Body:**
```typescript
{
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string; // category_id
  image?: string;
  isPromo?: boolean;
}
```

**Options Parameter:**
```typescript
{
  size: {
    type: 'single';
    required: true;
    values: [
      { name: 'Small', price: 0 },
      { name: 'Medium', price: 3000 },
      { name: 'Large', price: 6000 }
    ];
  };
  extras: {
    type: 'multiple';
    required: false;
    values: [
      { name: 'Extra Shot', price: 8000 },
      { name: 'Oat Milk', price: 5000 }
    ];
  };
}
```

#### 4. Update Item
```typescript
// PUT /items/:id
const updatedItem = await itemApi.update(itemId, itemData, options);
```

**Request Body:** Same as create item

#### 5. Delete Item
```typescript
// DELETE /items/:id
await itemApi.delete(itemId);
```

**Response:** `204 No Content`

## Error Handling

All API functions throw errors that can be caught and handled:

```typescript
try {
  const items = await itemApi.getAll();
} catch (error) {
  console.error('Error:', error.message);
  // Handle error appropriately
}
```

### Common Error Types

1. **Network Error**
   - Check internet connection
   - Verify Supabase URL and API key

2. **Authentication Error**
   - Verify API key is correct
   - Check if project is active

3. **Validation Error**
   - Check required fields
   - Verify data types

4. **Database Error**
   - Check if tables exist
   - Verify foreign key relationships

## Data Types

### MenuItem Interface
```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  isPromo: boolean;
  options?: {
    [key: string]: {
      type: 'single' | 'multiple';
      required: boolean;
      values: Array<{
        name: string;
        price: number;
      }>;
    };
  };
}
```

### Category Interface
```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  itemCount: number;
}
```

## Example Usage

### Creating a Complete Menu Item

```typescript
// 1. Create category first
const coffeeCategory = await categoryApi.create({
  name: 'Coffee',
  description: 'Hot and cold coffee beverages',
  icon: '☕'
});

// 2. Create item with options
const latte = await itemApi.create({
  name: 'Latte',
  description: 'Smooth espresso with steamed milk',
  price: 38000,
  category: coffeeCategory.id,
  image: '/placeholder.svg?height=200&width=200',
  isPromo: false,
}, {
  size: {
    type: 'single',
    required: true,
    values: [
      { name: 'Small', price: 0 },
      { name: 'Medium', price: 3000 },
      { name: 'Large', price: 6000 }
    ]
  },
  milk: {
    type: 'single',
    required: false,
    values: [
      { name: 'Regular Milk', price: 0 },
      { name: 'Oat Milk', price: 5000 },
      { name: 'Almond Milk', price: 5000 }
    ]
  },
  extras: {
    type: 'multiple',
    required: false,
    values: [
      { name: 'Extra Shot', price: 8000 },
      { name: 'Whipped Cream', price: 3000 },
      { name: 'Caramel Syrup', price: 2000 }
    ]
  }
});
```

### Creating a Promotional Item

```typescript
const promoItem = await itemApi.create({
  name: 'Special Cappuccino',
  description: 'Limited time offer',
  price: 28000, // Discounted price
  originalPrice: 35000, // Original price
  category: coffeeCategory.id,
  image: '/placeholder.svg?height=200&width=200',
  isPromo: true,
}, {
  size: {
    type: 'single',
    required: true,
    values: [
      { name: 'Regular', price: 0 },
      { name: 'Large', price: 5000 }
    ]
  }
});
```

## Testing

Use the provided testing utilities in `examples/api-requests.ts`:

```typescript
// In browser console
testCoffeePOS.testAllOperations();
testCoffeePOS.createCompleteMenuExample();
testCoffeePOS.createItemExample();
```

## Performance Considerations

1. **Indexes**: Database includes indexes on frequently queried columns
2. **Cascading Deletes**: Deleting a category deletes all related items
3. **Batch Operations**: Consider batching multiple operations
4. **Real-time**: Supabase provides real-time subscriptions for live updates

## Security

1. **Row Level Security**: Implement RLS policies for production
2. **API Key Management**: Use environment variables for API keys
3. **Input Validation**: Validate all user inputs
4. **Error Handling**: Don't expose sensitive information in errors 