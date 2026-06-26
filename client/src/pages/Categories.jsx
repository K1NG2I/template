import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

export default function Categories() {
  const { config } = useConfig();
  const products = config.products || [];

  const collections = {};
  products.forEach((p) => {
    const name = p.collection?.trim();
    if (!name) return;
    if (!collections[name]) collections[name] = 0;
    collections[name]++;
  });

  const entries = Object.entries(collections);

  return (
    <div className="py-8">
      <h1 className="text-[clamp(24px,3.2vw,34px)] font-bold text-center text-[var(--primary)] mb-2">Shop By Categories</h1>
      <p className="text-sm text-[var(--muted)] text-center mb-10">Browse our collections</p>
      {entries.length === 0 ? (
        <p className="text-sm text-[var(--muted)] text-center">No collections yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map(([name, count]) => (
            <Link
              key={name}
              to={`/shop?collection=${encodeURIComponent(name)}`}
              className="block bg-[var(--card)] border border-[var(--border)] p-8 text-center hover:border-[var(--accent)] transition-all"
            >
              <h2 className="text-lg font-bold text-[var(--primary)] mb-2">{name}</h2>
              <span className="text-xs text-[var(--muted)]">{count} product{count !== 1 ? 's' : ''}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
