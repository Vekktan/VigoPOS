# CoffeePOS - Point of Sale System

A modern POS system built with React, Next.js, and Supabase for coffee shops and cafes.

## Features

- **Menu Management**: Add, edit, and delete menu items with custom options
- **Category Management**: Organize items into categories with icons
- **Item Options**: Configure size, flavor, and add-on options with pricing
- **Promotional Items**: Mark items as promotional with discount pricing
- **Real-time Updates**: Live updates using Supabase real-time features

## Database Structure

### Tables

1. **categories**
   - `id` (UUID, Primary Key)
   - `name` (VARCHAR, Unique)
   - `description` (TEXT)
   - `icon` (VARCHAR)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

2. **items**
   - `id` (UUID, Primary Key)
   - `name` (VARCHAR)
   - `description` (TEXT)
   - `price` (DECIMAL)
   - `original_price` (DECIMAL, for promotional items)
   - `category_id` (UUID, Foreign Key to categories)
   - `image_url` (TEXT)
   - `is_promo` (BOOLEAN)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

3. **item_options**
   - `id` (UUID, Primary Key)
   - `item_id` (UUID, Foreign Key to items)
   - `name` (VARCHAR)
   - `type` (VARCHAR, 'single' or 'multiple')
   - `required` (BOOLEAN)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

4. **item_option_values**
   - `id` (UUID, Primary Key)
   - `item_option_id` (UUID, Foreign Key to item_options)
   - `name` (VARCHAR)
   - `price` (DECIMAL)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to your project dashboard
3. Navigate to SQL Editor
4. Run the SQL schema from `database/schema.sql`
5. Copy your project URL and anon key from Settings > API

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 4. Run the Application

```bash
npm run dev
```

## API Functions

### Items API

- `itemApi.getAll()` - Fetch all items with options
- `itemApi.create(item, options)` - Create new item with options
- `itemApi.update(id, updates, options)` - Update item and options
- `itemApi.delete(id)` - Delete item
- `itemApi.getById(id)` - Get item by ID

### Categories API

- `categoryApi.getAll()` - Fetch all categories
- `categoryApi.create(category)` - Create new category
- `categoryApi.update(id, updates)` - Update category
- `categoryApi.delete(id)` - Delete category
- `categoryApi.getWithItemCount()` - Fetch categories with item count

## Custom Hooks

### useItems()
Manages item state and API calls:
```typescript
const { items, loading, error, createItem, updateItem, deleteItem } = useItems();
```

### useCategories()
Manages category state and API calls:
```typescript
const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories();
```

## Item Options Structure

Items can have multiple options (e.g., Size, Sugar Level, Extras):

```typescript
options: {
  size: {
    type: 'single',
    required: true,
    values: [
      { name: 'Small', price: 0 },
      { name: 'Regular', price: 0 },
      { name: 'Large', price: 5000 }
    ]
  },
  sugar: {
    type: 'single',
    required: true,
    values: [
      { name: 'No Sugar', price: 0 },
      { name: 'Less Sugar', price: 0 },
      { name: 'Normal Sugar', price: 0 },
      { name: 'Extra Sugar', price: 0 }
    ]
  },
  extras: {
    type: 'multiple',
    required: false,
    values: [
      { name: 'Extra Shot', price: 8000 },
      { name: 'Oat Milk', price: 5000 },
      { name: 'Almond Milk', price: 5000 }
    ]
  }
}
```

## Features

### Menu Management
- Add new menu items with detailed information
- Configure item options with pricing
- Set promotional pricing with original price
- Organize items by categories
- Upload item images

### Category Management
- Create and manage item categories
- Assign icons to categories
- View item count per category
- Edit and delete categories

### Item Options
- Single choice options (e.g., Size, Sugar Level)
- Multiple choice options (e.g., Extras, Toppings)
- Required vs optional options
- Custom pricing for each option value

### Promotional Items
- Mark items as promotional
- Set discount percentage
- Display original and discounted prices
- Filter promotional items

## Technologies Used

- **Frontend**: React, Next.js, TypeScript
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Real-time, Auth)
- **State Management**: React Hooks
- **API**: Supabase JavaScript Client

## Project Structure

```
├── app/
│   └── cashier/
│       └── page.tsx              # Main cashier page
├── components/
│   └── cashier/
│       └── ItemsPage.tsx         # Menu management component
├── hooks/
│   ├── useItems.ts               # Items state management
│   └── useCategories.ts          # Categories state management
├── services/
│   └── api.ts                    # Supabase API functions
├── lib/
│   └── supabase.ts               # Supabase client configuration
└── database/
    └── schema.sql                # Database schema
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
