import { supabase } from '../lib/supabase';

async function checkDatabaseSetup() {
  console.log('Checking database setup...\n');

  try {
    // Check if orders table exists and is accessible
    console.log('1. Checking orders table...');
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);

    if (ordersError) {
      console.error('❌ Orders table error:', ordersError.message);
      console.log('   Please run the schema.sql file in your Supabase database');
    } else {
      console.log('✅ Orders table is accessible');
    }

    // Check if qris_notifications table exists and is accessible
    console.log('\n2. Checking qris_notifications table...');
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('qris_notifications')
      .select('id')
      .limit(1);

    if (notificationsError) {
      console.error('❌ QRIS notifications table error:', notificationsError.message);
      console.log('   Please run the schema.sql file in your Supabase database');
    } else {
      console.log('✅ QRIS notifications table is accessible');
    }

    // Check if items table exists and has data
    console.log('\n3. Checking items table...');
    const { data: itemsData, error: itemsError } = await supabase
      .from('items')
      .select('id, name')
      .limit(5);

    if (itemsError) {
      console.error('❌ Items table error:', itemsError.message);
    } else {
      console.log(`✅ Items table is accessible (${itemsData?.length || 0} items found)`);
      if (itemsData && itemsData.length > 0) {
        console.log('   Sample items:', itemsData.map(item => item.name).join(', '));
      } else {
        console.log('   ⚠️  No items found. Run "npm run seed-menu" to add sample data');
      }
    }

    // Check if categories table exists and has data
    console.log('\n4. Checking categories table...');
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name')
      .limit(10);

    if (categoriesError) {
      console.error('❌ Categories table error:', categoriesError.message);
    } else {
      console.log(`✅ Categories table is accessible (${categoriesData?.length || 0} categories found)`);
      if (categoriesData && categoriesData.length > 0) {
        console.log('   Categories:', categoriesData.map(cat => cat.name).join(', '));
      } else {
        console.log('   ⚠️  No categories found. Run "npm run seed-menu" to add sample data');
      }
    }

    // Test inserting a sample order
    console.log('\n5. Testing order creation...');
    const testOrderData = {
      table_number: 'TEST',
      customer_name: 'Test Customer',
      customer_phone: '+62 812-3456-7890',
      order_type: 'dine-in',
      payment_method: 'qris',
      total_amount: 50000,
      status: 'pending',
      source: 'qris',
      items: [
        {
          id: 'test-item-1',
          name: 'Test Item',
          price: 25000,
          quantity: 2,
          totalPrice: 50000
        }
      ],
      notes: 'Test order for database validation'
    };

    const { data: testOrder, error: testOrderError } = await supabase
      .from('orders')
      .insert([testOrderData])
      .select()
      .single();

    if (testOrderError) {
      console.error('❌ Test order creation failed:', testOrderError.message);
    } else {
      console.log('✅ Test order created successfully:', testOrder.id);
      
      // Test notification creation
      console.log('\n6. Testing notification creation...');
      const testNotificationData = {
        order_id: testOrder.id,
        table_number: 'TEST',
        customer_phone: '+62 812-3456-7890',
        order_type: 'dine-in',
        items: testOrderData.items,
        total_amount: 50000,
        status: 'pending'
      };

      const { data: testNotification, error: testNotificationError } = await supabase
        .from('qris_notifications')
        .insert([testNotificationData])
        .select()
        .single();

      if (testNotificationError) {
        console.error('❌ Test notification creation failed:', testNotificationError.message);
      } else {
        console.log('✅ Test notification created successfully:', testNotification.id);
        
        // Clean up test data
        console.log('\n7. Cleaning up test data...');
        await supabase.from('qris_notifications').delete().eq('id', testNotification.id);
        await supabase.from('orders').delete().eq('id', testOrder.id);
        console.log('✅ Test data cleaned up');
      }
    }

    console.log('\n🎉 Database setup check completed!');
    console.log('\nIf you see any ❌ errors above, please:');
    console.log('1. Run the schema.sql file in your Supabase SQL editor');
    console.log('2. Run "npm run seed-menu" to add sample menu data');
    console.log('3. Check your Supabase project settings and API keys');

  } catch (error) {
    console.error('❌ Database check failed:', error);
  }
}

// Run the check
checkDatabaseSetup(); 