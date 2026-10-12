import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

export function FavoritesPage() {
  const { favorites, products } = useStore();
  const favoriteProducts = products.filter((p) => favorites.includes(p.id) && p.isActive);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      <div className="pb-4 border-b border-[#eadfc8] flex items-end justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
            OnlyLuxe Wishlist
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2b2119] mt-1">
            Ընտրյալ մոդելներ
          </h1>
        </div>
        <span className="text-xs text-[#736358]">{favoriteProducts.length} ապրանք</span>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#caaf83] bg-white p-12 sm:p-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#faf5ef] text-[#caaf83] flex items-center justify-center mx-auto">
            <Heart size={28} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2b2119]">
            Ձեր ընտրյալների ցանկը դատարկ է
          </h2>
          <p className="text-xs sm:text-sm text-[#736358] max-w-md mx-auto">
            Սեղմեք ապրանքների վրա գտնվող սրտիկի պատկերակին՝ ձեր նախընտրած մոդելները այստեղ պահպանելու համար:
          </p>
          <div className="pt-2">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#33271d] text-[#caaf83] font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#201712] transition-colors"
            >
              Դիտել կատալոգը <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
