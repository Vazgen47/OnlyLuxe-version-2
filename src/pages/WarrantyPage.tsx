import { ShieldCheck, Wrench, CheckCircle, AlertTriangle, PhoneCall, Send } from 'lucide-react';


export function WarrantyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
          Վստահություն և Երաշխիք
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2b2119]">
          Պաշտոնական 2 տարվա երաշխիք
        </h1>
        <p className="text-sm text-[#736358] leading-relaxed">
          OnlyLuxe-ը տրամադրում է պաշտոնական երաշխիքային սպասարկում իր բոլոր ապրանքների համար:
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-8 rounded-3xl bg-white border border-[#eadfc8] shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#faf5ef] text-[#b89767] flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#2b2119]">Ժամացույցների երաշխիք (2 տարի)</h3>
          <p className="text-xs text-[#6e5d52] leading-relaxed">
            Ներառում է ավտոմատիկ և կվարցային մեխանիզմների անխափան աշխատանքի ապահովում:
          </p>
          <ul className="text-xs text-[#6e5d52] space-y-2 pt-2 border-t border-[#f2ece2]">
            <li>✓ Մեխանիզմի անսարքության անվճար կարգավորում կամ փոխարինում</li>
            <li>✓ Ժամանակաչափի և քրոնոգրաֆի ճշգրտության ստուգում</li>
            <li>✓ Գործարանային թերությունների անվճար վերացում</li>
          </ul>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#eadfc8] shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#faf5ef] text-[#b89767] flex items-center justify-center">
            <Wrench size={24} />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#2b2119]">Պայուսակների երաշխիք (1 տարի)</h3>
          <p className="text-xs text-[#6e5d52] leading-relaxed">
            Երաշխավորում է բնական կաշվի կարերի և մետաղական ֆուրնիտուրայի բարձր դիմացկունությունը:
          </p>
          <ul className="text-xs text-[#6e5d52] space-y-2 pt-2 border-t border-[#f2ece2]">
            <li>✓ Կայծակաճարմանդների և փականների անվճար վերանորոգում</li>
            <li>✓ Կաշվե ուսագոտիների և կարերի ամրության սպասարկում</li>
            <li>✓ Ֆուրնիտուրայի փոխարինում բնօրինակ մասերով</li>
          </ul>
        </div>
      </div>

      {/* What is covered vs not covered */}
      <div className="rounded-3xl bg-white border border-[#eadfc8] p-8 shadow-xs space-y-6">
        <h2 className="font-serif text-2xl font-bold text-[#2b2119]">
          Երաշխիքային սպասարկման կանոններ
        </h2>

        <div className="grid gap-6 md:grid-cols-2 text-xs text-[#5d4c42] leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-[#2b593f] flex items-center gap-1.5">
              <CheckCircle size={16} /> Ի՞նչն է ներառված
            </h4>
            <p>
              Մեխանիզմի կանգնելը կամ շեղումը նորմայից, թվատախտակի տարրերի ինքնակամ շեղումը, գործարանային ջրակայունության թերությունները, կաշվե ապրանքների կարերի թուլացումը:
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-[#a94442] flex items-center gap-1.5">
              <AlertTriangle size={16} /> Ի՞նչը ներառված չէ
            </h4>
            <p>
              Մեխանիկական հարվածից առաջացած կոտրվածքներ (ապակու կոտրվել, խորը քերծվածքներ), ջրի տակ ժամացույցի գլխիկը բացելու հետևանքով ջրի ներթափանցում, ոչ լիցենզավորված արհեստանոցում բացելու փորձեր:
            </p>
          </div>
        </div>
      </div>

      {/* Support Action */}
      <div className="p-8 rounded-3xl bg-[#33271d] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-serif text-xl font-bold">Երաշխիքային դիմո՞ւմ ունեք</h3>
          <p className="text-xs text-[#c7b9ab] mt-1">Դիմեք մեր սպասարկման կենտրոնին՝ նշելով պատվերի համարը:</p>
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
            <Send size={14} /> Telegram աջակցություն
          </a>
        </div>
      </div>
    </div>
  );
}
