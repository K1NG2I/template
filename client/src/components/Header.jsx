import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { config } = useConfig();
  const { logo, navLinks } = config.header;
  const { theme, toggle } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--nav-bg)] border-b border-[var(--border)]" style={{ height: 'var(--nav-height)' }}>
      <div className="px-[10%] h-full flex items-center justify-between">
        <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
          {logo ? (
            <img src={logo} alt="Logo" style={{ width: config.header.logoWidth || 'auto', height: config.header.logoHeight || 'auto' }} className="w-auto" />
          ) : (
            <span className="text-lg font-bold text-[var(--primary)]">Logo</span>
          )}
        </Link>
        <nav className="flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={toggle}
            className="ml-2 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '\u2600' : '\u263E'}
          </button>
        </nav>
      </div>
    </header>
  );
}
