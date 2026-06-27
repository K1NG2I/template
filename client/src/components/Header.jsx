import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Header() {
  const { config } = useConfig();
  const { logo, navLinks } = config.header;
  const { theme, toggle } = useTheme();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) { setCartCount(0); return; }
    supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id)
      .then(({ data }) => {
        setCartCount(data?.reduce((s, i) => s + i.quantity, 0) || 0);
      });
  }, [user]);

  function closeMenu() {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }

  return (
    <header className="fixed top-[var(--discount-height)] left-0 right-0 z-40 bg-[var(--nav-bg)] border-b border-[var(--border)]" style={{ height: 'var(--nav-height)' }}>
      <div className="px-[10%] h-full flex items-center justify-between">
        <Link to="/" onClick={closeMenu} className="flex items-center">
          {logo ? (
            <img src={logo} alt="Logo" style={{ width: config.header.logoWidth || 'auto', height: config.header.logoHeight || 'auto' }} className="w-auto" />
          ) : (
            <span className="text-lg font-bold text-[var(--primary)]">Logo</span>
          )}
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-1"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-[2px] bg-[var(--primary)] transition-transform ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`block w-5 h-[2px] bg-[var(--primary)] transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[2px] bg-[var(--primary)] transition-transform ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>

        <nav className="hidden md:flex items-center gap-5">
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
          <Link to="/cart" className="relative text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 text-[10px] bg-[var(--primary)] text-[var(--bg)] w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              {user.user_metadata?.avatar_url && (
                <img src={user.user_metadata.avatar_url} alt="" className="w-6 h-6 rounded-full" />
              )}
              <span className="text-xs text-[var(--muted)] hidden sm:inline">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </span>
              <button onClick={signOut} className="text-xs text-[var(--muted)] hover:text-red-400 transition-colors">
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={signInWithGoogle} className="text-xs text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
              Sign In
            </button>
          )}
          <button
            onClick={toggle}
            className="ml-2 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '\u2600' : '\u263E'}
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--nav-bg)] border-b border-[var(--border)] px-[10%] py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              className="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/cart" onClick={closeMenu} className="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
            Cart{cartCount > 0 && ` (${cartCount})`}
          </Link>
          <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
            {user ? (
              <>
                {user.user_metadata?.avatar_url && (
                  <img src={user.user_metadata.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                )}
                <span className="text-xs text-[var(--muted)]">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                <button onClick={signOut} className="text-xs text-[var(--muted)] hover:text-red-400 transition-colors ml-auto">Sign Out</button>
              </>
            ) : (
              <button onClick={signInWithGoogle} className="text-xs text-[var(--muted)] hover:text-[var(--primary)] transition-colors">Sign In</button>
            )}
            <button onClick={toggle} className="ml-auto text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
              {theme === 'dark' ? '\u2600' : '\u263E'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
