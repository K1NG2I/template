import { useConfig } from '../context/ConfigContext';

export default function AboutSection() {
  const { config } = useConfig();
  const { text, rules } = config.about;

  return (
    <section id="about" className="min-h-[70vh] flex flex-col">
      <div className="flex-1 flex items-center py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[clamp(24px,3vw,34px)] font-bold text-[var(--primary)] mb-4">About Us</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--nav-bg)' }}>{text}</p>
        </div>
      </div>
      <div className="flex-[2] bg-[var(--bg)] py-12">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-[clamp(24px,3vw,34px)] font-bold text-center mb-6 text-[var(--primary)]">To Be Noted</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rules.map((rule, i) => (
              <div key={i} className="border border-[var(--border)] p-5 text-center bg-[var(--card)]">
                <span className="text-sm leading-relaxed" style={{ color: 'var(--nav-bg)' }}>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
