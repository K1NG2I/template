import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import ProductRating from '../components/ProductRating';

function lowestStock(product) {
  if (!product.sizes) return null;
  const available = Object.entries(product.sizes).filter(([, s]) => s.available);
  if (available.length === 0) return null;
  const min = Math.min(...available.map(([, s]) => s.quantity));
  return min;
}

export default function Shop() {
  const { config } = useConfig();
  const [searchParams] = useSearchParams();
  const collection = searchParams.get('collection');

  useEffect(() => {
    document.title = 'Shop - Dachima';
  }, []);

  let cards = config.products || [];

  if (collection) {
    cards = cards.filter((p) => p.collection?.trim() === collection);
  }

  return (
    <div className="py-8">
      <h1 className="text-[clamp(24px,3.2vw,34px)] font-bold text-center text-[var(--primary)] mb-2">
        {collection ? `Collection: ${collection}` : 'Shop'}
      </h1>
      {cards.length === 0 ? (
        <p className="text-sm text-[var(--muted)] text-center mt-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const stock = lowestStock(card);
            return (
              <Link key={i} to={`/product/${config.products.indexOf(card)}`} className="block bg-[var(--card)] overflow-hidden border border-[var(--border)] hover:border-[var(--accent)] transition-all group">
                <div className="aspect-[4/3] bg-[var(--bg-secondary)] overflow-hidden">
                  {card.images?.[0] ? (
                    <img src={card.images[0]} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-sm font-bold text-[var(--primary)] mb-1.5">{card.title}</h2>
                  {card.price > 0 && (
                    <p className="text-xs font-semibold text-[var(--accent)] mb-1">₹{card.price.toFixed(2)}</p>
                  )}
                  <ProductRating productIndex={config.products.indexOf(card)} />
                  <p className="text-xs text-[var(--muted)] mb-3 leading-relaxed">{card.synopsis}</p>
                  {stock !== null && stock < 5 && (
                    <span className="text-xs text-red-400 font-semibold block mb-2">Only {stock} stock left!</span>
                  )}
                  <span className="inline-block bg-[var(--primary)] text-[var(--bg)] px-4 py-1.5 text-xs font-semibold">
                    View Details
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
