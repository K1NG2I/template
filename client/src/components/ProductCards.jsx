import { useConfig } from '../context/ConfigContext';

export default function ProductCards() {
  const { config } = useConfig();
  const heading = config.showcase?.heading || 'Showcase';
  const cards = config.showcase?.cards || [];

  return (
    <section className="py-12 space-y-2">
      <h2 className="text-[clamp(24px,3.2vw,34px)] font-bold text-center mb-8 text-[var(--primary)]">
        {heading}
      </h2>
      {cards.map((card, i) => (
        <div
          key={i}
          className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-2 items-center bg-[var(--card)] border border-[var(--border)] p-2`}
        >
          <div className="w-full md:w-[30%] aspect-[4/3] bg-[var(--bg-secondary)] overflow-hidden flex-shrink-0">
            {card.image ? (
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs">
                No Image
              </div>
            )}
          </div>
          <div className="w-full md:w-[70%]">
            <h3 className="text-base font-bold text-[var(--primary)] mb-2">{card.title}</h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">{card.synopsis}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
