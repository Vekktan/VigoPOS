# Supabase Setup Guide for CoffeePOS

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: CoffeePOS
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
6. Click "Create new project"
7. Wait for the project to be created (usually takes 2-3 minutes)

## 2. Get Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon public key**: `your-anon-key`

## 3. Set Up Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Replace `your-project-id` and `your-anon-key` with your actual values.

## 4. Create Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire content from `database/schema.sql`
4. Click "Run" to execute the SQL

This will create:
- `categories` table
- `items` table
- `item_options` table
- `item_option_values` table
- Sample data for testing

## 5. Install Dependencies

Run the following command in your project directory:

```bash
npm install @supabase/supabase-js
```

## 6. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Items page in your application
3. You should see the sample data loaded from Supabase
4. Try creating, editing, and deleting items and categories

## 7. Database Structure Overview

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

## 8. API Functions

The application includes comprehensive API functions for managing items and categories:

### Items API
- `itemApi.getAll()` - Fetch all items with their options
- `itemApi.create(item, options)` - Create new item with options
- `itemApi.update(id, updates, options)` - Update item and options
- `itemApi.delete(id)` - Delete item
- `itemApi.getById(id)` - Get specific item by ID

### Categories API
- `categoryApi.getAll()` - Fetch all categories
- `categoryApi.create(category)` - Create new category
- `categoryApi.update(id, updates)` - Update category
- `categoryApi.delete(id)` - Delete category
- `categoryApi.getWithItemCount()` - Fetch categories with item count

## 9. Custom Hooks

The application uses custom hooks for state management:

### useItems()
```typescript
const { 
  items, 
  loading, 
  error, 
  createItem, 
  updateItem, 
  deleteItem 
} = useItems();
```

### useCategories()
```typescript
const { 
  categories, 
  loading, 
  error, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = useCategories();
```

## 10. Troubleshooting

### Common Issues

1. **"Cannot find module '@supabase/supabase-js'"**
   - Run `npm install @supabase/supabase-js`
   - Restart your development server

2. **"Invalid API key"**
   - Check your environment variables in `.env.local`
   - Ensure you're using the correct anon key from Supabase dashboard

3. **"Table does not exist"**
   - Run the SQL schema from `database/schema.sql` in Supabase SQL Editor
   - Check that all tables were created successfully

4. **"Network error"**
   - Check your internet connection
   - Verify your Supabase project URL is correct
   - Ensure your project is not paused in Supabase dashboard

### Environment Variables

Make sure your `.env.local` file contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Permissions

By default, the anon key has read/write access to all tables. For production, you should:

1. Go to **Authentication** > **Policies** in Supabase dashboard
2. Create Row Level Security (RLS) policies
3. Restrict access based on user roles

## 11. Next Steps

After setting up Supabase:

1. **Test all CRUD operations** for items and categories
2. **Add authentication** if needed
3. **Set up real-time subscriptions** for live updates
4. **Configure Row Level Security** for production
5. **Set up backups** and monitoring

## 12. Production Considerations

1. **Environment Variables**: Use different keys for development and production
2. **Database Backups**: Enable automatic backups in Supabase
3. **Monitoring**: Set up alerts for database performance
4. **Security**: Implement proper authentication and authorization
5. **Performance**: Add database indexes for frequently queried columns

## Support

If you encounter issues:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review the application logs in browser console
3. Check Supabase dashboard for any errors
4. Verify your environment variables are correct 