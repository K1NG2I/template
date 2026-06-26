import { useConfig } from '../context/ConfigContext';

export default function DiscountBar() {
  const { config } = useConfig();
  const text = config.discountBar?.text?.trim();

  if (!text) {
    document.documentElement.style.setProperty('--discount-height', '0px');
    return null;
  }

  document.documentElement.style.setProperty('--discount-height', '28px');

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-[var(--accent)] text-[var(--bg)] text-xs font-semibold" style={{ height: '28px' }}>
      {text}
    </div>
  );
}
