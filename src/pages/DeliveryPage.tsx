import { Truck, MapPin, PhoneCall, Send } from 'lucide-react';

export function DeliveryPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
          OnlyLuxe սպասարկում
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2b2119]">
          Առաքման պայմաններ
        </h1>
        <p className="text-sm text-[#736358] leading-relaxed">
          Մենք ապահովում ենք բացառիկ հուսալի, արագ և ապահովագրված առաքում Երևանում և Հայաստանի բոլոր մարզերում:
        </p>
      </div>

      {/* Grid of Key delivery options */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-8 rounded-3xl bg-white border border-[#eadfc8] shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#faf5ef] text-[#b89767] flex items-center justify-center">
            <Truck size={24} />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#2b2119]">Առաքում Երևանում</h3>
          <p className="text-xs text-[#6e5d52] leading-relaxed">
            Երևան քաղաքում առաքումն իրականացվում է <strong>անվճար</strong>՝ պատվերը հաստատելուց հետո 2-4 ժամվա ընթացքում:
          </p>
          <ul className="text-xs text-[#6e5d52] space-y-2 pt-2 border-t border-[#f2ece2]">
            <li>✓ Ապրանքի զննում առաքիչի ներկայությամբ նախքան վճարումը</li>
            <li>✓ Վճարում կանխիկ կամ բանկային քարտով (POS տերմինալ)</li>
            <li>✓ Հարմարեցված ժամի ընտրություն ըստ հաճախորդի</li>
          </ul>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#eadfc8] shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#faf5ef] text-[#b89767] flex items-center justify-center">
            <MapPin size={24} />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#2b2119]">Առաքում ՀՀ մարզեր</h3>
          <p className="text-xs text-[#6e5d52] leading-relaxed">
            ՀՀ բոլոր մարզեր առաքումն իրականացվում է արագընթաց փոստային կամ առաքիչ ծառայությունների միջոցով 1-2 աշխատանքային օրվա ընթացքում:
          </p>
          <ul className="text-xs text-[#6e5d52] space-y-2 pt-2 border-t border-[#f2ece2]">
            <li>✓ Ապահովագրված փաթեթավորում և տրեկինգ կոդ</li>
            <li>✓ Անվտանգություն և ամբողջականության երաշխիք</li>
            <li>✓ Մարզային առաքման արժեքը՝ 1,500 - 2,500 ֏ (կամ անվճար խոշոր պատվերների դեպքում)</li>
          </ul>
        </div>
      </div>

      {/* Step by step flow */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#eadfc8] shadow-xs space-y-6">
        <h2 className="font-serif text-2xl font-bold text-[#2b2119] text-center">
          Ինչպե՞ս է կատարվում պատվերը և առաքումը
        </h2>

        <div className="grid gap-6 sm:grid-cols-4 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#33271d] text-[#caaf83] font-serif font-bold text-sm flex items-center justify-center mx-auto">
              1
            </div>
            <h4 className="font-semibold text-xs text-[#2b2119]">Պատվերի գրանցում</h4>
            <p className="text-[11px] text-[#736358]">Կայքում, Telegram-ով կամ հեռախոսով:</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#33271d] text-[#caaf83] font-serif font-bold text-sm flex items-center justify-center mx-auto">
              2
            </div>
            <h4 className="font-semibold text-xs text-[#2b2119]">Հաստատում</h4>
            <p className="text-[11px] text-[#736358]">Մենեջերը ճշտում է հասցեն և ժամը:</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#33271d] text-[#caaf83] font-serif font-bold text-sm flex items-center justify-center mx-auto">
              3
            </div>
            <h4 className="font-semibold text-xs text-[#2b2119]">Որակի ստուգում</h4>
            <p className="text-[11px] text-[#736358]">Պատվերը փաթեթավորվում է տուփով:</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#33271d] text-[#caaf83] font-serif font-bold text-sm flex items-center justify-center mx-auto">
              4
            </div>
            <h4 className="font-semibold text-xs text-[#2b2119]">Առաքում և վճարում</h4>
            <p className="text-[11px] text-[#736358]">Ստուգում եք ապրանքը և վճարում:</p>
          </div>
        </div>
      </div>

      {/* Quick Contact Banner */}
      <div className="p-8 rounded-3xl bg-[#33271d] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-serif text-xl font-bold">Հարցեր ունե՞ք առաքման մասին</h3>
          <p className="text-xs text-[#c7b9ab] mt-1">Կապվեք մեր առաքման համակարգողի հետ:</p>
        </div>
        <div className="flex gap-3">
          <a
            href="tel:+37455316191"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#caaf83] text-xs font-semibold hover:bg-white/10"
          >
            <PhoneCall size={14} className="text-[#caaf83]" /> 055-31-61-91
          </a>
          <a
            href="https://t.me/+sAs7VSzcRhhjOTFi"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#b89767] text-[#241a13] text-xs font-semibold"
          >
            <Send size={14} /> Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
