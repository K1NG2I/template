import { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import ProductRating from './ProductRating';
import Rating from './Rating';

export default function BestSellers() {
  const { config } = useConfig();
  const cards = (config.products || []).filter((p) => p.bestSeller).slice(0, 3);
  const [page, setPage] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (cards.length <= 1) return;
    timerRef.current = setInterval(() => {
      setPage((p) => (p + 1) % cards.length);
    }, 10000);
    return () => clearInterval(timerRef.current);
  }, [cards.length]);

  function prev() {
    setPage((p) => (p === 0 ? cards.length - 1 : p - 1));
    clearInterval(timerRef.current);
  }

  function next() {
    setPage((p) => (p + 1) % cards.length);
    clearInterval(timerRef.current);
  }

  if (cards.length === 0) return null;

  const product = cards[page];
  const images = product.images || [];

  return (
    <section className="py-12">
      <h2 className="text-[clamp(24px,3.2vw,34px)] font-bold text-center mb-8 text-[var(--primary)]">
        Best Sellers
      </h2>
      <div className="border border-[var(--border)] overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-[var(--bg-secondary)] overflow-hidden">
            {images[0] ? (
              <img src={images[0]} alt={product.title} className="w-full h-auto" />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-[var(--muted)] text-xs">No Image</div>
            )}
          </div>
          <div className="w-full md:w-1/2 flex items-center">
            <div className="px-[10%] py-8 w-full">
              <div className="flex gap-4 mb-4 group">
                {images[1] ? (
                  <div className="w-1/2 overflow-hidden border border-[var(--border)] transition-all group-hover:scale-105">
                    <img src={images[1]} alt="" className="w-full h-auto" />
                  </div>
                ) : images[0] && (
                  <div className="w-1/2 overflow-hidden border border-[var(--border)]">
                    <img src={images[0]} alt="" className="w-full h-auto" />
                  </div>
                )}
                {images[2] && (
                  <div className="w-2/5 overflow-hidden border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <img src={images[2]} alt="" className="w-full h-auto" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-[var(--primary)] mb-1">{product.title}</h3>
              {product.price > 0 && (
                <p className="text-sm font-semibold text-[var(--accent)] mb-1">
                  {product.discount > 0 ? (
                    <>
                      <span className="line-through text-[var(--muted)] mr-1">₹{product.price.toFixed(2)}</span>
                      ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </>
                  ) : (
                    <>₹{product.price.toFixed(2)}</>
                  )}
                </p>
              )}
              <ProductRating productIndex={config.products.indexOf(product)} />
              <p className="text-sm text-[var(--muted)] leading-relaxed">{product.synopsis}</p>
            </div>
          </div>
        </div>
      </div>
      {cards.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={prev} className="w-8 h-8 flex items-center justify-center bg-[var(--primary)] text-[var(--bg)] text-sm hover:opacity-80 transition-opacity">{'<'}</button>
          <span className="text-xs text-[var(--muted)]">{page + 1} / {cards.length}</span>
          <button onClick={next} className="w-8 h-8 flex items-center justify-center bg-[var(--primary)] text-[var(--bg)] text-sm hover:opacity-80 transition-opacity">{'>'}</button>
        </div>
      )}
    </section>
  );
}
