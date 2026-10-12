import { useState } from 'react';
import { Phone, MapPin, Clock, Send, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { TikTokIcon } from '../components/Layout';

export function ContactPage() {
  const { sendMessage } = useStore();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('Խնդրում ենք լրացնել անունը, հեռախոսահամարը և հաղորդագրությունը:');
      return;
    }

    setSending(true);
    try {
      await sendMessage({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        message: form.message.trim(),
      });
      setSent(true);
      setForm({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      console.error('[OnlyLuxe] Failed to send contact message:', err);
      setError('Չհաջողվեց ուղարկել հաղորդագրությունը: Խնդրում ենք կապվել Telegram-ով կամ զանգահարել:');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-20 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
          OnlyLuxe × iCloneEvn Boutique
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2b2119]">
          Կապ մեզ հետ
        </h1>
        <p className="text-sm text-[#736358] leading-relaxed">
          Մենք պատրաստ ենք պատասխանել ձեր բոլոր հարցերին, ցուցադրել ապրանքների տեսանյութերը կամ կազմակերպել էքսպրես առաքում:
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#eadfc8] shadow-xs space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#2b2119]">
              Կոնտակտային տվյալներ
            </h3>

            <div className="space-y-4 text-xs text-[#5d4c42]">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#faf5ef] text-[#b89767]">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="text-[11px] text-[#918175] block">Հեռախոսահամար</span>
                  <a href="tel:+37455316191" className="text-sm font-bold text-[#2b2119] hover:text-[#b89767]">
                    055-31-61-91
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#faf5ef] text-[#b89767]">
                  <Send size={18} />
                </div>
                <div>
                  <span className="text-[11px] text-[#918175] block">Telegram ալիք և պատվերներ</span>
                  <a
                    href="https://t.me/+sAs7VSzcRhhjOTFi"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-[#b89767] hover:underline"
                  >
                    t.me/+sAs7VSzcRhhjOTFi
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#faf5ef] text-[#b89767]">
                  <Camera size={18} />
                </div>
                <div>
                  <span className="text-[11px] text-[#918175] block">Instagram</span>
                  <a
                    href="https://www.instagram.com/onlyluxe.evn/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-[#2b2119] hover:text-[#b89767]"
                  >
                    @onlyluxe.evn
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#faf5ef] text-[#b89767]">
                  <TikTokIcon size={18} />
                </div>
                <div>
                  <span className="text-[11px] text-[#918175] block">TikTok</span>
                  <a
                    href="https://www.tiktok.com/@onlyluxe.evn"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-[#2b2119] hover:text-[#b89767]"
                  >
                    @onlyluxe.evn
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#faf5ef] text-[#b89767]">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-[11px] text-[#918175] block">Հասցե</span>
                  <span className="text-xs text-[#2b2119] font-medium">Ք․ Երևան, Կենտրոն</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#faf5ef] text-[#b89767]">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="text-[11px] text-[#918175] block">Աշխատանքային ժամեր</span>
                  <span className="text-xs text-[#2b2119] font-medium">10:00 - 22:00 (Ամեն օր)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Quick Box */}
          <div className="p-6 rounded-3xl bg-[#33271d] text-white space-y-3">
            <h4 className="font-serif text-base font-bold">Արագ կապ սոց․ ցանցերով</h4>
            <p className="text-xs text-[#c7b9ab] leading-relaxed">
              Գրեք մեզ Telegram-ով կամ Instagram-ի Direct-ով՝ անհապաղ պատասխան ստանալու համար:
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <a
                href="https://t.me/+sAs7VSzcRhhjOTFi"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 rounded-full bg-[#b89767] text-[#241a13] font-semibold text-xs hover:bg-[#caaf83] transition-colors"
              >
                Telegram
              </a>
              <a
                href="https://www.instagram.com/onlyluxe.evn/"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 rounded-full border border-[#caaf83] text-white font-semibold text-xs hover:bg-white/10 transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@onlyluxe.evn"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 rounded-full border border-[#caaf83] text-white font-semibold text-xs hover:bg-white/10 transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 rounded-3xl bg-white border border-[#eadfc8] shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-bold text-[#2b2119]">
            Ուղարկել հաղորդագրություն
          </h3>

          {error && (
            <div className="p-3.5 rounded-xl bg-[#fdf2f2] border border-[#f5c6cb] text-xs text-[#a94442] flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {sent ? (
            <div className="p-6 rounded-2xl bg-[#f0f9f3] border border-[#a3d9b4] text-center space-y-2">
              <CheckCircle2 size={32} className="text-[#2b593f] mx-auto" />
              <div className="font-serif text-base font-bold text-[#2b593f]">
                Ձեր հաղորդագրությունն ուղարկված է
              </div>
              <p className="text-xs text-[#527a61]">
                Շնորհակալություն! Մեր մենեջերը շուտով կկապվի ձեզ հետ նշված հեռախոսահամարով:
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4d3d33] mb-1">
                  Ձեր անունը *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Օրինակ՝ Արմեն Ղազարյան"
                  className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-xs text-[#2b2119] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4d3d33] mb-1">
                  Հեռախոսահամար *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="099-XX-XX-XX"
                  className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-xs text-[#2b2119] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4d3d33] mb-1">
                  Էլեկտրոնային հասցե (ըստ ցանկության)
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-xs text-[#2b2119] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4d3d33] mb-1">
                  Հաղորդագրություն կամ հարց *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Գրեք ձեզ հետաքրքրող ապրանքի, առաքման կամ մոդելի մասին..."
                  className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-xs text-[#2b2119] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 rounded-full bg-[#33271d] text-[#caaf83] font-serif font-bold text-xs uppercase tracking-wider hover:bg-[#201712] transition-colors shadow-md disabled:opacity-70"
              >
                {sending ? 'Ուղարկվում է...' : 'Ուղարկել հաղորդագրությունը'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
