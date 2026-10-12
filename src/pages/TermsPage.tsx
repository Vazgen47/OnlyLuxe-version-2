import { FileText, CheckCircle, Scale } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
          Իրավական տեղեկատվություն
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2b2119]">
          Օգտագործման կանոններ
        </h1>
        <p className="text-xs sm:text-sm text-[#736358]">
          Վերջին թարմացումը՝ Հոկտեմբեր 2026 թ.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-[#eadfc8] p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-[#5d4c42] leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#2b2119] flex items-center gap-2">
            <Scale size={18} className="text-[#b89767]" /> 1. Ընդհանուր դրույթներ
          </h2>
          <p>
            Սույն օգտագործման կանոնները (այսուհետ՝ Կանոններ) կարգավորում են OnlyLuxe EVN հարթակի և օգտատերերի միջև ապրանքների ընտրության, պատվիրման և առաքման իրավահարաբերությունները: Կայքից օգտվելով կամ պատվեր գրանցելով՝ դուք համաձայնում եք սույն Կանոններին:
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#2b2119] flex items-center gap-2">
            <CheckCircle size={18} className="text-[#b89767]" /> 2. Պատվերի ձևակերպում և գներ
          </h2>
          <p>
            Կայքում նշված բոլոր գները արտահայտված են ՀՀ դրամով (֏): Պատվերը համարվում է ընդունված այն պահից, երբ OnlyLuxe-ի մենեջերը հաստատում է պատվերը հեռախոսազանգով կամ Telegram-ի հաղորդագրությամբ:
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#2b2119] flex items-center gap-2">
            <FileText size={18} className="text-[#b89767]" /> 3. Առաքում և Վճարում
          </h2>
          <p>
            Երևան քաղաքում առաքումն իրականացվում է անվճար: Գնորդն իրավունք ունի զննել ապրանքը առաքիչի ներկայությամբ նախքան վճարումը: Վճարումն ընդունվում է կանխիկ, բանկային քարտով կամ էլեկտրոնային դրամապանակներով:
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#2b2119]">4. Վերադարձ և Փոխանակում</h2>
          <p>
            Համաձայն ՀՀ «Սպառողների իրավունքների պաշտպանության մասին» օրենքի՝ գնորդն իրավունք ունի վերադարձնել կամ փոխանակել պատշաճ որակի ապրանքը 14 օրվա ընթացքում, եթե պահպանված են ապրանքի ապրանքային տեսքը, սպառողական հատկությունները, կապարակնիքները, ապրանքային պիտակները, ինչպես նաև վաճառված ապրանքի հետ սպառողին տրված ապրանքային կամ դրամարկղային չեկը:
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#2b2119]">5. Երաշխիք</h2>
          <p>
            Բոլոր ժամացույցների համար գործում է 2 տարվա գործարանային երաշխիք, իսկ կաշվե աքսեսուարների համար՝ 1 տարվա երաշխիք: Երաշխիքային սպասարկումը կարգավորվում է ապրանքին կից երաշխիքային կտրոնով:
          </p>
        </section>
      </div>
    </div>
  );
}
