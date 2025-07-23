-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create items table
CREATE TABLE IF NOT EXISTS items (
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

-- Create item_options table
CREATE TABLE IF NOT EXISTS item_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('single', 'multiple')),
  required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(item_id, name)
);

-- Create item_option_values table
CREATE TABLE IF NOT EXISTS item_option_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_option_id UUID NOT NULL REFERENCES item_options(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(item_option_id, name)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
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

-- Create qris_notifications table
CREATE TABLE IF NOT EXISTS qris_notifications (
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_is_promo ON items(is_promo);
CREATE INDEX IF NOT EXISTS idx_item_options_item_id ON item_options(item_id);
CREATE INDEX IF NOT EXISTS idx_item_option_values_option_id ON item_option_values(item_option_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_source ON orders(source);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_qris_notifications_status ON qris_notifications(status);
CREATE INDEX IF NOT EXISTS idx_qris_notifications_created_at ON qris_notifications(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_item_options_updated_at BEFORE UPDATE ON item_options
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_item_option_values_updated_at BEFORE UPDATE ON item_option_values
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qris_notifications_updated_at BEFORE UPDATE ON qris_notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO categories (id, name, description, icon) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Coffee', 'Hot and cold coffee beverages', '☕'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Food', 'Main dishes and meals', '🍽️'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Snacks', 'Light bites and pastries', '🍪'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Dessert', 'Sweet treats and desserts', '🍰')
ON CONFLICT (name) DO NOTHING;

-- Insert sample items
INSERT INTO items (id, name, description, price, original_price, category_id, image_url, is_promo) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Cappuccino', 'Rich espresso topped with steamed milk foam and a sprinkle of cocoa powder', 35000, NULL, '550e8400-e29b-41d4-a716-446655440001', '/placeholder.svg?height=200&width=200', FALSE),
  ('660e8400-e29b-41d4-a716-446655440002', 'Latte', 'Smooth and creamy latte made with espresso and steamed milk', 38000, NULL, '550e8400-e29b-41d4-a716-446655440001', '/placeholder.svg?height=200&width=200', FALSE),
  ('660e8400-e29b-41d4-a716-446655440003', 'Espresso', 'Pure, intense espresso shot made from premium arabica beans', 17500, 25000, '550e8400-e29b-41d4-a716-446655440001', '/placeholder.svg?height=200&width=200', TRUE),
  ('660e8400-e29b-41d4-a716-446655440004', 'Croissant', 'Buttery, flaky French pastry baked fresh daily', 22000, NULL, '550e8400-e29b-41d4-a716-446655440003', '/placeholder.svg?height=200&width=200', FALSE)
ON CONFLICT DO NOTHING;

-- Insert sample item options for Cappuccino
INSERT INTO item_options (id, item_id, name, type, required) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Size', 'single', TRUE),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Sugar', 'single', TRUE),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Extras', 'multiple', FALSE)
ON CONFLICT DO NOTHING;

-- Insert sample option values for Cappuccino
INSERT INTO item_option_values (item_option_id, name, price) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', 'Small', 0),
  ('770e8400-e29b-41d4-a716-446655440001', 'Regular', 0),
  ('770e8400-e29b-41d4-a716-446655440001', 'Large', 5000),
  ('770e8400-e29b-41d4-a716-446655440002', 'No Sugar', 0),
  ('770e8400-e29b-41d4-a716-446655440002', 'Less Sugar', 0),
  ('770e8400-e29b-41d4-a716-446655440002', 'Normal Sugar', 0),
  ('770e8400-e29b-41d4-a716-446655440002', 'Extra Sugar', 0),
  ('770e8400-e29b-41d4-a716-446655440003', 'Extra Shot', 8000),
  ('770e8400-e29b-41d4-a716-446655440003', 'Decaf', 0),
  ('770e8400-e29b-41d4-a716-446655440003', 'Oat Milk', 5000),
  ('770e8400-e29b-41d4-a716-446655440003', 'Almond Milk', 5000)
ON CONFLICT DO NOTHING;

-- Insert sample item options for Latte
INSERT INTO item_options (id, item_id, name, type, required) VALUES
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Size', 'single', TRUE),
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Flavor', 'single', FALSE)
ON CONFLICT DO NOTHING;

-- Insert sample option values for Latte
INSERT INTO item_option_values (item_option_id, name, price) VALUES
  ('770e8400-e29b-41d4-a716-446655440004', 'Small', 0),
  ('770e8400-e29b-41d4-a716-446655440004', 'Regular', 0),
  ('770e8400-e29b-41d4-a716-446655440004', 'Large', 5000),
  ('770e8400-e29b-41d4-a716-446655440005', 'Original', 0),
  ('770e8400-e29b-41d4-a716-446655440005', 'Vanilla', 3000),
  ('770e8400-e29b-41d4-a716-446655440005', 'Caramel', 3000),
  ('770e8400-e29b-41d4-a716-446655440005', 'Hazelnut', 3000)
ON CONFLICT DO NOTHING; 