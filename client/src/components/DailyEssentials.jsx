import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

function lowestStock(product) {
  if (!product.sizes) return null;
  const available = Object.entries(product.sizes).filter(([, s]) => s.available);
  if (available.length === 0) return null;
  const min = Math.min(...available.map(([, s]) => s.quantity));
  return min;
}

export default function DailyEssentials() {
  const { config } = useConfig();
  const cards = (config.products || []).filter((p) => p.dailyEssential);
  const pageSize = 4;
  const totalPages = Math.ceil(cards.length / pageSize);
  const [page, setPage] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (totalPages <= 1) return;
    timerRef.current = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, 10000);
    return () => clearInterval(timerRef.current);
  }, [totalPages]);

  function prev() {
    setPage((p) => (p === 0 ? totalPages - 1 : p - 1));
    clearInterval(timerRef.current);
  }

  function next() {
    setPage((p) => (p + 1) % totalPages);
    clearInterval(timerRef.current);
  }

  if (cards.length === 0) return null;

  const visible = cards.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <section className="py-12">
      <h2 className="text-[clamp(24px,3.2vw,34px)] font-bold text-center mb-8 text-[var(--primary)]">
        Daily Essentials
      </h2>
      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {visible.map((card, i) => {
            const stock = lowestStock(card);
            return (
              <Link
                key={`${page}-${i}`}
                to="/shop"
                className="group bg-[var(--card)] overflow-hidden border border-[var(--border)] hover:border-[var(--accent)] transition-all"
              >
                <div className="aspect-[3/4] bg-[var(--bg-secondary)] overflow-hidden">
                  {card.images?.[0] ? (
                    <img src={card.images[0]} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs">No Image</div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-[var(--primary)] mb-0.5">{card.title}</h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{card.synopsis}</p>
                  {stock !== null && stock < 5 && (
                    <span className="text-[10px] text-red-400 font-semibold block mt-1">Only {stock} stock left!</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className="w-8 h-8 flex items-center justify-center bg-[var(--primary)] text-[var(--bg)] text-sm hover:opacity-80 transition-opacity">{'<'}</button>
            <span className="text-xs text-[var(--muted)]">{page + 1} / {totalPages}</span>
            <button onClick={next} className="w-8 h-8 flex items-center justify-center bg-[var(--primary)] text-[var(--bg)] text-sm hover:opacity-80 transition-opacity">{'>'}</button>
          </div>
        )}
      </div>
    </section>
  );
}
