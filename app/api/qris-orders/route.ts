import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received QRIS order request:', JSON.stringify(body, null, 2));
    
    const { tableNumber, customerPhone, orderType, items, totalAmount, notes } = body;

    // Validate required fields
    if (!customerPhone || !orderType || !items || !Array.isArray(items) || items.length === 0) {
      console.error('Validation failed:', { customerPhone, orderType, items });
      return NextResponse.json(
        { error: 'Missing required fields: customerPhone, orderType, items' },
        { status: 400 }
      );
    }

    // Prepare order data
    const orderData = {
      table_number: tableNumber,
      customer_name: `Table ${tableNumber}`,
      customer_phone: customerPhone,
      order_type: orderType,
      payment_method: 'qris',
      total_amount: totalAmount,
      status: 'pending',
      source: 'qris',
      items: items,
      notes: notes || null,
      created_at: new Date().toISOString()
    };

    console.log('Creating order with data:', JSON.stringify(orderData, null, 2));

    // Create order in Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: `Failed to create order: ${orderError.message}` },
        { status: 500 }
      );
    }

    console.log('Order created successfully:', order.id);

    // Prepare notification data
    const notificationData = {
      order_id: order.id,
      table_number: tableNumber,
      customer_phone: customerPhone,
      order_type: orderType,
      items: items,
      total_amount: totalAmount,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    console.log('Creating notification with data:', JSON.stringify(notificationData, null, 2));

    // Create QRIS notification
    const { data: notification, error: notificationError } = await supabase
      .from('qris_notifications')
      .insert([notificationData])
      .select()
      .single();

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      return NextResponse.json(
        { error: `Failed to create notification: ${notificationError.message}` },
        { status: 500 }
      );
    }

    console.log('Notification created successfully:', notification.id);

    console.log(`New QRIS order created: ${order.id}, notification: ${notification.id}`);

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        notificationId: notification.id,
        message: 'Order created successfully and notification sent to cashier'
      }
    });

  } catch (error) {
    console.error('Error processing QRIS order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get pending QRIS notifications
    const { data: notifications, error } = await supabase
      .from('qris_notifications')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    console.error('Error fetching QRIS notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 