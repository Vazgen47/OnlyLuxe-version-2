import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  Minus,
  Plus,
  Send,
  Phone,
  CheckCircle2,
  Copy,
  Check,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../components/ProductCard';
import type { OrderRecord } from '../types';

export function CartPage() {
  const { cart, products, removeFromCart, updateCartQuantity, clearCart, addOrder } = useStore();

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartDetails = useMemo(() => {
    return cart
      .map((item) => {
        const prod = products.find((p) => p.id === item.id);
        return prod ? { product: prod, quantity: item.quantity } : null;
      })
      .filter(Boolean) as Array<{ product: (typeof products)[number]; quantity: number }>;
  }, [cart, products]);

  const subtotal = useMemo(() => {
    return cartDetails.reduce((sum, item) => sum + item.product.priceAMD * item.quantity, 0);
  }, [cartDetails]);

  const orderSummaryText = useMemo(() => {
    if (!confirmedOrder && cartDetails.length === 0) return '';
    const items = confirmedOrder ? confirmedOrder.items : cartDetails.map((c) => ({
      title: c.product.title,
      quantity: c.quantity,
      priceAMD: c.product.priceAMD,
    }));
    const total = confirmedOrder ? confirmedOrder.totalAMD : subtotal;

    const list = items
      .map((it) => `• ${it.title} (x${it.quantity}) - ${formatPrice(it.priceAMD * it.quantity)}`)
      .join('\n');

    return `Պատվեր OnlyLuxe EVN-ից:\n${list}\n\nԸնդհանուր գումար՝ ${formatPrice(total)}\nՀաճախորդ՝ ${customer.name || 'Նշված չէ'}\nՀեռախոս՝ ${customer.phone || 'Նշված չէ'}\nՀասցե՝ ${customer.address || 'Երևան'}`;
  }, [confirmedOrder, cartDetails, subtotal, customer]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customer.name.trim() || !customer.phone.trim()) {
      setError('Խնդրում ենք լրացնել ձեր անունը և հեռախոսահամարը:');
      return;
    }

    if (cartDetails.length === 0) {
      setError('Զամբյուղը դատարկ է:');
      return;
    }

    setSubmitting(true);

    try {
      const orderId = `OL-${Date.now().toString().slice(-6)}`;
      const order: OrderRecord = {
        id: orderId,
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email.trim() || 'Չի նշվել',
        address: customer.address.trim() || 'Երևան',
        notes: customer.notes.trim() || '',
        status: 'new',
        createdAt: new Date().toISOString(),
        totalAMD: subtotal,
        items: cartDetails.map((c) => ({
          productId: c.product.id,
          title: c.product.title,
          quantity: c.quantity,
          priceAMD: c.product.priceAMD,
        })),
      };

      await addOrder(order);
      setConfirmedOrder(order);
      clearCart();
    } catch (err) {
      console.error('[OnlyLuxe] Error creating order:', err);
      setError('Տեղի ունեցավ սխալ պատվերը գրանցելիս: Կարող եք պատվիրել անմիջապես Telegram-ով կամ զանգահարել:');
    } finally {
      setSubmitting(false);
    }
  };

  const copyOrderToClipboard = () => {
    navigator.clipboard.writeText(orderSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Order Success Screen
  if (confirmedOrder) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#f0f9f3] text-[#2b593f] flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 size={36} />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
          Շնորհակալություն
        </span>

        <h1 className="font-serif text-3xl font-bold text-[#2b2119]">
          Պատվեր #{confirmedOrder.id} ընդունված է
        </h1>

        <p className="text-xs sm:text-sm text-[#6f5e53] max-w-lg mx-auto leading-relaxed">
          Մեր մենեջերը շուտով կկապվի <strong>{confirmedOrder.phone}</strong> հեռախոսահամարով՝ առաքման հարմար ժամը ճշտելու համար:
        </p>

        {/* Order Card */}
        <div className="rounded-3xl bg-white border border-[#eadfc8] p-6 text-left space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#f2ece2] text-xs">
            <span className="text-[#8a7b70]">Ընդհանուր գումար՝</span>
            <span className="font-serif text-lg font-bold text-[#2b2119]">
              {formatPrice(confirmedOrder.totalAMD)}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#33271d]">Պատվիրված ապրանքներ՝</div>
            {confirmedOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs text-[#635348]">
                <span>{item.title} (x{item.quantity})</span>
                <span className="font-semibold">{formatPrice(item.priceAMD * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#f2ece2] flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyOrderToClipboard}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-[#eadfc8] text-xs font-semibold hover:border-[#b89767] transition-colors"
            >
              {copied ? <Check size={14} className="text-[#2b593f]" /> : <Copy size={14} />}
              {copied ? 'Պատճենված է' : 'Պատճենել տվյալները'}
            </button>

            <a
              href={`https://t.me/+sAs7VSzcRhhjOTFi?text=${encodeURIComponent(orderSummaryText)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#33271d] text-[#caaf83] text-xs font-semibold hover:bg-[#201712] transition-colors"
            >
              <Send size={14} /> Ուղարկել Telegram-ով
            </a>
          </div>
        </div>

        <div className="pt-4">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#b89767] to-[#caaf83] text-[#241a13] font-serif font-bold text-xs uppercase tracking-wider"
          >
            Շարունակել գնումները <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // Empty Cart Screen
  if (cartDetails.length === 0) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-white border border-[#eadfc8] text-[#caaf83] flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag size={28} />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
          OnlyLuxe Cart
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#2b2119]">
          Ձեր զամբյուղը դատարկ է
        </h1>
        <p className="text-xs sm:text-sm text-[#736358] max-w-md mx-auto">
          Դուք դեռևս ապրանքներ չեք ավելացրել: Դիտեք մեր շքեղ հավաքածուն և ընտրեք ձեր նախընտրած մոդելները:
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#33271d] text-[#caaf83] font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#201712] transition-colors"
        >
          Անցնել կատալոգ <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      <div className="pb-4 border-b border-[#eadfc8]">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
          Գնումների զամբյուղ
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2b2119] mt-1">
          Պատվերի ձևակերպում
        </h1>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#fdf2f2] border border-[#f5c6cb] text-xs text-[#a94442]">
          {error}
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] items-start">
        {/* Cart Items List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#736358] px-1">
            <span>Ապրանքներ ({cartDetails.length})</span>
            <button
              type="button"
              onClick={clearCart}
              className="text-[#9c897d] hover:text-[#c44] underline"
            >
              Մաքրել բոլորը
            </button>
          </div>

          {cartDetails.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row gap-4 p-4 rounded-3xl bg-white border border-[#eadfc8] shadow-xs"
            >
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full sm:w-28 h-32 rounded-2xl object-cover bg-[#f4ecdf]"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#918175]">
                        {product.category} · {product.brand}
                      </span>
                      <h3 className="font-serif text-base font-bold text-[#2b2119] mt-0.5">
                        <Link to={`/product/${product.slug}`} className="hover:text-[#b89767]">
                          {product.title}
                        </Link>
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="p-1.5 rounded-full text-[#a89588] hover:text-[#c44] hover:bg-[#faf5ef]"
                      aria-label="Հեռացնել"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#f2ece2] mt-3">
                  <div className="flex items-center border border-[#eadfc8] rounded-full bg-[#faf5ef] px-2 py-0.5">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      className="p-1 hover:text-[#b89767]"
                      aria-label="Նվազեցնել"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#2b2119]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      className="p-1 hover:text-[#b89767]"
                      aria-label="Ավելացնել"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="font-serif text-base font-bold text-[#2b2119]">
                      {formatPrice(product.priceAMD * quantity)}
                    </div>
                    {quantity > 1 && (
                      <div className="text-[11px] text-[#918175]">
                        {formatPrice(product.priceAMD)} / հատ
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Guarantees Box */}
          <div className="p-4 rounded-2xl bg-[#faf5ef] border border-[#eadfc8] flex flex-wrap gap-6 text-xs text-[#6e5d52]">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-[#b89767]" /> Անվճար ապահովագրված առաքում Երևանում
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#b89767]" /> 2 տարվա պաշտոնական երաշխիք
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="space-y-6">
          <form
            onSubmit={handleCheckout}
            className="rounded-3xl bg-white border border-[#eadfc8] p-6 sm:p-8 shadow-sm space-y-4"
          >
            <h3 className="font-serif text-xl font-bold text-[#2b2119]">
              Առաքման տվյալներ
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#4d3d33] mb-1">
                Անուն, Ազգանուն *
              </label>
              <input
                type="text"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                required
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
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                required
                placeholder="099-XX-XX-XX"
                className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-xs text-[#2b2119] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4d3d33] mb-1">
                Առաքման հասցե
              </label>
              <input
                type="text"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                placeholder="Ք․ Երևան, փողոց, շենք, բն․"
                className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-xs text-[#2b2119] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4d3d33] mb-1">
                Էլ․ հասցե (ըստ ցանկության)
              </label>
              <input
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                placeholder="your.email@example.com"
                className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-xs text-[#2b2119] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4d3d33] mb-1">
                Լրացուցիչ նշումներ
              </label>
              <textarea
                value={customer.notes}
                onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                rows={2}
                placeholder="Հարմար ժամ, շենքի կոդ և այլն..."
                className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-xs text-[#2b2119] focus:outline-hidden"
              />
            </div>

            {/* Price Summary */}
            <div className="pt-4 border-t border-[#f2ece2] space-y-2 text-xs">
              <div className="flex justify-between text-[#736358]">
                <span>Ապրանքների արժեքը՝</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#736358]">
                <span>Առաքում (Երևան)՝</span>
                <span className="text-[#2b593f] font-semibold">Անվճար</span>
              </div>
              <div className="flex justify-between font-serif text-lg font-bold text-[#2b2119] pt-2 border-t border-[#f2ece2]">
                <span>Ընդհանուր գումար՝</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-full bg-[#33271d] text-[#caaf83] font-serif font-bold text-xs uppercase tracking-wider hover:bg-[#201712] transition-colors shadow-lg disabled:opacity-70 mt-2"
            >
              {submitting ? 'Ձևակերպվում է...' : 'Հաստատել պատվերը'}
            </button>

            {/* Instant Channels */}
            <div className="pt-3 border-t border-[#f2ece2] space-y-2">
              <a
                href={`https://t.me/+sAs7VSzcRhhjOTFi?text=${encodeURIComponent(orderSummaryText)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-[#caaf83] bg-[#faf5ef] text-[#2b2119] text-xs font-semibold hover:bg-white transition-colors"
              >
                <Send size={14} className="text-[#b89767]" /> Պատվիրել Telegram-ով
              </a>
              <a
                href="tel:+37455316191"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-[#6e5d52] hover:text-[#2b2119]"
              >
                <Phone size={13} /> Կամ զանգահարել՝ 055-31-61-91
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
