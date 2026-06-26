import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useConfig } from './context/ConfigContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';
import Categories from './pages/Categories';
import CartPage from './pages/CartPage';
import Admin from './pages/Admin';

export default function App() {
  const { config, loading } = useConfig();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <p className="text-sm text-[var(--muted)]">Loading...</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <p className="text-sm text-[var(--muted)] mb-2">Could not load configuration</p>
          <p className="text-xs text-[var(--muted)]">Make sure the server is running on port 4000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <ScrollToTop />
      <Header />
      <main className="flex-1 px-[10%] pt-[var(--nav-height)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
