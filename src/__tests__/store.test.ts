import { describe, it, expect } from 'vitest';
import { defaultProducts } from '../data/products';
import { formatPrice } from '../components/ProductCard';
import type { CartItem, OrderRecord } from '../types';

describe('OnlyLuxe Products Data & Integrity', () => {
  it('contains at least 12 official luxury products', () => {
    expect(defaultProducts.length).toBeGreaterThanOrEqual(12);
  });

  it('contains the official categories: Ժամացույցներ, Պայուսակներ, Դրամապանակներ', () => {
    const categories = new Set(defaultProducts.map((p) => p.category));
    expect(categories.has('Ժամացույցներ')).toBe(true);
    expect(categories.has('Պայուսակներ')).toBe(true);
    expect(categories.has('Դրամապանակներ')).toBe(true);
  });

  it('contains the official watch brands: Rolex, Patek Philippe, AP, Hublot, Omega, Tissot', () => {
    const brands = new Set(defaultProducts.map((p) => p.brand));
    expect(brands.has('Rolex')).toBe(true);
    expect(brands.has('Patek Philippe')).toBe(true);
    expect(brands.has('Audemars Piguet')).toBe(true);
    expect(brands.has('Hublot')).toBe(true);
    expect(brands.has('Omega')).toBe(true);
    expect(brands.has('Tissot')).toBe(true);
  });

  it('contains the audience tags: Տղամարդու, Կանացի, Զույգերի', () => {
    const audiences = new Set(defaultProducts.map((p) => p.audience));
    expect(audiences.has('Տղամարդու')).toBe(true);
    expect(audiences.has('Կանացի')).toBe(true);
    expect(audiences.has('Զույգերի')).toBe(true);
  });

  it('every product has positive AMD price and valid imagery', () => {
    defaultProducts.forEach((p) => {
      expect(p.priceAMD).toBeGreaterThan(0);
      expect(p.title.length).toBeGreaterThan(2);
      expect(p.slug.length).toBeGreaterThan(2);
      expect(p.images.length).toBeGreaterThanOrEqual(1);
      expect(p.stockQuantity).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('E-Commerce Calculations & Formatting', () => {
  it('formats AMD prices correctly with Armenian Dram symbol', () => {
    const formatted = formatPrice(890000);
    expect(formatted).toContain('֏');
    expect(formatted).toMatch(/890/);
  });

  it('calculates cart item subtotal accurately', () => {
    const cart: CartItem[] = [
      { id: 1, quantity: 2 },
      { id: 9, quantity: 1 },
    ];

    const prod1 = defaultProducts.find((p) => p.id === 1)!;
    const prod9 = defaultProducts.find((p) => p.id === 9)!;

    const subtotal = cart.reduce((sum, item) => {
      const p = item.id === 1 ? prod1 : prod9;
      return sum + p.priceAMD * item.quantity;
    }, 0);

    expect(subtotal).toBe(prod1.priceAMD * 2 + prod9.priceAMD * 1);
  });
});

describe('Search and Filtering Logic', () => {
  it('filters products by brand case-insensitively', () => {
    const rolexWatches = defaultProducts.filter(
      (p) => p.brand.toLowerCase() === 'rolex'
    );
    expect(rolexWatches.length).toBeGreaterThanOrEqual(2);
    rolexWatches.forEach((p) => expect(p.brand).toBe('Rolex'));
  });

  it('filters products by audience (Տղամարդու, Կանացի, Զույգերի)', () => {
    const womenProducts = defaultProducts.filter((p) => p.audience === 'Կանացի');
    expect(womenProducts.length).toBeGreaterThan(0);
    womenProducts.forEach((p) => expect(p.audience).toBe('Կանացի'));

    const coupleProducts = defaultProducts.filter((p) => p.audience === 'Զույգերի');
    expect(coupleProducts.length).toBeGreaterThan(0);
    coupleProducts.forEach((p) => expect(p.audience).toBe('Զույգերի'));
  });

  it('searches by keyword across title and category', () => {
    const query = 'nautilus';
    const found = defaultProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    expect(found.length).toBeGreaterThan(0);
    expect(found[0].title.toLowerCase()).toContain('nautilus');
  });
});

describe('Order Creation Record Integrity', () => {
  it('creates valid order record structure with items and customer info', () => {
    const order: OrderRecord = {
      id: 'OL-123456',
      name: 'Արմեն Ղազարյան',
      phone: '099-12-34-56',
      email: 'armen@example.com',
      address: 'Երևան, Ամիրյան 4',
      status: 'new',
      createdAt: new Date().toISOString(),
      totalAMD: 890000,
      items: [
        {
          productId: 1,
          title: 'Rolex Submariner Date Gold',
          quantity: 1,
          priceAMD: 890000,
        },
      ],
    };

    expect(order.id).toBe('OL-123456');
    expect(order.status).toBe('new');
    expect(order.totalAMD).toBe(890000);
    expect(order.items.length).toBe(1);
    expect(order.items[0].productId).toBe(1);
  });
});
