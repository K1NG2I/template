import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

function lowestStock(product) {
  if (!product.sizes) return null;
  const available = Object.entries(product.sizes).filter(([, s]) => s.available);
  if (available.length === 0) return null;
  const min = Math.min(...available.map(([, s]) => s.quantity));
  return min;
}

export default function ProductPage() {
  const { id } = useParams();
  const { config } = useConfig();
  const products = config.products || [];
  const product = products[Number(id)];
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-[var(--muted)]">Product not found</p>
        <Link to="/shop" className="text-[var(--accent)] text-sm mt-2 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const images = product.images || [];
  const suggestions = products.filter((_, i) => i !== Number(id)).slice(0, 4);
  const sizes = product.sizes || {};
  const availableSizes = Object.entries(sizes).filter(([, s]) => s.available);
  const stock = lowestStock(product);

  return (
    <div className="py-8 space-y-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 flex gap-4">
          <div className="flex-1 aspect-square bg-[var(--bg-secondary)] overflow-hidden">
            {images[selectedImage] ? (
              <img src={images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-sm">
                No Image
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex flex-col gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 overflow-hidden border-2 flex-shrink-0 transition-all ${
                    i === selectedImage ? 'border-[var(--accent)]' : 'border-[var(--border)] hover:border-[var(--muted)]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-[clamp(28px,4vw,48px)] font-bold text-[var(--primary)] mb-4">
            {product.title}
          </h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
            {product.description || product.synopsis}
          </p>
          {stock === null && (
            <p className="text-xs text-red-400 font-semibold mb-4">Out of Stock</p>
          )}
          {availableSizes.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-[var(--muted)] mb-2">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(([size, s]) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border transition-all ${
                      selectedSize === size
                        ? 'bg-[var(--primary)] text-[var(--bg)] border-[var(--primary)]'
                        : 'bg-transparent text-[var(--primary)] border-[var(--border)] hover:border-[var(--primary)]'
                    }`}
                  >
                    {size}
                    {s.quantity < 5 && (
                      <span className="text-[10px] text-red-400 ml-1">({s.quantity} left)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          {selectedSize && sizes[selectedSize]?.quantity < 5 && (
            <p className="text-xs text-red-400 mb-4">
              Only {sizes[selectedSize].quantity} left in stock!
            </p>
          )}
          <span className={`inline-block self-start px-8 py-3 text-sm font-semibold ${
            stock === null
              ? 'bg-[var(--border)] text-[var(--muted)] cursor-not-allowed'
              : 'bg-[var(--primary)] text-[var(--bg)] cursor-default'
          }`}>
            {stock === null ? 'Out of Stock' : 'Shop Now'}
          </span>
        </div>
      </div>

      <div>
        <h2 className="text-[clamp(20px,2.5vw,28px)] font-bold text-[var(--primary)] mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {suggestions.map((card, i) => {
            const s = lowestStock(card);
            return (
              <Link
                key={i}
                to={`/product/${products.indexOf(card)}`}
                className="group bg-[var(--card)] overflow-hidden border border-[var(--border)] hover:border-[var(--accent)] transition-all"
              >
                <div className="aspect-[4/3] bg-[var(--bg-secondary)] overflow-hidden">
                  {card.images?.[0] ? (
                    <img src={card.images[0]} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-[var(--primary)] mb-0.5">{card.title}</h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{card.synopsis}</p>
                  {s !== null && s < 5 && (
                    <span className="text-[10px] text-red-400 font-semibold block mt-1">Only {s} stock left!</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
