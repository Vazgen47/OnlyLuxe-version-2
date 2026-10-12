export type ProductAudience = 'Տղամարդու' | 'Կանացի' | 'Զույգերի' | 'Ունիսեքս';

export type ProductCategory = 'Ժամացույցներ' | 'Պայուսակներ' | 'Դրամապանակներ';

export type Product = {
  id: number;
  slug: string;
  title: string;
  category: ProductCategory | string;
  brand: string;
  audience: ProductAudience;
  sku: string;
  priceAMD: number;
  compareAtPriceAMD: number | null;
  description: string;
  shortDescription: string;
  specifications: string[];
  images: string[];
  featured: boolean;
  badge: string;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  id: number;
  quantity: number;
};

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'processing'
  | 'delivering'
  | 'completed'
  | 'cancelled';

export type OrderRecord = {
  id: string;
  email: string;
  name: string;
  phone: string;
  status: OrderStatus;
  createdAt: string;
  totalAMD: number;
  items: Array<{ productId: number; title: string; quantity: number; priceAMD: number }>;
  address?: string;
  notes?: string;
  adminNotes?: string;
};

export type MessageStatus = 'new' | 'read' | 'replied' | 'archived';

export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
};

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

export type SiteSettings = {
  bannerNotice: string;
  phoneContact: string;
  instagramUrl: string;
  telegramUrl: string;
  tiktokUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  brandPresentation: string;
  agencyCredit: string;
  warrantyNotice: string;
  deliveryNotice: string;
  seoTitle: string;
  seoDescription: string;
};
