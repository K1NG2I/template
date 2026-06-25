import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

export default function ShopFlash() {
  const { config } = useConfig();
  const heading = config.shopFlash.heading;
  const cards = (config.products || []).filter((p) => p.featured);

  return (
    <section className="py-12">
      <h2 className="text-[clamp(24px,3.2vw,34px)] font-bold text-center mb-8 text-[var(--primary)]">
        {heading}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Link
            key={i}
            to="/shop"
            className="group bg-[var(--card)] overflow-hidden border border-[var(--border)] hover:border-[var(--accent)] transition-all"
          >
            <div className="aspect-[3/4] bg-[var(--bg-secondary)] overflow-hidden">
              {card.images?.[0] ? (
                <img
                  src={card.images[0]}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs">
                  No Image
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm text-[var(--primary)] mb-0.5">{card.title}</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{card.synopsis}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
