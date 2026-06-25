import HeroSection from '../components/HeroSection';
import ShopFlash from '../components/ShopFlash';
import ProductCards from '../components/ProductCards';
import AboutSection from '../components/AboutSection';

export default function Home() {
  return (
    <>
      <div className="-mx-[10vw] -mt-[var(--nav-height)]">
        <HeroSection />
      </div>
      <ShopFlash />
      <ProductCards />
      <AboutSection />
    </>
  );
}
