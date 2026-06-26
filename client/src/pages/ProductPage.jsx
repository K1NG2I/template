import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Rating from '../components/Rating';

function lowestStock(product) {
  if (!product.sizes) return null;
  const available = Object.entries(product.sizes).filter(([, s]) => s.available);
  if (available.length === 0) return null;
  const min = Math.min(...available.map(([, s]) => s.quantity));
  return min;
}

export default function ProductPage() {
  const { id } = useParams();
  const { config } = useConfig();
  const { user } = useAuth();
  const products = config.products || [];
  const product = products[Number(id)];
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [adding, setAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?product=${id}`)
      .then((r) => r.json())
      .then((d) => {
        setReviews(d.reviews || []);
        setAvgRating(d.average || 0);
        setReviewCount(d.count || 0);
      })
      .catch(() => {});
  }, [id]);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-[var(--muted)]">Product not found</p>
        <Link to="/shop" className="text-[var(--accent)] text-sm mt-2 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const images = product.images || [];
  const suggestions = products.filter((_, i) => i !== Number(id)).slice(0, 4);
  const sizes = product.sizes || {};
  const availableSizes = Object.entries(sizes).filter(([, s]) => s.available);
  const stock = lowestStock(product);

  async function addToCart() {
    if (!user || !selectedSize || stock === null) return;
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_index', Number(id))
      .eq('size', selectedSize);

    if (existing && existing.length > 0) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing[0].quantity + 1 })
        .eq('id', existing[0].id);
    } else {
      await supabase
        .from('cart_items')
        .insert({ user_id: user.id, product_index: Number(id), size: selectedSize, quantity: 1 });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  async function submitReview(e) {
    e.preventDefault();
    setAdding(true);
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ product_index: Number(id), rating, comment }),
    });
    setComment('');
    setRating(5);
    setAdding(false);
    const r = await fetch(`/api/reviews?product=${id}`).then((res) => res.json());
    setReviews(r.reviews || []);
    setAvgRating(r.average || 0);
    setReviewCount(r.count || 0);
  }

  async function deleteReview(reviewId) {
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    await fetch('/api/reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id: reviewId }),
    });
    const r = await fetch(`/api/reviews?product=${id}`).then((res) => res.json());
    setReviews(r.reviews || []);
    setAvgRating(r.average || 0);
    setReviewCount(r.count || 0);
  }

  return (
    <div className="py-8 space-y-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 flex gap-4">
          <div className="flex-1 aspect-square bg-[var(--bg-secondary)] overflow-hidden">
            {images[selectedImage] ? (
              <img src={images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-sm">
                No Image
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex flex-col gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 overflow-hidden border-2 flex-shrink-0 transition-all ${
                    i === selectedImage ? 'border-[var(--accent)]' : 'border-[var(--border)] hover:border-[var(--muted)]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-[clamp(28px,4vw,48px)] font-bold text-[var(--primary)] mb-2">
            {product.title}
          </h1>
          {product.price > 0 && (
            <p className="text-lg font-semibold text-[var(--accent)] mb-2">
              {product.discount > 0 ? (
                <>
                  <span className="line-through text-[var(--muted)] text-sm mr-2">₹{product.price.toFixed(2)}</span>
                  ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                </>
              ) : (
                <>₹{product.price.toFixed(2)}</>
              )}
            </p>
          )}
          <Rating average={avgRating} count={reviewCount} size="md" />
          <p className="text-sm leading-relaxed mt-4 mb-6" style={{ color: 'var(--nav-bg)' }}>
            {product.description || product.synopsis}
          </p>
          {stock === null && (
            <p className="text-xs text-red-400 font-semibold mb-4">Out of Stock</p>
          )}
          {availableSizes.length > 0 && (
            <div className="mb-4">
              <p className="text-xs mb-2" style={{ color: 'var(--nav-bg)' }}>Select Size</p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(([size, s]) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border transition-all ${
                      selectedSize === size
                        ? 'bg-[var(--primary)] text-[var(--bg)] border-[var(--primary)]'
                        : 'bg-transparent text-[var(--primary)] border-[var(--border)] hover:border-[var(--primary)]'
                    }`}
                  >
                    {size}
                    {s.quantity < 5 && (
                      <span className="text-[10px] text-red-400 ml-1">({s.quantity} left)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          {selectedSize && sizes[selectedSize]?.quantity < 5 && (
            <p className="text-xs text-red-400 mb-4">
              Only {sizes[selectedSize].quantity} left in stock!
            </p>
          )}
          {stock !== null && selectedSize ? (
            user ? (
              <button
                onClick={addToCart}
                className={`inline-block self-start px-8 py-3 text-sm font-semibold transition-all ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-[var(--primary)] text-[var(--bg)] hover:opacity-90'
                }`}
              >
                {addedToCart ? 'Added!' : 'Add to Cart'}
              </button>
            ) : (
              <span className="inline-block self-start px-8 py-3 text-sm font-semibold bg-[var(--border)] text-[var(--muted)]">
                Sign in to Buy
              </span>
            )
          ) : (
            <span className={`inline-block self-start px-8 py-3 text-sm font-semibold ${
              stock === null
                ? 'bg-[var(--border)] text-[var(--muted)] cursor-not-allowed'
                : 'bg-[var(--primary)] text-[var(--bg)] cursor-default'
            }`}>
              {stock === null ? 'Out of Stock' : 'Select Size'}
            </span>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-[clamp(20px,2.5vw,28px)] font-bold text-[var(--primary)] mb-6">Reviews</h2>
        {user && (
          <form onSubmit={submitReview} className="mb-6 space-y-3 max-w-md">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--nav-bg)' }}>Rating:</span>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="bg-[var(--card)] border border-[var(--border)] text-[var(--primary)] text-sm px-2 py-1"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} stars</option>
                ))}
              </select>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a review..."
              className="w-full bg-[var(--card)] border border-[var(--border)] text-[var(--primary)] text-sm p-3 resize-none h-20"
            />
            <button
              type="submit"
              disabled={adding}
              className="px-6 py-2 text-sm font-semibold bg-[var(--primary)] text-[var(--bg)] hover:opacity-90 disabled:opacity-50"
            >
              {adding ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
        {reviews.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--nav-bg)' }}>No reviews yet.</p>
        ) : (
          <div className="space-y-4 max-w-lg">
            {reviews.map((r) => (
              <div key={r.id} className="border border-[var(--border)] p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-[var(--primary)]">{r.user_name}</span>
                  {user && r.user_id === user.id && (
                    <button onClick={() => deleteReview(r.id)} className="text-xs hover:text-red-400" style={{ color: 'var(--nav-bg)' }}>Delete</button>
                  )}
                </div>
                <Rating average={r.rating} size="sm" />
                {r.comment && <p className="text-sm mt-1" style={{ color: 'var(--nav-bg)' }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-[clamp(20px,2.5vw,28px)] font-bold text-[var(--primary)] mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {suggestions.map((card, i) => {
            const s = lowestStock(card);
            return (
              <Link
                key={i}
                to={`/product/${products.indexOf(card)}`}
                className="group bg-[var(--card)] overflow-hidden border border-[var(--border)] hover:border-[var(--accent)] transition-all"
              >
                <div className="aspect-[4/3] bg-[var(--bg-secondary)] overflow-hidden">
                  {card.images?.[0] ? (
                    <img src={card.images[0]} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-[var(--primary)] mb-0.5">{card.title}</h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{card.synopsis}</p>
                  {s !== null && s < 5 && (
                    <span className="text-[10px] text-red-400 font-semibold block mt-1">Only {s} stock left!</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
