import type { Product, CategoryRecord } from '../types';
import { defaultProducts } from '../data/products';
import { StorageService } from './storageService';

const STORAGE_PRODUCTS = 'onlyluxe-products-v3';
const STORAGE_CATEGORIES = 'onlyluxe-categories';

export const defaultServiceCategories: CategoryRecord[] = [
  {
    id: 'cat-watches',
    name: 'Ժամացույցներ',
    slug: 'watches',
    description: 'Շվեյցարական ավտոմատիկ մեխանիզմներ, սապֆիրե ապակի և բարձրագույն ճշգրտություն',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-bags',
    name: 'Պայուսակներ',
    slug: 'bags',
    description: '100% բնական իտալական կաշվից ձեռագործ կանացի և տղամարդու պայուսակներ',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-wallets',
    name: 'Դրամապանակներ',
    slug: 'wallets',
    description: 'Կոմպակտ, բարձրորակ դրամապանակներ RFID պաշտպանությամբ',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
  },
];

export const ProductService = {
  getProducts(): Product[] {
    return StorageService.getItem<Product[]>(STORAGE_PRODUCTS, defaultProducts);
  },

  getCategories(): CategoryRecord[] {
    return StorageService.getItem<CategoryRecord[]>(STORAGE_CATEGORIES, defaultServiceCategories);
  },

  getProductBySlugOrId(identifier: string): Product | undefined {
    const list = this.getProducts();
    const decoded = decodeURIComponent(identifier);
    return list.find((p) => p.slug === decoded || String(p.id) === decoded);
  },
};
