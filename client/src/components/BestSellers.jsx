import { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';

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
          <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto bg-[var(--bg-secondary)] overflow-hidden">
            {images[0] ? (
              <img src={images[0]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs">No Image</div>
            )}
          </div>
          <div className="w-full md:w-1/2 flex items-center">
            <div className="px-[10%] py-8 w-full">
              <div className="relative h-40 mb-4 group">
                {images[1] ? (
                  <div className="absolute bottom-0 left-[10%] w-[50%] h-[85%] z-20 overflow-hidden border border-[var(--border)] transition-all group-hover:scale-105">
                    <img src={images[1]} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : images[0] && (
                  <div className="absolute bottom-0 left-[10%] w-[50%] h-[85%] z-20 overflow-hidden border border-[var(--border)]">
                    <img src={images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                {images[2] && (
                  <div className="absolute bottom-0 right-[10%] w-[45%] h-[70%] z-10 overflow-hidden border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity">
                    <img src={images[2]} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-[var(--primary)] mb-1">{product.title}</h3>
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
