import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { amount, description, buyerId, productId } = req.body;

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
            payment_method_types: ['gcash', 'card', 'paymaya'],
            line_items: [{
              currency: 'PHP',
              amount: Math.round(amount * 100),
              description,
              name: description,
              quantity: 1
            }],
            description: `Order for ${description}`
          }
        }
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(400).json({ error: data.errors });

    const checkoutUrl = data.data.attributes.checkout_url;
    const checkoutSessionId = data.data.id;

    await supabase.from('orders').insert([{
      buyer_id: buyerId,
      product_id: productId,
      amount: amount,
      status: 'pending',
      paymongo_checkout_id: checkoutSessionId
    }]);

    return res.status(200).json({ checkoutUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
