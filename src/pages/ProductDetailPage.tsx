import { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Send,
  Phone,
  ShieldCheck,
  Truck,
  Check,
  ArrowLeft,
  Minus,
  Plus,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard, formatPrice } from '../components/ProductCard';

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleFavorite, isFavorite } = useStore();

  const decodedSlug = useMemo(() => {
    try {
      return slug ? decodeURIComponent(slug) : '';
    } catch {
      return slug || '';
    }
  }, [slug]);

  const product = useMemo(
    () =>
      products.find(
        (p) =>
          p.slug === slug ||
          p.slug === decodedSlug ||
          String(p.id) === slug ||
          String(p.id) === decodedSlug
      ),
    [products, slug, decodedSlug]
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
      .slice(0, 4);
  }, [products, product]);

  if (!product) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#2b2119]">Ապրանքը չի գտնվել</h2>
        <p className="mt-3 text-sm text-[#7a685e]">Հնարավոր է ապրանքը հեռացվել է կամ հղումը սխալ է:</p>
        <Link
          to="/catalog"
          className="mt-6 inline-block px-8 py-3 rounded-full bg-[#33271d] text-[#caaf83] font-semibold text-xs uppercase tracking-wider"
        >
          Վերադառնալ կատալոգ
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const telegramOrderText = encodeURIComponent(
    `Ողջույն! Ցանկանում եմ պատվիրել OnlyLuxe-ից:\nԱպրանք՝ ${product.title} (${product.sku})\nՔանակ՝ ${quantity} հատ\nԸնդհանուր՝ ${formatPrice(product.priceAMD * quantity)}`
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-14 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#8a7b70]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 hover:text-[#2b2119] transition-colors"
        >
          <ArrowLeft size={14} /> Ետ
        </button>
        <span>/</span>
        <Link to="/" className="hover:text-[#2b2119]">Գլխավոր</Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-[#2b2119]">Կատալոգ</Link>
        <span>/</span>
        <span className="text-[#33271d] font-semibold">{product.title}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid gap-10 lg:grid-cols-2 items-start">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden border border-[#eadfc8] bg-[#f7f2ea] shadow-md">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4">
              <span className="rounded-full border border-[#caaf83]/40 bg-[#33271d]/90 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#f4ecdf] backdrop-blur-md">
                {product.badge}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-[#b89767] shadow-md scale-102'
                      : 'border-[#eadfc8] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 text-xs font-semibold text-[#8a7b70] uppercase tracking-wider mb-2">
              <span>{product.category}</span>
              <span>•</span>
              <span>Բրենդ՝ {product.brand}</span>
              <span>•</span>
              <span>{product.audience}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2b2119] leading-tight">
              {product.title}
            </h1>

            <div className="mt-2 text-xs font-mono text-[#a39488]">
              Արտիկուլ (SKU)՝ {product.sku}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-white border border-[#eadfc8]">
            <span className="font-serif text-3xl font-bold text-[#2b2119]">
              {formatPrice(product.priceAMD)}
            </span>
            {product.compareAtPriceAMD && (
              <span className="text-sm text-[#a39589] line-through">
                {formatPrice(product.compareAtPriceAMD)}
              </span>
            )}
            <span className="ml-auto text-xs font-semibold text-[#2b593f] flex items-center gap-1">
              <Check size={14} /> Առկա է Երևանում ({product.stockQuantity} հատ)
            </span>
          </div>

          {/* Short Description */}
          <p className="text-sm leading-7 text-[#5d4c42]">
            {product.description}
          </p>

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="rounded-2xl bg-white border border-[#eadfc8] p-5 space-y-3">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#2b2119]">
                Տեխնիկական բնութագիր
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2 text-xs text-[#6b5a50]">
                {product.specifications.map((spec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b89767]" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#eadfc8] rounded-full bg-white px-3 py-1.5 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:text-[#b89767]"
                  aria-label="Նվազեցնել"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-sm font-bold text-[#2b2119]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:text-[#b89767]"
                  aria-label="Ավելացնել"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-serif font-bold uppercase tracking-wider transition-all shadow-md ${
                  added
                    ? 'bg-[#2b593f] text-white'
                    : 'bg-gradient-to-r from-[#b89767] to-[#caaf83] text-[#241a13] hover:shadow-lg'
                }`}
              >
                {added ? (
                  <>
                    <Check size={16} /> Ավելացված է զամբյուղում
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Ավելացնել զամբյուղ ({formatPrice(product.priceAMD * quantity)})
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                className={`p-3.5 rounded-full border shadow-xs transition-colors ${
                  favorite
                    ? 'border-[#b89767] bg-[#33271d] text-[#b89767]'
                    : 'border-[#eadfc8] bg-white text-[#33271d] hover:text-[#b89767]'
                }`}
                aria-label="Սիրել"
              >
                <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Direct Instant Channels */}
            <div className="grid gap-2 sm:grid-cols-2 pt-2">
              <a
                href={`https://t.me/+sAs7VSzcRhhjOTFi?text=${telegramOrderText}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-full border border-[#b89767] bg-[#faf5ef] text-[#2b2119] text-xs font-semibold hover:bg-white transition-colors"
              >
                <Send size={14} className="text-[#b89767]" /> Պատվիրել Telegram-ով
              </a>
              <a
                href="tel:+37455316191"
                className="flex items-center justify-center gap-2 py-3 rounded-full border border-[#eadfc8] bg-white text-[#2b2119] text-xs font-semibold hover:border-[#b89767] transition-colors"
              >
                <Phone size={14} className="text-[#b89767]" /> Զանգահարել 055-31-61-91
              </a>
            </div>
          </div>

          {/* Guarantees */}
          <div className="grid gap-3 sm:grid-cols-2 pt-4 border-t border-[#eadfc8]">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#eadfc8]">
              <ShieldCheck size={20} className="text-[#b89767] flex-shrink-0" />
              <div className="text-xs">
                <strong className="block text-[#2b2119]">2 տարվա պաշտոնական երաշխիք</strong>
                <span className="text-[#78665b]">Մեխանիզմների անվճար սպասարկում:</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#eadfc8]">
              <Truck size={20} className="text-[#b89767] flex-shrink-0" />
              <div className="text-xs">
                <strong className="block text-[#2b2119]">Անվճար առաքում Երևանում</strong>
                <span className="text-[#78665b]">Ապահովագրված առաքում 2 ժամում:</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-[#eadfc8]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
                Նմանատիպ մոդելներ
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2b2119] mt-1">
                Ձեզ նույնպես կարող է դուր գալ
              </h2>
            </div>
            <Link
              to="/catalog"
              className="text-xs font-bold text-[#b89767] hover:underline"
            >
              Դիտել բոլորը →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
      {/* Mobile Sticky Quick Order Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#eadfc8] p-3 px-4 sm:hidden flex items-center justify-between gap-3 shadow-[0_-8px_25px_rgba(43,33,25,0.08)]">
        <div className="min-w-0">
          <div className="text-[11px] text-[#7a685e] truncate font-medium">{product.title}</div>
          <div className="font-serif font-bold text-sm text-[#2b2119]">{formatPrice(product.priceAMD)}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              added ? 'bg-[#2b593f] text-white' : 'bg-gradient-to-r from-[#b89767] to-[#caaf83] text-[#241a13]'
            }`}
          >
            {added ? <Check size={14} /> : <ShoppingBag size={14} />}
            {added ? 'Ավելացված է' : 'Զամբյուղ'}
          </button>
          <a
            href={`https://t.me/+sAs7VSzcRhhjOTFi?text=${telegramOrderText}`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-full border border-[#caaf83] bg-[#faf5ef] text-[#241a13]"
            aria-label="Telegram"
          >
            <Send size={14} className="text-[#b89767]" />
          </a>
        </div>
      </div>
    </div>
  );
}
