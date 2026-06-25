import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

export default function Shop() {
  const { config } = useConfig();
  const cards = config.products || [];

  return (
    <div className="py-8">
      <h1 className="text-[clamp(24px,3.2vw,34px)] font-bold text-center text-[var(--primary)] mb-2">Shop</h1>
      <p className="text-sm text-[var(--muted)] text-center mb-10">Browse our full collection</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <Link key={i} to={`/product/${i}`} className="block bg-[var(--card)] overflow-hidden border border-[var(--border)] hover:border-[var(--accent)] transition-all group">
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
              <p className="text-xs text-[var(--muted)] mb-3 leading-relaxed">{card.synopsis}</p>
              <span className="inline-block bg-[var(--primary)] text-[var(--bg)] px-4 py-1.5 rounded text-xs font-semibold">
                View Details
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
