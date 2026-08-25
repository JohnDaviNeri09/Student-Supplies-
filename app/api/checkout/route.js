import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { amount, description, buyerId, productId } = await req.json();

    // PayMongo Checkout API Integration
    const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            line_items: [
              {
                currency: 'PHP',
                amount: Math.round(amount * 100), // Amount in cents
                description: description,
                name: description,
                quantity: 1
              }
            ],
            payment_method_types: ['gcash', 'card', 'paymaya'],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/buyer-dashboard?status=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/store?status=cancelled`,
            metadata: {
              buyer_id: buyerId,
              product_id: productId
            }
          }
        }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.errors[0].detail || 'PayMongo API Error');

    return NextResponse.json({ checkoutUrl: data.data.attributes.checkout_url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
