import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-24 sm:py-32 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-white border border-[#eadfc8] text-[#b89767] flex items-center justify-center mx-auto shadow-sm">
        <Compass size={32} />
      </div>

      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
        404 Սխալ
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2b2119]">
        Էջը չի գտնվել
      </h1>

      <p className="text-xs sm:text-sm text-[#736358] max-w-md mx-auto leading-relaxed">
        Ձեր փնտրած էջը տեղափոխվել է կամ գոյություն չունի: Կարող եք վերադառնալ գլխավոր էջ կամ դիտել մեր պրեմիում կատալոգը:
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#33271d] text-[#caaf83] font-semibold text-xs uppercase tracking-wider shadow-md hover:bg-[#201712] transition-colors"
        >
          <ArrowLeft size={14} /> Գլխավոր էջ
        </Link>
        <Link
          to="/catalog"
          className="px-6 py-3 rounded-full border border-[#eadfc8] bg-white text-[#2b2119] font-semibold text-xs uppercase tracking-wider hover:border-[#b89767] transition-colors"
        >
          Ամբողջ կատալոգը
        </Link>
      </div>
    </div>
  );
}
