import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

export default function HeroSection() {
  const { config } = useConfig();
  const { video, posterImage, headline, subtext, ctaText, ctaLink } = config.hero;
  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!video) setShowContent(true);
  }, [video]);

  return (
    <section className="relative h-[50vh] md:h-screen w-full overflow-hidden bg-black">
      {!showContent && video && (
        <video
          ref={videoRef}
          src={video}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onEnded={() => setShowContent(true)}
        />
      )}

      {showContent && posterImage && (
        <img
          src={posterImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-opacity duration-1000 ${
          showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <h1 className="text-[clamp(36px,6vw,72px)] font-bold text-white mb-3">
          {headline}
        </h1>
        <p className="text-[clamp(14px,1.6vw,20px)] text-[var(--muted)] mb-6 max-w-xl">
          {subtext}
        </p>
        {ctaLink && (
          <Link
            to={ctaLink}
            className="inline-block bg-black text-white dark:bg-white dark:text-black px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {ctaText}
          </Link>
        )}
      </div>

      {!showContent && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-xs animate-pulse">
          ▼
        </div>
      )}
    </section>
  );
}
