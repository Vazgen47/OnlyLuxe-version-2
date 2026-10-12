import { useState } from 'react';
import { ChevronDown, Send, PhoneCall } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Ապրանքներ և Որակ',
    q: 'Ինչպե՞ս է ստուգվում ժամացույցների և պայուսակների որակը:',
    a: 'Յուրաքանչյուր ապրանք մեր մասնագետների կողմից անցնում է բազմափուլ որակի ստուգում: Ժամացույցները թեստավորվում են հատուկ էլեկտրոնային ժամանակաչափ սարքերով՝ մեխանիզմի ճշգրտության և ջրակայունության համար: Պայուսակներն ու դրամապանակները ստուգվում են բնական կաշվի ամրության, կարերի և ֆուրնիտուրայի մասով:',
  },
  {
    category: 'Ապրանքներ և Որակ',
    q: 'Արդյո՞ք ապրանքներն ունեն հատուկ նվեր-փաթեթավորում:',
    a: 'Այո, OnlyLuxe-ի բոլոր ժամացույցներն ու պայուսակներն առաքվում են պրեմիում դասի ֆիրմային տուփերով, փաստաթղթերի պահոցով և պաշտոնական երաշխիքային քարտով: Այն պատրաստ է անմիջապես նվիրելու համար:',
  },
  {
    category: 'Երաշխիք և Սպասարկում',
    q: 'Որքա՞ն ժամանակ է գործում երաշխիքը:',
    a: 'Մեր բոլոր ժամացույցների համար տրամադրվում է 2 տարվա պաշտոնական երաշխիք մեխանիզմի աշխատանքի համար: Պայուսակների և դրամապանակների համար գործում է 1 տարվա երաշխիք կարերի և ֆուրնիտուրայի համար:',
  },
  {
    category: 'Առաքում և Վճարում',
    q: 'Կարո՞ղ եմ նախ ստուգել ապրանքը, հետո վճարել:',
    a: 'Միանշանակ այո: Առաքիչը ապրանքը բերում է ձեր նշած հասցեով, դուք բացում եք տուփը, ստուգում եք ապրանքի տեսքը, չափսը և որակը, և միայն ամբողջական գոհունակության դեպքում կատարում եք վճարումը:',
  },
  {
    category: 'Առաքում և Վճարում',
    q: 'Վճարման ի՞նչ եղանակներ են հասանելի:',
    a: 'Հասանելի է կանխիկ վճարում առաքիչին, բանկային քարտով վճարում տեղում (POS տերմինալով), ինչպես նաև Idram, Telcell Wallet կամ բանկային փոխանցում:',
  },
  {
    category: 'Վերադարձ և Փոխանակում',
    q: 'Հնարավո՞ր է արդյոք ապրանքի փոխանակում կամ վերադարձ:',
    a: 'Այո, համաձայն ՀՀ օրենսդրության՝ դուք կարող եք փոխանակել կամ վերադարձնել ապրանքը 14 օրվա ընթացքում, եթե այն չունի օգտագործման հետքեր, պահպանված են բոլոր պիտակները, փաթեթավորումը և գնման կտրոնը:',
  },
];

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
          Հարցեր և Պատասխաններ
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2b2119]">
          Հաճախ տրվող հարցեր
        </h1>
        <p className="text-sm text-[#736358] leading-relaxed">
          Այստեղ ամփոփված են մեր հաճախորդներին առավել հաճախ հետաքրքրող հարցերը: Եթե ձեր հարցի պատասխանը չգտաք, գրեք մեզ:
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl bg-white border border-[#eadfc8] overflow-hidden shadow-xs transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-serif font-semibold text-[#2b2119] hover:text-[#b89767] transition-colors"
              >
                <span className="pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#b89767] transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#635247] leading-relaxed border-t border-[#f2ece2]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Banner */}
      <div className="p-8 rounded-3xl bg-[#33271d] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-serif text-xl font-bold">Մնացի՞ն այլ հարցեր</h3>
          <p className="text-xs text-[#c7b9ab] mt-1">Մեր խորհրդատուները պատրաստ են օգնել ձեզ ամեն պահի:</p>
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
