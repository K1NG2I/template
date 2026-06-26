import { useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import HeroSection from '../components/HeroSection';
import ShopFlash from '../components/ShopFlash';
import ProductCards from '../components/ProductCards';
import BestSellers from '../components/BestSellers';
import DailyEssentials from '../components/DailyEssentials';
import AboutSection from '../components/AboutSection';

export default function Home() {
  const { config } = useConfig();

  useEffect(() => {
    document.title = 'Dachima';
    const link = document.querySelector('link[rel="icon"]');
    if (config?.header?.logo && link) {
      link.href = config.header.logo;
    }
  }, [config]);

  return (
    <>
      <div className="-mx-[10vw] -mt-[var(--nav-height)]">
        <HeroSection />
      </div>
      <ShopFlash />
      <DailyEssentials />
      <BestSellers />
      <ProductCards />
      <AboutSection />
    </>
  );
}
