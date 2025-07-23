import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      items: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          original_price: number | null;
          category_id: string;
          image_url: string | null;
          is_promo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          original_price?: number | null;
          category_id: string;
          image_url?: string | null;
          is_promo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          original_price?: number | null;
          category_id?: string;
          image_url?: string | null;
          is_promo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      item_options: {
        Row: {
          id: string;
          item_id: string;
          name: string;
          type: 'single' | 'multiple';
          required: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          name: string;
          type: 'single' | 'multiple';
          required: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          name?: string;
          type?: 'single' | 'multiple';
          required?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      item_option_values: {
        Row: {
          id: string;
          item_option_id: string;
          name: string;
          price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          item_option_id: string;
          name: string;
          price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          item_option_id?: string;
          name?: string;
          price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          table_number: string | null;
          customer_name: string | null;
          customer_phone: string;
          order_type: 'dine-in' | 'takeaway';
          payment_method: 'qris' | 'debit' | 'cash';
          total_amount: number;
          status: 'pending' | 'accepted' | 'rejected' | 'sent-to-kitchen' | 'preparing' | 'ready' | 'delivered';
          source: 'cashier' | 'qris';
          items: any;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          table_number?: string | null;
          customer_name?: string | null;
          customer_phone: string;
          order_type: 'dine-in' | 'takeaway';
          payment_method: 'qris' | 'debit' | 'cash';
          total_amount: number;
          status?: 'pending' | 'accepted' | 'rejected' | 'sent-to-kitchen' | 'preparing' | 'ready' | 'delivered';
          source?: 'cashier' | 'qris';
          items: any;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          table_number?: string | null;
          customer_name?: string | null;
          customer_phone?: string;
          order_type?: 'dine-in' | 'takeaway';
          payment_method?: 'qris' | 'debit' | 'cash';
          total_amount?: number;
          status?: 'pending' | 'accepted' | 'rejected' | 'sent-to-kitchen' | 'preparing' | 'ready' | 'delivered';
          source?: 'cashier' | 'qris';
          items?: any;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      qris_notifications: {
        Row: {
          id: string;
          order_id: string;
          table_number: string;
          customer_phone: string;
          order_type: 'dine-in' | 'takeaway';
          items: any;
          total_amount: number;
          status: 'pending' | 'accepted' | 'rejected' | 'sent-to-kitchen';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          table_number: string;
          customer_phone: string;
          order_type: 'dine-in' | 'takeaway';
          items: any;
          total_amount: number;
          status?: 'pending' | 'accepted' | 'rejected' | 'sent-to-kitchen';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          table_number?: string;
          customer_phone?: string;
          order_type?: 'dine-in' | 'takeaway';
          items?: any;
          total_amount?: number;
          status?: 'pending' | 'accepted' | 'rejected' | 'sent-to-kitchen';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 