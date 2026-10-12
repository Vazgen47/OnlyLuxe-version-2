import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  Clock,
  PhoneCall,
  Send,
  Star,
  Award,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

const watchBrands = [
  { name: 'Rolex', desc: 'Լեգենդար հուսալիություն' },
  { name: 'Patek Philippe', desc: 'Ժամագործության բարձրակետ' },
  { name: 'Audemars Piguet', desc: 'Ավանգարդ շքեղություն' },
  { name: 'Hublot', desc: 'Նորարարական միաձուլում' },
  { name: 'Omega', desc: 'Շվեյցարական պատմություն' },
  { name: 'Tissot', desc: 'Դասական ճշգրտություն' },
];

export function HomePage() {
  const { products, siteSettings } = useStore();

  const featuredProducts = products.filter((p) => p.featured && p.isActive).slice(0, 8);
  const newArrivals = products.filter((p) => p.isActive).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#241a13] via-[#33271d] to-[#1c140e] text-[#f4ecdf] py-20 sm:py-28 lg:py-36 border-b border-[#caaf83]/20">
        {/* Subtle Luxury Pattern / Glow */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#caaf83_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#b89767]/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#caaf83]/40 bg-[#3d2f23]/80 backdrop-blur-md text-[11px] font-semibold uppercase tracking-[0.2em] text-[#caaf83] mb-6 shadow-sm"
          >
            <Sparkles size={13} /> OnlyLuxe Atelier · Yerevan
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight"
          >
            {siteSettings.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-sm sm:text-base lg:text-lg text-[#d9cbbd] max-w-2xl mx-auto leading-relaxed"
          >
            {siteSettings.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/catalog"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#b89767] to-[#caaf83] text-[#241a13] font-serif font-bold text-sm tracking-wide uppercase hover:from-[#c2a272] hover:to-[#d4ba90] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Բացել կատալոգը
            </Link>
            <Link
              to="/watches"
              className="px-8 py-3.5 rounded-full border border-[#caaf83]/60 bg-[#33271d]/60 text-white font-serif font-semibold text-sm tracking-wide uppercase hover:bg-[#33271d] hover:border-[#caaf83] transition-all backdrop-blur-xs"
            >
              Ժամացույցներ
            </Link>
            <a
              href="https://t.me/+sAs7VSzcRhhjOTFi"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/10 bg-white/5 text-[#f4ecdf] text-xs font-semibold hover:bg-white/10 transition-colors"
            >
              <Send size={14} className="text-[#caaf83]" /> Խորհրդատվություն
            </a>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#eadfc8] shadow-xs">
            <div className="p-3 rounded-xl bg-[#faf5ef] text-[#b89767]">
              <Award size={24} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#2b2119]">Պրեմիում ստուգված որակ</h4>
              <p className="text-xs text-[#736358] mt-1">Բոլոր մեխանիզմների ու կաշվի նախնական թեստավորում:</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#eadfc8] shadow-xs">
            <div className="p-3 rounded-xl bg-[#faf5ef] text-[#b89767]">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#2b2119]">Անվճար առաքում Երևանում</h4>
              <p className="text-xs text-[#736358] mt-1">Արագ և ապահովագրված առաքում մինչև ձեր դուռը:</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#eadfc8] shadow-xs">
            <div className="p-3 rounded-xl bg-[#faf5ef] text-[#b89767]">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#2b2119]">2 տարվա երաշխիք</h4>
              <p className="text-xs text-[#736358] mt-1">Պաշտոնական սպասարկման կենտրոնի երաշխիք:</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#eadfc8] shadow-xs">
            <div className="p-3 rounded-xl bg-[#faf5ef] text-[#b89767]">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#2b2119]">24/7 Աջակցություն</h4>
              <p className="text-xs text-[#736358] mt-1">Telegram և հեռախոսային անձնական կապ:</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
            Հավաքածուներ
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2b2119] mt-2">
            Հիմնական կատեգորիաներ
          </h2>
          <p className="text-xs sm:text-sm text-[#736358] mt-2">
            Ընտրեք ձեր ոճին համապատասխան բացառիկ աքսեսուարը
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Category 1: Watches */}
          <Link
            to="/watches"
            className="group relative h-96 rounded-3xl overflow-hidden border border-[#eadfc8] shadow-md flex flex-col justify-end p-8 transition-transform duration-500 hover:-translate-y-1"
          >
            <img
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80"
              alt="Շվեյցարական ժամացույցներ"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1714] via-[#1f1714]/60 to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#caaf83]">
                Rolex · Patek Philippe · AP
              </span>
              <h3 className="font-serif text-2xl font-bold mt-1">Ժամացույցներ</h3>
              <p className="text-xs text-[#d9cbbd] mt-2 line-clamp-2">
                Շվեյցարական ավտոմատիկ մեխանիզմներ, սապֆիրե ապակի և բարձրագույն ճշգրտություն:
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#caaf83] group-hover:translate-x-1 transition-transform">
                Դիտել հավաքածուն <ArrowRight size={14} />
              </div>
            </div>
          </Link>

          {/* Category 2: Bags */}
          <Link
            to="/bags"
            className="group relative h-96 rounded-3xl overflow-hidden border border-[#eadfc8] shadow-md flex flex-col justify-end p-8 transition-transform duration-500 hover:-translate-y-1"
          >
            <img
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
              alt="Կաշվե պայուսակներ"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1714] via-[#1f1714]/60 to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#caaf83]">
                100% Բնական իտալական կաշի
              </span>
              <h3 className="font-serif text-2xl font-bold mt-1">Պայուսակներ</h3>
              <p className="text-xs text-[#d9cbbd] mt-2 line-clamp-2">
                Ձեռագործ կանացի և տղամարդու ճամփորդական ու առօրյա էլեգանտ պայուսակներ:
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#caaf83] group-hover:translate-x-1 transition-transform">
                Դիտել հավաքածուն <ArrowRight size={14} />
              </div>
            </div>
          </Link>

          {/* Category 3: Wallets */}
          <Link
            to="/wallets"
            className="group relative h-96 rounded-3xl overflow-hidden border border-[#eadfc8] shadow-md flex flex-col justify-end p-8 transition-transform duration-500 hover:-translate-y-1"
          >
            <img
              src="https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
              alt="Դրամապանակներ"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1714] via-[#1f1714]/60 to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#caaf83]">
                RFID Պաշտպանություն · Slim
              </span>
              <h3 className="font-serif text-2xl font-bold mt-1">Դրամապանակներ</h3>
              <p className="text-xs text-[#d9cbbd] mt-2 line-clamp-2">
                Կոմպակտ, բարձրորակ դրամապանակներ տղամարդկանց և կանանց համար:
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#caaf83] group-hover:translate-x-1 transition-transform">
                Դիտել հավաքածուն <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Audience Segment Filters */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#33271d] text-white border border-[#caaf83]/30 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid gap-8 lg:grid-cols-3 items-center">
            <div className="lg:col-span-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#caaf83]">
                Սեգմենտներ
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
                Ընտրեք ըստ հասցեատիրոջ
              </h3>
              <p className="text-xs text-[#d9cbbd] mt-3 leading-relaxed">
                Գտեք իդեալական նվեր կամ համալրեք ձեր զգեստապահարանը բարձրաճաշակ դետալներով:
              </p>
            </div>

            <div className="lg:col-span-2 grid gap-4 sm:grid-cols-3">
              <Link
                to="/men"
                className="p-5 rounded-2xl bg-[#251b14] border border-[#3f3126] hover:border-[#caaf83] transition-colors text-center group"
              >
                <div className="text-base font-serif font-bold text-white group-hover:text-[#caaf83]">
                  Տղամարդու
                </div>
                <div className="text-[11px] text-[#a8988d] mt-1">Քրոնոգրաֆներ, դաֆլ պայուսակներ, bifold</div>
                <div className="mt-4 text-xs text-[#caaf83] font-semibold">Տեսնել →</div>
              </Link>

              <Link
                to="/women"
                className="p-5 rounded-2xl bg-[#251b14] border border-[#3f3126] hover:border-[#caaf83] transition-colors text-center group"
              >
                <div className="text-base font-serif font-bold text-white group-hover:text-[#caaf83]">
                  Կանացի
                </div>
                <div className="text-[11px] text-[#a8988d] mt-1">Ադամանդյա թվատախտակներ, շքեղ պայուսակներ</div>
                <div className="mt-4 text-xs text-[#caaf83] font-semibold">Տեսնել →</div>
              </Link>

              <Link
                to="/couples"
                className="p-5 rounded-2xl bg-[#251b14] border border-[#3f3126] hover:border-[#caaf83] transition-colors text-center group"
              >
                <div className="text-base font-serif font-bold text-white group-hover:text-[#caaf83]">
                  Զույգերի (Couples)
                </div>
                <div className="text-[11px] text-[#a8988d] mt-1">Նույնական ոճի զույգ հավաքածուներ տուփով</div>
                <div className="mt-4 text-xs text-[#caaf83] font-semibold">Տեսնել →</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
              Ընտրված մոդելներ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2b2119] mt-1">
              Թոփ առաջարկներ
            </h2>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#33271d] hover:text-[#b89767] uppercase tracking-wider"
          >
            Դիտել բոլորը ({products.length}) <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Watch Brands Showcase */}
      <section className="bg-white py-16 border-y border-[#eadfc8]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-md mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
              Պրեմիում ապրանքանիշեր
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2b2119] mt-1">
              Շվեյցարական լեգենդար բրենդներ
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {watchBrands.map((brand) => (
              <Link
                key={brand.name}
                to={`/watches/${encodeURIComponent(brand.name)}`}
                className="p-5 rounded-2xl border border-[#eadfc8] bg-[#faf5ef] text-center hover:border-[#caaf83] hover:bg-white transition-all group"
              >
                <div className="font-serif text-lg font-bold text-[#2b2119] group-hover:text-[#b89767]">
                  {brand.name}
                </div>
                <div className="text-[10px] text-[#8a7b70] mt-1">{brand.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Grid */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
              Թարմ մուտք
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2b2119] mt-1">
              Նոր ժամանումներ
            </h2>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#33271d] hover:text-[#b89767] uppercase tracking-wider"
          >
            Ամբողջ կատալոգը <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* VIP Concierge / Direct Consultation Banner */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-[#241a13] to-[#382b20] p-8 sm:p-14 text-white border border-[#caaf83]/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#caaf83]">
              VIP Խորհրդատվություն
            </span>
            <h3 className="font-serif text-3xl font-bold leading-tight">
              Ցանկանո՞ւմ եք տեսնել ապրանքի տեսանյութը կամ պատվիրել անմիջապես
            </h3>
            <p className="text-xs sm:text-sm text-[#d9cbbd] leading-relaxed">
              Մեր մենեջերները կարող են տրամադրել ապրանքի իրական HD տեսանյութերը, պատասխանել չափսերի և երաշխիքի հարցերին կամ ձևակերպել էքսպրես առաքում:
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href="https://t.me/+sAs7VSzcRhhjOTFi"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#b89767] to-[#caaf83] text-[#241a13] font-semibold text-xs tracking-wider uppercase hover:shadow-lg transition-all"
            >
              <Send size={15} /> Գրել Telegram-ով
            </a>
            <a
              href="tel:+37455316191"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-[#caaf83] text-white hover:bg-white/10 font-semibold text-xs tracking-wider uppercase transition-all"
            >
              <PhoneCall size={15} className="text-[#caaf83]" /> 055-31-61-91
            </a>
          </div>
        </div>
      </section>

      {/* Customer Reviews / Testimonials */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-md mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
            Հաճախորդների կարծիքներ
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2b2119] mt-1">
            Ինչ են ասում մեր գնորդները
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-2xl bg-white border border-[#eadfc8] shadow-xs space-y-3">
            <div className="flex text-[#b89767] gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-[#615147] leading-relaxed">
              «Պատվիրեցի Rolex Submariner մոդելը: Որակը, քաշը և փաթեթավորումը գերազանցեցին սպասելիքներս: Առաքեցին Երևանում 2 ժամում: Շնորհակալություն OnlyLuxe!»
            </p>
            <div className="pt-2 text-xs font-bold text-[#2b2119]">Արմեն Ղ. (Երևան)</div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#eadfc8] shadow-xs space-y-3">
            <div className="flex text-[#b89767] gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-[#615147] leading-relaxed">
              «OnlyLuxe Verona պայուսակը ուղղակի գեղեցկություն է: Բնական կաշվի հոտը, կարերի ճշգրտությունը և ոսկյա փականը 10/10 են: Անպայման նորից կպատվիրեմ:»
            </p>
            <div className="pt-2 text-xs font-bold text-[#2b2119]">Անի Մ. (Երևան)</div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#eadfc8] shadow-xs space-y-3">
            <div className="flex text-[#b89767] gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-[#615147] leading-relaxed">
              «Զույգերի հավաքածուն վերցրեցինք տարեդարձի առթիվ: Հատուկ նվեր-տուփով, երաշխիքային կտրոնով: Շատ շքեղ է նայվում ձեռքին:»
            </p>
            <div className="pt-2 text-xs font-bold text-[#2b2119]">Դավիթ և Լիլիթ (Երևան)</div>
          </div>
        </div>
      </section>
    </div>
  );
}
