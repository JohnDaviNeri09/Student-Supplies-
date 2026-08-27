'use client';

import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');

  const [products] = useState([
    { id: '1', title: 'Ergonomic Mesh Executive Chair', price: 4999, image_url: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=500' },
    { id: '2', title: 'Minimalist Mechanical Keyboard', price: 2499, image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500' },
    { id: '3', title: 'Sustainable Bamboo Desk Organizer', price: 799, image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500' }
  ]);

  const handleCheckout = async (product) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: product.price,
          description: product.title,
          buyerId: 'user@example.com',
          productId: product.id
        })
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert('Checkout error');
      }
    } catch (err) {
      alert('Failed to connect to checkout service.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-6">
      <header className="flex justify-between items-center py-4 border-b">
        <h1 className="text-2xl font-bold text-blue-600">OFFICEPRO</h1>
        <div className="space-x-4">
          <button onClick={() => setActiveTab('home')}>Home</button>
          <button onClick={() => setActiveTab('store')}>Store</button>
        </div>
      </header>

      <main className="my-8">
        {activeTab === 'home' && (
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-extrabold">Welcome to OfficePro</h2>
            <p>Your one-stop supply shop.</p>
          </div>
        )}

        {activeTab === 'store' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="border p-4 rounded-lg bg-white shadow-sm space-y-3">
                <img src={p.image_url} alt={p.title} className="h-40 w-full object-cover rounded" />
                <h3 className="font-bold">{p.title}</h3>
                <p className="text-blue-600 font-bold">₱{p.price}</p>
                <button onClick={() => handleCheckout(p)} className="w-full bg-slate-900 text-white py-2 rounded">
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-slate-500 py-4 border-t">
        © 2026 OfficePro
      </footer>
    </div>
  );
                           }
