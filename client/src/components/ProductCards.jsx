import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

export default function ProductCards() {
  const { config } = useConfig();
  const heading = config.showcase?.heading || 'Collection';
  const products = config.products || [];

  const collections = {};
  products.forEach((p) => {
    const name = p.collection?.trim();
    if (!name) return;
    if (!collections[name]) collections[name] = [];
    collections[name].push(p);
  });

  const entries = Object.entries(collections);

  return (
    <section className="py-12">
      <h2 className="text-[clamp(24px,3.2vw,34px)] font-bold text-center mb-8 text-[var(--primary)]">
        {heading}
      </h2>
      {entries.length === 0 ? (
        <p className="text-sm text-[var(--muted)] text-center">No collections yet.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {entries.map(([name, prods]) => {
            const images = prods.slice(0, 3).map((p) => p.images?.[0]).filter(Boolean);
            return (
              <Link
                key={name}
                to={`/shop?collection=${encodeURIComponent(name)}`}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md bg-[var(--card)] border border-[var(--border)] p-6 text-center hover:border-[var(--accent)] transition-all group"
              >
                <div className="relative h-52 mb-4">
                  {images[0] && (
                    <div className="absolute bottom-0 left-[5%] w-[35%] h-[55%] z-10 overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)] transition-all">
                      <img src={images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {(images[1] || images[0]) && (
                    <div className="absolute bottom-[18%] left-[18%] w-[64%] h-[75%] z-20 overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)] transition-all shadow-lg">
                      <img src={images[1] || images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {images[2] && (
                    <div className="absolute bottom-0 right-[5%] w-[35%] h-[55%] z-10 overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)] transition-all">
                      <img src={images[2]} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <h2 className="text-lg font-bold text-[var(--primary)] mb-1">{name}</h2>
                <span className="text-xs text-[var(--muted)]">{prods.length} product{prods.length !== 1 ? 's' : ''}</span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
