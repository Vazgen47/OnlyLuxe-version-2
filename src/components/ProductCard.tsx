import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { Product } from '../types';

export function formatPrice(value: number) {
  return `${value.toLocaleString('hy-AM')} ֏`;
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const favorite = isFavorite(product.id);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#eadfc8]/80 bg-white shadow-[0_12px_35px_rgba(43,33,25,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#caaf83] hover:shadow-[0_22px_50px_rgba(43,33,25,0.12)]">
      {/* Product Image Stage */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f7f2ea]">
        <Link to={`/product/${encodeURIComponent(product.slug || String(product.id))}`} className="block h-full w-full">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1000&q=85'}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="pointer-events-none absolute left-3.5 right-3.5 top-3.5 flex items-center justify-between">
          <span className="rounded-full border border-[#caaf83]/40 bg-[#33271d]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#f4ecdf] backdrop-blur-md">
            {product.badge}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(product.id);
            }}
            aria-label={favorite ? 'Հեռացնել ընտրյալներից' : 'Ավելացնել ընտրյալներում'}
            className={`pointer-events-auto rounded-full p-2.5 shadow-sm transition-all duration-300 ${
              favorite
                ? 'border border-[#b89767] bg-[#33271d] text-[#b89767]'
                : 'border border-[#eadfc8] bg-white/90 text-[#33271d] hover:bg-white hover:text-[#b89767]'
            }`}
          >
            <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Audience / Category Tag at bottom of image */}
        <div className="pointer-events-none absolute bottom-3 left-3.5 flex gap-1.5">
          {product.audience && (
            <span className="rounded-full bg-white/85 px-2.5 py-0.5 text-[10px] font-medium text-[#4b3c33] backdrop-blur-sm">
              {product.audience}
            </span>
          )}
          <span className="rounded-full bg-white/85 px-2.5 py-0.5 text-[10px] font-medium text-[#7a685e] backdrop-blur-sm">
            {product.brand}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-[#8a7b70]">
            <span className="uppercase tracking-widest">{product.category}</span>
            <span className="text-[11px] font-mono text-[#a39488]">SKU: {product.sku}</span>
          </div>

          <h3 className="font-serif text-lg font-semibold leading-snug text-[#2b2119] transition-colors group-hover:text-[#b89767]">
            <Link to={`/product/${encodeURIComponent(product.slug || String(product.id))}`}>
              {product.title}
            </Link>
          </h3>

          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#6c5c52]">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#f0e6d6]">
          <div className="mb-3 flex items-baseline gap-2">
            <span className="font-serif text-xl font-bold text-[#2b2119]">
              {formatPrice(product.priceAMD)}
            </span>
            {product.compareAtPriceAMD && (
              <span className="text-xs text-[#a39589] line-through">
                {formatPrice(product.compareAtPriceAMD)}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={product.stockQuantity <= 0}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold tracking-wider transition-all duration-300 ${
                added
                  ? 'bg-[#2b593f] text-white shadow-md'
                  : 'bg-gradient-to-r from-[#b89767] to-[#caaf83] text-[#2b2119] hover:from-[#c2a272] hover:to-[#d4ba90] hover:shadow-lg'
              }`}
            >
              {added ? (
                <>
                  <Check size={14} /> Ավելացված է
                </>
              ) : (
                <>
                  <ShoppingBag size={14} /> Զամբյուղ
                </>
              )}
            </button>

            <Link
              to={`/product/${product.slug}`}
              className="flex items-center justify-center rounded-full border border-[#eadfc8] bg-[#fbf8f4] px-3.5 py-2.5 text-[#33271d] transition-colors hover:border-[#b89767] hover:bg-white"
              aria-label="Մանրամասն"
            >
              <Eye size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
