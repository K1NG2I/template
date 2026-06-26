import { useConfig } from '../context/ConfigContext';

export default function NotesSection() {
  const { config } = useConfig();
  const { heading, rules } = config.notes || {};

  if (!rules || rules.length === 0) return null;

  return (
    <section className="py-12" style={{ backgroundColor: 'var(--nav-bg)' }}>
      <div className="max-w-3xl mx-auto">
        {heading && (
          <h3 className="text-[clamp(20px,2.5vw,28px)] font-bold text-center mb-6 text-[var(--primary)]">
            {heading}
          </h3>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rules.map((rule, i) => (
            <div key={i} className="border border-[var(--border)] p-5 text-center bg-transparent">
              <span className="text-sm text-[var(--muted)] leading-relaxed">{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
