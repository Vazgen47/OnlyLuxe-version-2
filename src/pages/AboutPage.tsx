import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-20 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
          Մեր պատմությունը
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2b2119]">
          OnlyLuxe — Շքեղության արվեստը Երևանում
        </h1>
        <p className="text-sm text-[#736358] leading-relaxed">
          Ստեղծված նրանց համար, ովքեր գնահատում են անթերի ճշգրտությունը, բարձրորակ նյութերը և անկրկնելի էսթետիկան:
        </p>
      </div>

      {/* Main Story Box */}
      <div className="rounded-3xl bg-white border border-[#eadfc8] p-8 sm:p-12 shadow-sm space-y-6 text-xs sm:text-sm text-[#5c4a3f] leading-relaxed">
        <p>
          <strong>OnlyLuxe EVN</strong>-ը հիմնադրվել է որպես նրբագեղ, ժամանակակից շքեղ ապրանքների բուտիկ՝ նպատակ ունենալով հայ սպառողին հասանելի դարձնել համաշխարհային ժամագործության և կաշվե ատելյեի բարձրագույն նմուշները:
        </p>

        <p>
          Մեր փիլիսոփայության հիմքում ընկած է այն համոզմունքը, որ իսկական շքեղությունը միայն գինը կամ ապրանքանիշը չէ, այլ <strong>զգացողությունը, նյութերի որակը և վարպետությունը</strong>: Մեր ներկայացրած յուրաքանչյուր ժամացույց (Rolex, Patek Philippe, Audemars Piguet, Hublot, Omega, Tissot) և յուրաքանչյուր կաշվե պայուսակ անցնում է մանրակրկիտ ստուգում՝ ապահովելու անթերի աշխատանք և տեսողական կատարելություն:
        </p>

        <div className="grid gap-6 sm:grid-cols-3 py-6 border-y border-[#f2ece2] text-center">
          <div className="space-y-1">
            <div className="font-serif text-2xl font-bold text-[#b89767]">100%</div>
            <div className="text-xs text-[#736358]">Որակի փորձարկում</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-2xl font-bold text-[#b89767]">2 Տարի</div>
            <div className="text-xs text-[#736358]">Պաշտոնական երաշխիք</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-2xl font-bold text-[#b89767]">24/7</div>
            <div className="text-xs text-[#736358]">Անհատական սպասարկում</div>
          </div>
        </div>

        <p>
          Մենք հավատարիմ ենք հաճախորդի հետ անկեղծ, երկարաժամկետ հարաբերություններ կառուցելու սկզբունքին: Մեր թիմը միշտ պատրաստ է տրամադրել մանրամասն խորհրդատվություն, ապահովել անվճար ապահովագրված առաքում Երևանում և տրամադրել մասնագիտական սպասարկում:
        </p>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-[#33271d] text-white p-8 sm:p-10 text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold">
          Պատրա՞ստ եք ընտրել ձեր բացառիկ մոդելը
        </h3>
        <p className="text-xs text-[#c7b9ab] max-w-md mx-auto">
          Դիտեք մեր վերջին հավաքածուն կամ այցելեք մեր Instagram էջը նոր մոդելների տեսանյութերի համար:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/catalog"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#b89767] to-[#caaf83] text-[#241a13] font-serif font-bold text-xs uppercase tracking-wider"
          >
            Բացել կատալոգը
          </Link>
          <a
            href="https://www.instagram.com/onlyluxe.evn/"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-full border border-[#caaf83] text-white text-xs font-semibold hover:bg-white/10 transition-colors"
          >
            Instagram: @onlyluxe.evn
          </a>
        </div>
      </div>
    </div>
  );
}
