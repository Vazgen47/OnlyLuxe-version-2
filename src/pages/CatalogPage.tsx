import { useMemo, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Filter, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

const ALL_CATEGORIES = ['Բոլորը', 'Ժամացույցներ', 'Պայուսակներ', 'Դրամապանակներ'];
const ALL_AUDIENCES = ['Բոլորը', 'Տղամարդու', 'Կանացի', 'Զույգերի'];
const ALL_BRANDS = [
  'Բոլորը',
  'Rolex',
  'Patek Philippe',
  'Audemars Piguet',
  'Hublot',
  'Omega',
  'Tissot',
  'OnlyLuxe',
];

interface CatalogPageProps {
  initialCategory?: string;
  initialAudience?: string;
}

export function CatalogPage({ initialCategory, initialAudience }: CatalogPageProps) {
  const { category: paramCategory, brand: paramBrand } = useParams();
  const location = useLocation();
  const { products } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('Բոլորը');
  const [selectedBrand, setSelectedBrand] = useState<string>('Բոլորը');
  const [selectedAudience, setSelectedAudience] = useState<string>('Բոլորը');
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Sync route path with initial filters
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/watches')) {
      setSelectedCategory('Ժամացույցներ');
      if (paramBrand) {
        setSelectedBrand(decodeURIComponent(paramBrand));
      } else {
        setSelectedBrand('Բոլորը');
      }
    } else if (path.startsWith('/bags')) {
      setSelectedCategory('Պայուսակներ');
      setSelectedBrand('Բոլորը');
    } else if (path.startsWith('/wallets')) {
      setSelectedCategory('Դրամապանակներ');
      setSelectedBrand('Բոլորը');
    } else if (path.startsWith('/men')) {
      setSelectedAudience('Տղամարդու');
      setSelectedCategory('Բոլորը');
    } else if (path.startsWith('/women')) {
      setSelectedAudience('Կանացի');
      setSelectedCategory('Բոլորը');
    } else if (path.startsWith('/couples')) {
      setSelectedAudience('Զույգերի');
      setSelectedCategory('Բոլորը');
    } else if (paramCategory) {
      setSelectedCategory(decodeURIComponent(paramCategory));
    } else if (initialCategory) {
      setSelectedCategory(initialCategory);
    } else if (initialAudience) {
      setSelectedAudience(initialAudience);
    }
  }, [location.pathname, paramCategory, paramBrand, initialCategory, initialAudience]);

  const resetFilters = () => {
    setSelectedCategory('Բոլորը');
    setSelectedBrand('Բոլորը');
    setSelectedAudience('Բոլորը');
    setSearch('');
    setSort('featured');
  };

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.isActive);

    if (selectedCategory !== 'Բոլորը') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedBrand !== 'Բոլորը') {
      list = list.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    if (selectedAudience !== 'Բոլորը') {
      list = list.filter(
        (p) => p.audience === selectedAudience || p.audience === 'Ունիսեքս'
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sort === 'price-low') {
      list = [...list].sort((a, b) => a.priceAMD - b.priceAMD);
    } else if (sort === 'price-high') {
      list = [...list].sort((a, b) => b.priceAMD - a.priceAMD);
    } else if (sort === 'newest') {
      list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return list;
  }, [products, selectedCategory, selectedBrand, selectedAudience, search, sort]);

  const pageTitle = useMemo(() => {
    if (selectedBrand !== 'Բոլորը') return `${selectedBrand} Ժամացույցներ`;
    if (selectedCategory !== 'Բոլորը') return selectedCategory;
    if (selectedAudience !== 'Բոլորը') return `${selectedAudience} Հավաքածու`;
    return 'Պրեմիում կատալոգ';
  }, [selectedBrand, selectedCategory, selectedAudience]);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
      {/* Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#eadfc8]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
            OnlyLuxe Evn Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2b2119] mt-1">
            {pageTitle}
          </h1>
          <p className="text-xs text-[#78665b] mt-1">
            Առկա է {filtered.length} բացառիկ մոդել Երևանում
          </p>
        </div>

        {/* Mobile filter button & Sort */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#eadfc8] bg-white text-xs font-semibold text-[#2b2119]"
          >
            <SlidersHorizontal size={14} /> Ֆիլտրեր
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#78665b] hidden sm:inline">Սորտավորել՝</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-[#eadfc8] bg-white px-4 py-2 text-xs font-medium text-[#2b2119] focus:outline-hidden"
            >
              <option value="featured">Առաջարկվողներ</option>
              <option value="newest">Նոր ժամանումներ</option>
              <option value="price-low">Գին՝ ցածրից բարձր</option>
              <option value="price-high">Գին՝ բարձրից ցածր</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 rounded-3xl border border-[#eadfc8] bg-white p-6 shadow-sm h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-[#f0e6d6]">
            <div className="flex items-center gap-2 font-serif font-bold text-base text-[#2b2119]">
              <Filter size={16} className="text-[#b89767]" /> Ֆիլտրեր
            </div>
            {(selectedCategory !== 'Բոլորը' ||
              selectedBrand !== 'Բոլորը' ||
              selectedAudience !== 'Բոլորը' ||
              search.trim()) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-[#b89767] hover:underline flex items-center gap-1"
              >
                <RotateCcw size={11} /> Մաքրել
              </button>
            )}
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a685e] mb-2">
              Որոնում
            </label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Մոդել, բրենդ..."
                className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2 text-xs text-[#2b2119] focus:outline-hidden"
              />
              <Search size={14} className="absolute right-3 top-2.5 text-[#a89588]" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a685e] mb-2.5">
              Կատեգորիա
            </label>
            <div className="flex flex-col gap-1.5">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#33271d] text-[#caaf83] font-bold'
                      : 'text-[#4d3d33] hover:bg-[#faf5ef]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Audience Filter */}
          <div className="pt-4 border-t border-[#f0e6d6]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a685e] mb-2.5">
              Հասցեատեր (Սեգմենտ)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_AUDIENCES.map((aud) => (
                <button
                  type="button"
                  key={aud}
                  onClick={() => setSelectedAudience(aud)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedAudience === aud
                      ? 'border-[#33271d] bg-[#33271d] text-[#caaf83]'
                      : 'border-[#eadfc8] bg-[#faf5ef] text-[#4d3d33] hover:border-[#caaf83]'
                  }`}
                >
                  {aud}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="pt-4 border-t border-[#f0e6d6]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a685e] mb-2.5">
              Բրենդներ
            </label>
            <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto">
              {ALL_BRANDS.map((br) => (
                <button
                  type="button"
                  key={br}
                  onClick={() => setSelectedBrand(br)}
                  className={`text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    selectedBrand.toLowerCase() === br.toLowerCase()
                      ? 'bg-[#b89767] text-white font-bold'
                      : 'text-[#4d3d33] hover:bg-[#faf5ef]'
                  }`}
                >
                  {br}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Filter Modal/Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 lg:hidden">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 max-h-[85vh] overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#eadfc8]">
                <h3 className="font-serif font-bold text-lg text-[#2b2119]">Ֆիլտրեր</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-[#7a685e]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[#7a685e] mb-2">Կատեգորիա</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                        selectedCategory === cat
                          ? 'bg-[#33271d] text-[#caaf83] border-[#33271d]'
                          : 'bg-[#faf5ef] border-[#eadfc8]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience */}
              <div>
                <label className="block text-xs font-bold text-[#7a685e] mb-2">Հասցեատեր</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_AUDIENCES.map((aud) => (
                    <button
                      key={aud}
                      type="button"
                      onClick={() => setSelectedAudience(aud)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                        selectedAudience === aud
                          ? 'bg-[#33271d] text-[#caaf83] border-[#33271d]'
                          : 'bg-[#faf5ef] border-[#eadfc8]'
                      }`}
                    >
                      {aud}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs font-bold text-[#7a685e] mb-2">Բրենդ</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_BRANDS.map((br) => (
                    <button
                      key={br}
                      type="button"
                      onClick={() => setSelectedBrand(br)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                        selectedBrand === br
                          ? 'bg-[#b89767] text-white border-[#b89767]'
                          : 'bg-[#faf5ef] border-[#eadfc8]'
                      }`}
                    >
                      {br}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#eadfc8]">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex-1 py-3 rounded-full border border-[#eadfc8] text-xs font-semibold text-[#4d3d33]"
                >
                  Մաքրել
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-full bg-[#33271d] text-[#caaf83] text-xs font-semibold uppercase tracking-wider"
                >
                  Կիրառել ({filtered.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <section>
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#caaf83] bg-white p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#faf5ef] text-[#b89767] flex items-center justify-center mx-auto">
                <Search size={28} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#2b2119]">
                Ապրանքներ չեն գտնվել
              </h3>
              <p className="text-xs text-[#7a685e] max-w-md mx-auto">
                Ձեր ընտրած չափանիշներով մոդելներ չկան: Փորձեք փոխել ֆիլտրերը կամ մաքրել որոնման դաշտը:
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-full bg-[#33271d] text-[#caaf83] text-xs font-semibold uppercase tracking-wider"
              >
                Մաքրել բոլոր ֆիլտրերը
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
