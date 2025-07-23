import { supabase } from '../lib/supabase';

async function seedQRISNotifications() {
  console.log('Seeding QRIS notifications...');

  const sampleNotifications = [
    {
      table_number: '5',
      customer_phone: '+62 817-449-496',
      order_type: 'dine-in' as const,
      items: [
        {
          id: '1',
          name: 'Cappuccino',
          description: 'Rich espresso topped with steamed milk foam',
          price: 35000,
          category: 'coffee',
          image: '/placeholder.svg?height=200&width=200',
          isPromo: false,
          quantity: 2,
          totalPrice: 70000,
        }
      ],
      total_amount: 70000,
      status: 'pending' as const,
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    },
    {
      table_number: '12',
      customer_phone: '+62 877-8277-0107',
      order_type: 'takeaway' as const,
      items: [
        {
          id: '2',
          name: 'Latte',
          description: 'Smooth espresso with steamed milk',
          price: 38000,
          category: 'coffee',
          image: '/placeholder.svg?height=200&width=200',
          isPromo: false,
          quantity: 1,
          totalPrice: 38000,
        }
      ],
      total_amount: 38000,
      status: 'pending' as const,
      created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    },
    {
      table_number: '8',
      customer_phone: '+62 812-3456-7890',
      order_type: 'dine-in' as const,
      items: [
        {
          id: '3',
          name: 'Espresso',
          description: 'Pure, intense espresso shot',
          price: 17500,
          category: 'coffee',
          image: '/placeholder.svg?height=200&width=200',
          isPromo: true,
          quantity: 1,
          totalPrice: 17500,
        },
        {
          id: '4',
          name: 'Croissant',
          description: 'Buttery, flaky French pastry',
          price: 22000,
          category: 'snacks',
          image: '/placeholder.svg?height=200&width=200',
          isPromo: false,
          quantity: 1,
          totalPrice: 22000,
        }
      ],
      total_amount: 39500,
      status: 'pending' as const,
      created_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
    }
  ];

  try {
    // First, create orders
    for (const notificationData of sampleNotifications) {
      // Create order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          table_number: notificationData.table_number,
          customer_name: `Table ${notificationData.table_number}`,
          customer_phone: notificationData.customer_phone,
          order_type: notificationData.order_type,
          payment_method: 'qris',
          total_amount: notificationData.total_amount,
          status: 'pending',
          source: 'qris',
          items: notificationData.items,
          created_at: notificationData.created_at
        }])
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        continue;
      }

      // Then create notification
      const { error: notificationError } = await supabase
        .from('qris_notifications')
        .insert([{
          order_id: order.id,
          table_number: notificationData.table_number,
          customer_phone: notificationData.customer_phone,
          order_type: notificationData.order_type,
          items: notificationData.items,
          total_amount: notificationData.total_amount,
          status: notificationData.status,
          created_at: notificationData.created_at
        }]);

      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      } else {
        console.log(`Created notification for table ${notificationData.table_number}`);
      }
    }

    console.log('QRIS notifications seeded successfully!');
  } catch (error) {
    console.error('Error seeding QRIS notifications:', error);
  }
}

// Run the seeding function
seedQRISNotifications(); 