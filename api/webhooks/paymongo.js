import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body;
    if (body.data.attributes.type === 'checkout_session.payment.paid') {
      const checkoutSessionId = body.data.attributes.data.id;
      await supabase.from('orders').update({ status: 'paid' }).eq('paymongo_checkout_id', checkoutSessionId);
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
