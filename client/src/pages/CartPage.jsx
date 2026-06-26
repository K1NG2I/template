import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { supabase } from '../lib/supabase';

export default function CartPage() {
  const { user } = useAuth();
  const { config } = useConfig();
  const products = config.products || [];
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at')
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, [user]);

  async function updateQty(item, delta) {
    const newQty = item.quantity + delta;
    if (newQty < 1) { remove(item.id); return; }
    await supabase.from('cart_items').update({ quantity: newQty }).eq('id', item.id);
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, quantity: newQty } : i));
  }

  async function remove(id) {
    await supabase.from('cart_items').delete().eq('id', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (!user) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[var(--muted)] mb-4">Sign in to view your cart</p>
      </div>
    );
  }

  if (loading) {
    return <div className="py-20 text-center text-sm text-[var(--muted)]">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-[var(--muted)] mb-4">Your cart is empty</p>
        <Link to="/shop" className="text-sm text-[var(--accent)]">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-[clamp(24px,3.2vw,34px)] font-bold text-[var(--primary)] mb-6">Cart</h1>
      <div className="space-y-3">
        {items.map((item) => {
          const product = products[item.product_index];
          return (
            <div key={item.id} className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] p-4">
              <div className="w-16 h-16 bg-[var(--bg-secondary)] overflow-hidden flex-shrink-0">
                {product?.images?.[0] ? (
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs">No</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--primary)] truncate">{product?.title || 'Unknown'}</p>
                <p className="text-xs text-[var(--muted)]">Size: {item.size}</p>
                {product?.price ? (
                  <p className="text-xs text-[var(--primary)]">
                    ₹{product.discount > 0
                      ? ((product.price * (1 - product.discount / 100)) * item.quantity).toFixed(2)
                      : (product.price * item.quantity).toFixed(2)}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item, -1)} className="w-7 h-7 flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--primary)] text-sm">-</button>
                <span className="text-sm text-[var(--primary)] w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQty(item, 1)} className="w-7 h-7 flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--primary)] text-sm">+</button>
              </div>
              <button onClick={() => remove(item.id)} className="text-xs text-[var(--muted)] hover:text-red-400">x</button>
            </div>
          );
        })}
      </div>
      <div className="text-right mt-6">
        <p className="text-sm font-bold text-[var(--primary)]">
          Total: ₹{items.reduce((s, i) => {
            const p = products[i.product_index];
            const unitPrice = p?.discount > 0 ? (p.price * (1 - p.discount / 100)) : (p?.price || 0);
            return s + unitPrice * i.quantity;
          }, 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
