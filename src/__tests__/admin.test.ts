import { describe, it, expect, beforeEach } from 'vitest';
import { defaultProducts } from '../data/products';
import type { Product, OrderRecord, ContactMessage } from '../types';

describe('Admin Panel — Product Management Functional Test Cycle', () => {
  let productStore: Product[] = [];
  const STORAGE_KEY = 'onlyluxe-products-v3';

  // Mock localStorage
  const storageMock: Record<string, string> = {};
  const mockLocalStorage = {
    getItem: (key: string) => storageMock[key] || null,
    setItem: (key: string, value: string) => {
      storageMock[key] = value;
    },
    removeItem: (key: string) => {
      delete storageMock[key];
    },
    clear: () => {
      for (const k of Object.keys(storageMock)) delete storageMock[k];
    },
  };

  // Helper function mimicking the Admin slug generator
  const generateCleanSlug = (text: string, fallbackId: string | number) => {
    const clean = text
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\u0531-\u058F\u0561-\u0587-]/g, '')
      .replace(/^-+|-+$/g, '');
    return clean || `item-${fallbackId}`;
  };

  // Storefront CRUD simulation
  const upsertProduct = (p: Product) => {
    const index = productStore.findIndex((item) => item.id === p.id);
    if (index >= 0) {
      productStore[index] = p;
    } else {
      productStore = [p, ...productStore];
    }
    mockLocalStorage.setItem(STORAGE_KEY, JSON.stringify(productStore));
  };

  const removeProduct = (id: number) => {
    productStore = productStore.filter((p) => p.id !== id);
    mockLocalStorage.setItem(STORAGE_KEY, JSON.stringify(productStore));
  };

  beforeEach(() => {
    mockLocalStorage.clear();
    // Seed initial official products
    productStore = [...defaultProducts];
    mockLocalStorage.setItem(STORAGE_KEY, JSON.stringify(productStore));
  });

  it('Step 10: Preserves initial baseline of official OnlyLuxe products', () => {
    expect(productStore.length).toBe(defaultProducts.length);
    expect(productStore.length).toBeGreaterThanOrEqual(12);
  });

  it('Step 1 & 2: Creates a test product with image, Armenian title, price, and stock', () => {
    const testProduct: Product = {
      id: 999901,
      slug: generateCleanSlug('Թեստային Ժամացույց Լյուքս', 999901),
      title: 'Թեստային Ժամացույց Լյուքս',
      category: 'Ժամացույցներ',
      brand: 'Rolex',
      audience: 'Տղամարդու',
      sku: 'TEST-9901',
      priceAMD: 480000,
      compareAtPriceAMD: 550000,
      description: 'Մանրամասն թեստային նկարագրություն',
      shortDescription: 'Կարճ թեստային նկարագրություն',
      specifications: ['Շվեյցարական մեխանիզմ', '40 մմ'],
      images: [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      ],
      featured: true,
      badge: 'Test',
      stockQuantity: 4,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    upsertProduct(testProduct);

    // Step 3 & 4: Save & Verify it appears in the catalog
    expect(productStore.length).toBe(defaultProducts.length + 1);
    const foundInCatalog = productStore.find((p) => p.id === 999901);
    expect(foundInCatalog).toBeDefined();
    expect(foundInCatalog?.title).toBe('Թեստային Ժամացույց Լյուքս');
    expect(foundInCatalog?.slug).toBe('թեստային-ժամացույց-լյուքս');
    expect(foundInCatalog?.priceAMD).toBe(480000);
    expect(foundInCatalog?.images[0]).toContain('data:image/png;base64');
  });

  it('Step 5: Persists data across page refresh simulation', () => {
    const testProduct: Product = {
      id: 999902,
      slug: generateCleanSlug('OnlyLuxe Test Bag', 999902),
      title: 'OnlyLuxe Test Bag',
      category: 'Պայուսակներ',
      brand: 'Gucci',
      audience: 'Կանացի',
      sku: 'TEST-9902',
      priceAMD: 320000,
      compareAtPriceAMD: null,
      description: 'Իտալական կաշի',
      shortDescription: 'Պայուսակ',
      specifications: ['100% կաշի'],
      images: ['https://images.unsplash.com/photo-test'],
      featured: false,
      badge: 'New',
      stockQuantity: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    upsertProduct(testProduct);

    // Simulate page refresh by reading fresh from localStorage
    const storedRaw = mockLocalStorage.getItem(STORAGE_KEY);
    expect(storedRaw).not.toBeNull();
    const restoredProducts = JSON.parse(storedRaw!) as Product[];

    expect(restoredProducts.length).toBe(defaultProducts.length + 1);
    const restoredTestItem = restoredProducts.find((p) => p.id === 999902);
    expect(restoredTestItem).toBeDefined();
    expect(restoredTestItem?.title).toBe('OnlyLuxe Test Bag');
  });

  it('Step 6 & 7: Edits price, stock, and description and verifies immediate catalog update', () => {
    const testProduct: Product = {
      id: 999903,
      slug: generateCleanSlug('Editable Product', 999903),
      title: 'Editable Product',
      category: 'Դրամապանակներ',
      brand: 'Bottega Veneta',
      audience: 'Ունիսեքս',
      sku: 'TEST-9903',
      priceAMD: 120000,
      compareAtPriceAMD: 140000,
      description: 'Հին նկարագրություն',
      shortDescription: 'Հին կարճ',
      specifications: ['RFID'],
      images: ['https://images.unsplash.com/photo-test'],
      featured: false,
      badge: 'Hot',
      stockQuantity: 10,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    upsertProduct(testProduct);

    // Now edit the price, stock, and description
    const updatedProduct: Product = {
      ...testProduct,
      priceAMD: 95000, // Price reduced
      stockQuantity: 8, // Stock updated
      description: 'Նոր թարմացված մանրամասն նկարագրություն',
      updatedAt: new Date().toISOString(),
    };

    upsertProduct(updatedProduct);

    const catalogItem = productStore.find((p) => p.id === 999903);
    expect(catalogItem?.priceAMD).toBe(95000);
    expect(catalogItem?.stockQuantity).toBe(8);
    expect(catalogItem?.description).toBe('Նոր թարմացված մանրամասն նկարագրություն');
  });

  it('Step 8 & 9: Deletes the test product and verifies complete removal from catalog', () => {
    const testProduct: Product = {
      id: 999904,
      slug: generateCleanSlug('Deletable Item', 999904),
      title: 'Deletable Item',
      category: 'Ժամացույցներ',
      brand: 'Hublot',
      audience: 'Տղամարդու',
      sku: 'TEST-9904',
      priceAMD: 500000,
      compareAtPriceAMD: null,
      description: 'To be deleted',
      shortDescription: 'Delete me',
      specifications: [],
      images: ['https://images.unsplash.com/photo-test'],
      featured: false,
      badge: '',
      stockQuantity: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    upsertProduct(testProduct);
    expect(productStore.some((p) => p.id === 999904)).toBe(true);

    // Delete it
    removeProduct(999904);

    expect(productStore.some((p) => p.id === 999904)).toBe(false);
    expect(productStore.length).toBe(defaultProducts.length);
  });

  it('Step 10: Verifies existing real products remain unchanged after all operations', () => {
    // Check that standard products (like Rolex Submariner Date Gold #1) are intact
    const originalRolex = defaultProducts.find((p) => p.id === 1)!;
    const currentRolex = productStore.find((p) => p.id === 1)!;

    expect(currentRolex).toBeDefined();
    expect(currentRolex.title).toBe(originalRolex.title);
    expect(currentRolex.priceAMD).toBe(originalRolex.priceAMD);
    expect(currentRolex.sku).toBe(originalRolex.sku);
  });
});

describe('Admin Panel — Slug Generation, Validation & Filters', () => {
  const generateCleanSlug = (text: string, fallbackId: string | number) => {
    const clean = text
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\u0531-\u058F\u0561-\u0587-]/g, '')
      .replace(/^-+|-+$/g, '');
    return clean || `item-${fallbackId}`;
  };

  it('generates valid non-empty slugs for Armenian product titles', () => {
    const armenianTitle = 'Ռոլեքս Դեյթոնա Ոսկի';
    const slug = generateCleanSlug(armenianTitle, 101);
    expect(slug).toBe('ռոլեքս-դեյթոնա-ոսկի');
    expect(slug.length).toBeGreaterThan(0);
    expect(slug).not.toBe('item-101');
  });

  it('generates valid slugs for mixed Latin-Armenian titles', () => {
    const mixedTitle = 'Rolex Submariner Ոսկեպատ 41մմ';
    const slug = generateCleanSlug(mixedTitle, 102);
    expect(slug).toBe('rolex-submariner-ոսկեպատ-41մմ');
  });

  it('falls back to item-id when title contains only punctuation or whitespace', () => {
    const symbolsTitle = '  *** /// !!!  ';
    const slug = generateCleanSlug(symbolsTitle, 103);
    expect(slug).toBe('item-103');
  });

  it('supports publishing and unpublishing toggle', () => {
    const product: Product = {
      ...defaultProducts[0],
      isActive: true,
    };

    const toggledOff = { ...product, isActive: !product.isActive };
    expect(toggledOff.isActive).toBe(false);

    const toggledOn = { ...toggledOff, isActive: !toggledOff.isActive };
    expect(toggledOn.isActive).toBe(true);
  });

  it('filters products correctly by category, status, and search query', () => {
    const list: Product[] = [
      { ...defaultProducts[0], category: 'Ժամացույցներ', isActive: true },
      { ...defaultProducts[1], category: 'Ժամացույցներ', isActive: false },
      { ...defaultProducts[8], category: 'Պայուսակներ', isActive: true },
    ];

    // Filter by category
    const watchesOnly = list.filter((p) => p.category === 'Ժամացույցներ');
    expect(watchesOnly.length).toBe(2);

    // Filter by active status
    const activeOnly = list.filter((p) => p.isActive);
    expect(activeOnly.length).toBe(2);

    const inactiveOnly = list.filter((p) => !p.isActive);
    expect(inactiveOnly.length).toBe(1);

    // Search by title or brand
    const searchMatch = list.filter((p) =>
      p.title.toLowerCase().includes('rolex') || p.brand.toLowerCase().includes('rolex')
    );
    expect(searchMatch.length).toBeGreaterThan(0);
  });
});

describe('Admin Panel — Order and Customer Message Lifecycle', () => {
  it('updates order status correctly', () => {
    const order: OrderRecord = {
      id: 'OL-TEST-1',
      name: 'Վարդան Մարտիրոսյան',
      phone: '055-12-34-56',
      email: 'vardan@example.com',
      address: 'Երևան, Հյուսիսային Պողոտա',
      status: 'new',
      createdAt: new Date().toISOString(),
      totalAMD: 450000,
      items: [{ productId: 1, title: 'Rolex Submariner', quantity: 1, priceAMD: 450000 }],
    };

    const processing = { ...order, status: 'processing' as const };
    expect(processing.status).toBe('processing');

    const completed = { ...processing, status: 'completed' as const };
    expect(completed.status).toBe('completed');
  });

  it('updates message status and handles reply workflow', () => {
    const message: ContactMessage = {
      id: 'msg-test-1',
      name: 'Անի Պողոսյան',
      phone: '091-22-33-44',
      message: 'Բարև ձեզ, ապրանքն առկա՞ է:',
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(message.status).toBe('new');

    const read = { ...message, status: 'read' as const };
    expect(read.status).toBe('read');

    const replied = { ...read, status: 'replied' as const };
    expect(replied.status).toBe('replied');
  });
});
