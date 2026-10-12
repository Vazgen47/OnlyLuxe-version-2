import { Shield, Lock, Eye, FileText } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
          Անվտանգություն
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2b2119]">
          Գաղտնիության քաղաքականություն
        </h1>
        <p className="text-xs sm:text-sm text-[#736358]">
          Վերջին թարմացումը՝ Հոկտեմբեր 2026 թ.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-[#eadfc8] p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-[#5d4c42] leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#2b2119] flex items-center gap-2">
            <Shield size={18} className="text-[#b89767]" /> 1. Ընդհանուր դրույթներ
          </h2>
          <p>
            Սույն Գաղտնիության քաղաքականությունը սահմանում է, թե ինչպես է OnlyLuxe-ը (այսուհետ՝ Ընկերություն) հավաքագրում, օգտագործում և պաշտպանում օգտատերերի անձնական տվյալները կայքից օգտվելիս կամ պատվերներ կատարելիս:
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#2b2119] flex items-center gap-2">
            <FileText size={18} className="text-[#b89767]" /> 2. Հավաքագրվող տվյալներ
          </h2>
          <p>
            Պատվերի ձևակերպման կամ խորհրդատվության ընթացքում մենք կարող ենք խնդրել հետևյալ տեղեկությունները.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#635348]">
            <li>Անուն, ազգանուն</li>
            <li>Կոնտակտային հեռախոսահամար</li>
            <li>Էլեկտրոնային փոստի հասցե (ըստ ցանկության)</li>
            <li>Առաքման հասցե</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#2b2119] flex items-center gap-2">
            <Eye size={18} className="text-[#b89767]" /> 3. Տվյալների օգտագործման նպատակները
          </h2>
          <p>
            Հավաքագրված անձնական տվյալները օգտագործվում են բացառապես.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#635348]">
            <li>Պատվերների մշակման, հաստատման և ապրանքների առաքման համար,</li>
            <li>Հաճախորդի հետ կապ հաստատելու և ապրանքի կարգավիճակը ճշտելու համար,</li>
            <li>Երաշխիքային սպասարկման պատմության պահպանման համար:</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#2b2119] flex items-center gap-2">
            <Lock size={18} className="text-[#b89767]" /> 4. Անվտանգություն և Երրորդ անձինք
          </h2>
          <p>
            OnlyLuxe-ը չի վաճառում, չի վարձակալում և չի փոխանցում ձեր անձնական տվյալները որևէ երրորդ կողմի, բացառությամբ անմիջական առաքումն իրականացնող մեր սուրհանդակների: Մենք չենք պահպանում բանկային քարտերի գաղտնի տվյալներ (CVV/PIN):
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#2b2119]">5. Ձեր իրավունքները</h2>
          <p>
            Դուք ցանկացած պահի կարող եք դիմել մեզ՝ խնդրելով թարմացնել կամ ամբողջությամբ ջնջել ձեր կոնտակտային տվյալները մեր բազայից:
          </p>
        </section>
      </div>
    </div>
  );
}
