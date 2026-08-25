import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const eventType = body.data.attributes.type;

    if (eventType === 'checkout_session.payment.paid') {
      const attributes = body.data.attributes.data.attributes;
      const metadata = attributes.metadata;
      const amount = attributes.line_items[0].amount / 100;

      // Insert confirmed order to database
      await supabase.from('orders').insert([
        {
          buyer_id: metadata.buyer_id,
          product_id: metadata.product_id,
          amount: amount,
          status: 'paid',
          paymongo_checkout_id: body.data.attributes.data.id
        }
      ]);
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
