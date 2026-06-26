export default function Rating({ average, count, size = 'sm' }) {
  const starSize = size === 'sm' ? 'text-xs' : 'text-sm';
  if (!average && average !== 0) return null;

  const stars = Math.round(average);
  return (
    <span className={`inline-flex items-center gap-1 ${starSize} text-[var(--muted)]`}>
      <span className="text-[var(--accent)]">
        {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      </span>
      {count !== undefined && <span>({count})</span>}
    </span>
  );
}
