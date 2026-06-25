import { useConfig } from '../context/ConfigContext';

export default function Footer() {
  const { config } = useConfig();
  const { text, email } = config.footer;

  return (
    <footer className="bg-[var(--bg)] text-[var(--muted)]">
      <hr className="border-[var(--border)]" />
      <div className="px-[10%] h-[10vh] flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs">{text}</p>
        {email && (
          <a href={`mailto:${email}`} className="text-xs hover:text-[var(--primary)] transition-colors">
            {email}
          </a>
        )}
      </div>
    </footer>
  );
}
