import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  X,
  Send,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Camera,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from './ProductCard';

export function TikTokIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 10.82 4.48 6.27 6.27 0 0 0 1.86-4.48V8.71a8.28 8.28 0 0 0 4.77 1.43V6.69z" />
    </svg>
  );
}

const mainNavItems = [
  { to: '/', label: 'Գլխավոր' },
  { to: '/catalog', label: 'Բոլոր ապրանքները' },
  { to: '/watches', label: 'Ժամացույցներ' },
  { to: '/bags', label: 'Պայուսակներ' },
  { to: '/wallets', label: 'Դրամապանակներ' },
  { to: '/men', label: 'Տղամարդու' },
  { to: '/women', label: 'Կանացի' },
  { to: '/couples', label: 'Զույգերի' },
];

export function Layout() {
  const {
    cart,
    favorites,
    products,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    siteSettings,
  } = useStore();

  const [openMobile, setOpenMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();

  useEffect(() => {
    setOpenMobile(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMobile(false);
        setDrawerOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (drawerOpen || searchOpen || openMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen, searchOpen, openMobile]);

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = products.find((entry) => entry.id === item.id);
        return sum + (product ? product.priceAMD * item.quantity : 0);
      }, 0),
    [cart, products]
  );

  const favoritesCount = favorites.length;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const searchResults = useMemo(() => {
    if (!searchValue.trim()) return [];
    const query = searchValue.toLowerCase();
    return products
      .filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.audience.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }, [products, searchValue]);

  const telegramOrderMessage = useMemo(() => {
    if (cart.length === 0) return '';
    const itemsList = cart
      .map((item) => {
        const p = products.find((prod) => prod.id === item.id);
        return p ? `• ${p.title} (x${item.quantity}) - ${formatPrice(p.priceAMD * item.quantity)}` : '';
      })
      .filter(Boolean)
      .join('%0A');
    return `Ողջույն, ցանկանում եմ պատվիրել OnlyLuxe-ից:%0A%0A${itemsList}%0A%0AԸնդհանուր գումար՝ ${formatPrice(cartTotal)}`;
  }, [cart, products, cartTotal]);

  return (
    <div className="min-h-screen bg-[#faf5ef] text-[#2b2119] flex flex-col font-sans">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-gradient-to-r from-[#1f1714] via-[#33271d] to-[#1f1714] text-[#f4ecdf] text-xs py-2 px-4 border-b border-[#caaf83]/20">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl">
          <div className="flex items-center gap-2 tracking-wide font-medium">
            <Sparkles size={13} className="text-[#caaf83]" />
            <span>{siteSettings.bannerNotice}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#caaf83]">
            <a
              href="tel:+37455316191"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone size={11} /> 055-31-61-91
            </a>
            <span className="text-[#6d5b51]">|</span>
            <a
              href="https://t.me/+sAs7VSzcRhhjOTFi"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Telegram
            </a>
            <span className="text-[#6d5b51]">|</span>
            <a
              href="https://www.instagram.com/onlyluxe.evn/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
            <span className="text-[#6d5b51]">|</span>
            <a
              href="https://www.tiktok.com/@onlyluxe.evn"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-40 bg-[#faf5ef]/90 backdrop-blur-md border-b border-[#eadfc8]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          {/* Mobile menu trigger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-full border border-[#eadfc8] bg-white text-[#33271d]"
            onClick={() => setOpenMobile(!openMobile)}
            aria-label="Մենյու"
          >
            {openMobile ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Luxury Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#3d2f23] to-[#1e1611] p-[1.5px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full rounded-full border border-[#caaf83]/60 flex items-center justify-center">
                <span className="font-serif font-bold text-lg text-[#caaf83] group-hover:scale-105 transition-transform">L</span>
              </div>
            </div>
            <div className="leading-tight">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#2b2119]">
                ONLYLUXE
              </span>
              <span className="block text-[9px] uppercase tracking-[0.16em] text-[#b89767] font-semibold">
                OnlyLuxe × iCloneEvn
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold tracking-wider text-[#41342d] uppercase">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative py-1 transition-colors hover:text-[#b89767] ${
                    isActive ? 'text-[#b89767] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#b89767]' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-full border border-[#eadfc8] bg-white text-[#33271d] hover:border-[#caaf83] hover:text-[#b89767] transition-all"
              aria-label="Որոնում"
            >
              <Search size={18} />
            </button>

            {/* Favorites Icon */}
            <Link
              to="/favorites"
              className="relative p-2.5 rounded-full border border-[#eadfc8] bg-white text-[#33271d] hover:border-[#caaf83] hover:text-[#b89767] transition-all"
              aria-label="Ընտրյալներ"
            >
              <Heart size={18} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#b89767] text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative flex items-center gap-2 rounded-full border border-[#caaf83] bg-[#33271d] px-3.5 py-2 text-[#f4ecdf] hover:bg-[#241a13] transition-all shadow-sm"
              aria-label="Զամբյուղ"
            >
              <ShoppingBag size={17} className="text-[#caaf83]" />
              <span className="text-xs font-bold hidden sm:inline">{cartCount}</span>
              {cartCount > 0 && (
                <span className="sm:hidden absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#caaf83] text-[#33271d] text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {openMobile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-[#eadfc8] bg-[#faf5ef] px-6 py-5 overflow-hidden"
            >
              <nav className="flex flex-col gap-3 text-sm font-medium">
                {mainNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpenMobile(false)}
                    className={({ isActive }) =>
                      `py-2 px-3 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-[#33271d] text-[#caaf83] font-semibold'
                          : 'text-[#41342d] hover:bg-[#eadfc8]/40'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="pt-4 mt-2 border-t border-[#eadfc8]/80 flex flex-col gap-2 text-xs text-[#715f54]">
                  <Link to="/about" onClick={() => setOpenMobile(false)}>Մեր մասին</Link>
                  <Link to="/delivery" onClick={() => setOpenMobile(false)}>Առաքում և երաշխիք</Link>
                  <Link to="/faq" onClick={() => setOpenMobile(false)}>Հաճախ տրվող հարցեր</Link>
                  <Link to="/contact" onClick={() => setOpenMobile(false)}>Կապ և բուտիկ</Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Luxury Footer */}
      <footer className="bg-[#1e1611] text-[#f4ecdf] border-t border-[#33271d] mt-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#caaf83]/80 flex items-center justify-center bg-[#291e17]">
                <span className="font-serif font-bold text-lg text-[#caaf83]">L</span>
              </div>
              <div className="leading-tight">
                <span className="font-serif text-2xl font-bold tracking-wider text-white">
                  ONLYLUXE
                </span>
                <span className="block text-[9px] uppercase tracking-[0.16em] text-[#caaf83] font-semibold">
                  OnlyLuxe × iCloneEvn
                </span>
              </div>
            </Link>
            <p className="text-xs leading-6 text-[#c7b9ab] max-w-xs">
              Երևանում շքեղության, շվեյցարական ճշգրտության և բարձրորակ կաշվե աքսեսուարների պաշտոնական օնլայն բուտիկ: Յուրաքանչյուր մոդել անցնում է որակի մանրակրկիտ ստուգում:
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs">
              <span className="text-[#caaf83]">Հեռախոս՝</span>
              <a href="tel:+37455316191" className="text-white hover:text-[#caaf83] font-semibold">
                055-31-61-91
              </a>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4 pb-2 border-b border-[#33271d]">
              Կատալոգ
            </h4>
            <ul className="space-y-2.5 text-xs text-[#c7b9ab]">
              <li><Link to="/watches" className="hover:text-[#caaf83] transition-colors">Շվեյցարական ժամացույցներ</Link></li>
              <li><Link to="/bags" className="hover:text-[#caaf83] transition-colors">Կաշվե պայուսակներ</Link></li>
              <li><Link to="/wallets" className="hover:text-[#caaf83] transition-colors">Դրամապանակներ</Link></li>
              <li><Link to="/men" className="hover:text-[#caaf83] transition-colors">Տղամարդու հավաքածու</Link></li>
              <li><Link to="/women" className="hover:text-[#caaf83] transition-colors">Կանացի հավաքածու</Link></li>
              <li><Link to="/couples" className="hover:text-[#caaf83] transition-colors">Զույգերի հավաքածուներ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4 pb-2 border-b border-[#33271d]">
              Սպասարկում
            </h4>
            <ul className="space-y-2.5 text-xs text-[#c7b9ab]">
              <li><Link to="/about" className="hover:text-[#caaf83] transition-colors">Մեր մասին</Link></li>
              <li><Link to="/delivery" className="hover:text-[#caaf83] transition-colors">Առաքման պայմաններ</Link></li>
              <li><Link to="/warranty" className="hover:text-[#caaf83] transition-colors">Երաշխիք և սպասարկում</Link></li>
              <li><Link to="/faq" className="hover:text-[#caaf83] transition-colors">Հաճախ տրվող հարցեր (ՀՏՀ)</Link></li>
              <li><Link to="/privacy" className="hover:text-[#caaf83] transition-colors">Գաղտնիության քաղաքականություն</Link></li>
              <li><Link to="/terms" className="hover:text-[#caaf83] transition-colors">Օգտագործման կանոններ</Link></li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white mb-4 pb-2 border-b border-[#33271d]">
              Միացեք մեզ
            </h4>
            <div className="space-y-2.5 text-xs text-[#c7b9ab]">
              <a
                href="https://www.instagram.com/onlyluxe.evn/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-[#291e17] border border-[#3d2f23] hover:border-[#caaf83] hover:text-[#caaf83] transition-all"
              >
                <Camera size={15} className="text-[#caaf83]" />
                <span>Instagram: @onlyluxe.evn</span>
              </a>
              <a
                href="https://t.me/+sAs7VSzcRhhjOTFi"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-[#291e17] border border-[#3d2f23] hover:border-[#caaf83] hover:text-[#caaf83] transition-all"
              >
                <Send size={15} className="text-[#caaf83]" />
                <span>Telegram ալիք և պատվերներ</span>
              </a>
              <a
                href="https://www.tiktok.com/@onlyluxe.evn"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-[#291e17] border border-[#3d2f23] hover:border-[#caaf83] hover:text-[#caaf83] transition-all"
              >
                <TikTokIcon size={15} className="text-[#caaf83]" />
                <span>TikTok: @onlyluxe.evn</span>
              </a>
              <a
                href="tel:+37455316191"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-[#291e17] border border-[#3d2f23] hover:border-[#caaf83] hover:text-[#caaf83] transition-all"
              >
                <Phone size={15} className="text-[#caaf83]" />
                <span>Հեռ.` 055-31-61-91</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom bar with agency credit */}
        <div className="border-t border-[#33271d]/80 py-6 px-4">
          <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8f7e71]">
            <p>© {new Date().getFullYear()} OnlyLuxe × iCloneEvn: Բոլոր իրավունքները պաշտպանված են:</p>
            <div className="text-[11px] text-[#caaf83] tracking-wide font-medium italic">
              «Պատրաստված է Mkheyan Agency-ի կողմից»
            </div>
            <div className="flex items-center gap-6">
              <Link to="/admin" className="text-[#caaf83] hover:underline">
                Ադմինիստրատորի մուտք
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#faf5ef] shadow-2xl flex flex-col border-l border-[#eadfc8]"
            >
              {/* Header */}
              <div className="p-5 border-b border-[#eadfc8] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#b89767]" />
                  <h3 className="font-serif text-lg font-bold text-[#2b2119]">
                    Ձեր զամբյուղը ({cartCount})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-[#f2ece2] text-[#6d5b51]"
                  aria-label="Փակել"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#7a695e]">
                    <div className="w-16 h-16 rounded-full bg-[#f2ece2] flex items-center justify-center mb-4 text-[#caaf83]">
                      <ShoppingBag size={28} />
                    </div>
                    <p className="font-serif text-lg text-[#2b2119] font-semibold mb-1">
                      Զամբյուղը դատարկ է
                    </p>
                    <p className="text-xs text-[#8c7b70] mb-6">
                      Դիտեք մեր շքեղ հավաքածուն և ընտրեք ձեր նախընտրած մոդելները:
                    </p>
                    <Link
                      to="/catalog"
                      onClick={() => setDrawerOpen(false)}
                      className="px-6 py-2.5 rounded-full bg-[#33271d] text-[#caaf83] text-xs font-semibold uppercase tracking-wider hover:bg-[#1f1714] transition-colors"
                    >
                      Անցնել կատալոգ
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => {
                    const product = products.find((p) => p.id === item.id);
                    if (!product) return null;
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3.5 rounded-2xl bg-white border border-[#eadfc8]/80 shadow-xs"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-20 h-24 rounded-xl object-cover bg-[#f4ecdf]"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-serif text-sm font-semibold text-[#2b2119] leading-snug line-clamp-1">
                                {product.title}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="text-[#a89082] hover:text-[#c44] p-1"
                                aria-label="Հեռացնել"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <span className="text-[11px] text-[#8a7a70]">{product.category}</span>
                            <div className="font-serif text-sm font-bold text-[#b89767] mt-1">
                              {formatPrice(product.priceAMD)}
                            </div>
                          </div>

                          {/* Quantity control */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#f2ece2]">
                            <div className="flex items-center border border-[#eadfc8] rounded-full bg-[#faf5ef] px-2 py-0.5">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:text-[#b89767]"
                                aria-label="Նվազեցնել"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:text-[#b89767]"
                                aria-label="Ավելացնել"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-xs font-bold text-[#2b2119]">
                              {formatPrice(product.priceAMD * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer Checkout */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-[#eadfc8] bg-white space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6d5b51]">Ընդհանուր գումար՝</span>
                    <span className="font-serif text-xl font-bold text-[#2b2119]">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>

                  <div className="grid gap-2">
                    <Link
                      to="/cart"
                      onClick={() => setDrawerOpen(false)}
                      className="w-full text-center py-3 rounded-full bg-[#33271d] text-[#caaf83] font-semibold text-xs uppercase tracking-wider hover:bg-[#221812] transition-colors shadow-md"
                    >
                      Պատվիրել կայքում
                    </Link>

                    <a
                      href={`https://t.me/+sAs7VSzcRhhjOTFi?text=${telegramOrderMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-[#caaf83] bg-[#faf5ef] text-[#33271d] font-semibold text-xs tracking-wider hover:bg-white transition-colors"
                    >
                      <Send size={14} className="text-[#b89767]" /> Պատվիրել Telegram-ով
                    </a>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-[11px] text-[#9c897d] hover:text-[#33271d] underline"
                    >
                      Մաքրել զամբյուղը
                    </button>
                    <span className="text-[11px] text-[#2b593f] font-medium">✓ Անվճար առաքում</span>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-[#eadfc8]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#eadfc8]">
                <div className="flex items-center gap-3 flex-1">
                  <Search size={20} className="text-[#b89767]" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Որոնել ըստ բրենդի, մոդելի կամ կատեգորիայի..."
                    autoFocus
                    className="w-full text-base bg-transparent text-[#2b2119] placeholder:text-[#a8988d] focus:outline-hidden"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-full text-[#7a685e] hover:bg-[#f2ece2]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Quick Results */}
              <div className="mt-4 max-h-96 overflow-y-auto">
                {searchValue.trim() ? (
                  searchResults.length > 0 ? (
                    <div className="grid gap-2">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#faf5ef] transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-12 h-14 rounded-lg object-cover bg-[#f4ecdf]"
                            />
                            <div>
                              <h4 className="font-serif text-sm font-semibold text-[#2b2119] group-hover:text-[#b89767] transition-colors">
                                {product.title}
                              </h4>
                              <p className="text-[11px] text-[#8a796e]">
                                {product.category} · {product.brand} · {product.audience}
                              </p>
                            </div>
                          </div>
                          <span className="font-serif text-sm font-bold text-[#b89767]">
                            {formatPrice(product.priceAMD)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-sm text-[#8a796e]">
                      Ապրանքներ չեն գտնվել «{searchValue}» հարցումով:
                    </div>
                  )
                ) : (
                  <div className="py-4 text-xs text-[#8a796e]">
                    <p className="font-semibold text-[#33271d] mb-2">Հայտնի որոնումներ՝</p>
                    <div className="flex flex-wrap gap-2">
                      {['Rolex', 'Patek Philippe', 'Omega', 'Պայուսակներ', 'Դրամապանակներ', 'Կանացի', 'Տղամարդու'].map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => setSearchValue(item)}
                          className="px-3 py-1.5 rounded-full border border-[#eadfc8] bg-[#faf5ef] hover:border-[#b89767] hover:text-[#b89767] transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
