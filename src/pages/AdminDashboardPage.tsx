import { useMemo, useState } from 'react';
import {
  Package,
  ShoppingBag,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle,
  LogOut,
  Upload,
  TrendingUp,
  X,
  MessageSquare,
  FolderTree,
  Phone,
  Mail,
  Clock,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../components/ProductCard';
import { uploadProductImage } from '../lib/firebase';
import type {
  Product,
  ProductAudience,
  OrderStatus,
  SiteSettings,
  CategoryRecord,
} from '../types';

const AUDIENCES: ProductAudience[] = ['Տղամարդու', 'Կանացի', 'Զույգերի', 'Ունիսեքս'];

const defaultProductState: Omit<Product, 'id'> = {
  slug: '',
  title: '',
  category: 'Ժամացույցներ',
  brand: 'Rolex',
  audience: 'Տղամարդու',
  sku: '',
  priceAMD: 450000,
  compareAtPriceAMD: 520000,
  description: '',
  shortDescription: '',
  specifications: ['Շվեյցարական մեխանիզմ', 'Սապֆիր ապակի', 'Չժանգոտվող պողպատ'],
  images: [
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1000&q=85',
  ],
  featured: true,
  badge: 'Նոր',
  stockQuantity: 5,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultCategoryState: CategoryRecord = {
  id: '',
  name: '',
  slug: '',
  description: '',
  image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80',
};

export function AdminDashboardPage() {
  const {
    products,
    orders,
    messages,
    categories,
    upsertProduct,
    removeProduct,
    upsertCategory,
    removeCategory,
    updateOrderStatus,
    updateMessageStatus,
    deleteMessage,
    logoutAdmin,
    adminSession,
    siteSettings,
    updateSiteSettings,
    isFirebaseActive,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'categories' | 'orders' | 'messages' | 'settings'
  >('dashboard');

  // Product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>(defaultProductState);
  const [newSpec, setNewSpec] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productStatusFilter, setProductStatusFilter] = useState<string>('all');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Category state
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(null);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<CategoryRecord>(defaultCategoryState);

  // Orders filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Messages filters
  const [messageStatusFilter, setMessageStatusFilter] = useState<string>('all');

  // Notifications
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // In-app deletion confirmation (replaces window.confirm)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    type: 'product' | 'category' | 'message';
    id: string | number;
    title: string;
  } | null>(null);

  // Settings form
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3800);
  };

  // Helper for generating clean slugs that preserve Armenian and Latin characters
  const generateCleanSlug = (text: string, fallbackId: string | number) => {
    const clean = text
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\u0531-\u058F\u0561-\u0587-]/g, '')
      .replace(/^-+|-+$/g, '');
    return clean || `item-${fallbackId}`;
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAMD, 0);
    const activeProducts = products.filter((p) => p.isActive).length;
    const lowStock = products.filter((p) => p.stockQuantity <= 2).length;
    const newOrders = orders.filter((o) => o.status === 'new').length;
    const newMessages = messages.filter((m) => m.status === 'new').length;
    return { totalRevenue, activeProducts, lowStock, newOrders, newMessages };
  }, [orders, products, messages]);

  // Product filtering (search, category, status)
  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchesCategory =
        productCategoryFilter === 'all' || p.category === productCategoryFilter;
      const matchesStatus =
        productStatusFilter === 'all' ||
        (productStatusFilter === 'active' && p.isActive) ||
        (productStatusFilter === 'inactive' && !p.isActive);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, productSearch, productCategoryFilter, productStatusFilter]);

  // Orders filtering
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const matchesSearch =
        !orderSearch.trim() ||
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.phone.includes(orderSearch);
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Messages filtering
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      return messageStatusFilter === 'all' || m.status === messageStatusFilter;
    });
  }, [messages, messageStatusFilter]);

  // Handle open Product Add
  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setProductForm({
      ...defaultProductState,
      sku: `OL-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsFormOpen(true);
  };

  // Handle open Product Edit
  const handleOpenEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      slug: prod.slug,
      title: prod.title,
      category: prod.category,
      brand: prod.brand,
      audience: prod.audience,
      sku: prod.sku,
      priceAMD: prod.priceAMD,
      compareAtPriceAMD: prod.compareAtPriceAMD,
      description: prod.description,
      shortDescription: prod.shortDescription,
      specifications: [...prod.specifications],
      images: [...prod.images],
      featured: prod.featured,
      badge: prod.badge,
      stockQuantity: prod.stockQuantity,
      isActive: prod.isActive,
      createdAt: prod.createdAt,
      updatedAt: new Date().toISOString(),
    });
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title.trim()) {
      showNotification('Խնդրում ենք լրացնել ապրանքի անվանումը:', 'error');
      return;
    }

    if (productForm.priceAMD <= 0 || isNaN(productForm.priceAMD)) {
      showNotification('Ապրանքի գինը պետք է լինի 0-ից բարձր դրական թիվ:', 'error');
      return;
    }

    const id = editingProduct ? editingProduct.id : Date.now();
    const slug = productForm.slug.trim() || generateCleanSlug(productForm.title, id);
    const images =
      productForm.images.length > 0
        ? productForm.images
        : [
            'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1000&q=85',
          ];

    const nextProd: Product = {
      id,
      ...productForm,
      images,
      slug,
      updatedAt: new Date().toISOString(),
    };

    await upsertProduct(nextProd);
    setIsFormOpen(false);
    showNotification(
      editingProduct
        ? `«${nextProd.title}» ապրանքը հաջողությամբ թարմացվեց:`
        : `«${nextProd.title}» ապրանքն ավելացվեց կատալոգում:`
    );
  };

  const handleToggleActive = async (prod: Product) => {
    const updated: Product = {
      ...prod,
      isActive: !prod.isActive,
      updatedAt: new Date().toISOString(),
    };
    await upsertProduct(updated);
    showNotification(
      updated.isActive
        ? `«${prod.title}» ապրանքն ակտիվացվեց:`
        : `«${prod.title}» ապրանքն ապաակտիվացվեց:`
    );
  };

  const handleDeleteProduct = (prod: Product) => {
    setDeleteConfirmation({
      type: 'product',
      id: prod.id,
      title: prod.title,
    });
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setIsUploadingImage(true);
    let successCount = 0;

    for (const file of files) {
      try {
        // Attempt upload to Firebase Storage
        const downloadUrl = await uploadProductImage(file);
        setProductForm((prev) => ({
          ...prev,
          images: [...prev.images, downloadUrl],
        }));
        successCount++;
      } catch {
        // Safe fallback to FileReader DataURL for local offline usage
        await new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              setProductForm((prev) => ({
                ...prev,
                images: [...prev.images, reader.result as string],
              }));
              successCount++;
            }
            resolve();
          };
          reader.onerror = () => resolve();
          reader.readAsDataURL(file);
        });
      }
    }

    setIsUploadingImage(false);
    e.target.value = ''; // Reset so the user can re-upload if removed

    if (successCount > 0) {
      showNotification(`${successCount} նկար հաջողությամբ ավելացվեց:`);
    } else {
      showNotification('Նկարը վերբեռնել չհաջողվեց:', 'error');
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddSpec = () => {
    if (newSpec.trim()) {
      setProductForm((prev) => ({
        ...prev,
        specifications: [...prev.specifications, newSpec.trim()],
      }));
      setNewSpec('');
    }
  };

  const handleRemoveSpec = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  // Category handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      ...defaultCategoryState,
      id: `cat-${Date.now().toString().slice(-4)}`,
    });
    setIsCategoryFormOpen(true);
  };

  const handleOpenEditCategory = (cat: CategoryRecord) => {
    setEditingCategory(cat);
    setCategoryForm(cat);
    setIsCategoryFormOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showNotification('Խնդրում ենք լրացնել կատեգորիայի անվանումը:', 'error');
      return;
    }

    const slug = categoryForm.slug.trim() || generateCleanSlug(categoryForm.name, categoryForm.id || Date.now());

    await upsertCategory({
      ...categoryForm,
      slug,
    });
    setIsCategoryFormOpen(false);
    showNotification(
      editingCategory
        ? `«${categoryForm.name}» կատեգորիան թարմացվեց:`
        : `«${categoryForm.name}» կատեգորիան ավելացվեց:`
    );
  };

  const handleDeleteCategory = (cat: CategoryRecord) => {
    setDeleteConfirmation({
      type: 'category',
      id: cat.id,
      title: cat.name,
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;
    const { type, id, title } = deleteConfirmation;

    if (type === 'product') {
      await removeProduct(Number(id));
      showNotification(`«${title}» ապրանքը ջնջվեց:`);
    } else if (type === 'category') {
      await removeCategory(String(id));
      showNotification(`«${title}» կատեգորիան ջնջվեց:`);
    } else if (type === 'message') {
      await deleteMessage(String(id));
      showNotification('Հաղորդագրությունը ջնջվեց:');
    }

    setDeleteConfirmation(null);
  };

  // Settings handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteSettings(settingsForm);
    showNotification('Կայքի կարգավորումները պահպանվեցին:');
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-8">
      {/* Admin Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-[#eadfc8] shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b89767]">
            OnlyLuxe × iCloneEvn Control Center
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#2b2119]">
            Ադմինիստրատորի վահանակ
          </h1>
          <p className="text-xs text-[#736358] mt-0.5">
            Մուտք գործված է՝ <strong>{adminSession?.email || 'Admin'}</strong> ·{' '}
            <span className={isFirebaseActive ? 'text-[#2b593f] font-semibold' : 'text-[#b89767]'}>
              {isFirebaseActive ? '● Cloud Firestore ակտիվ է' : '● Տեղային ռեժիմ (Local Sync)'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#eadfc8] text-xs font-semibold text-[#5d4c42] hover:bg-[#faf5ef] transition-colors"
          >
            <LogOut size={14} /> Դուրս գալ
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 shadow-xs transition-all ${
            notification.type === 'error'
              ? 'bg-[#fdf2f2] border border-[#f5c6cb] text-[#a94442]'
              : 'bg-[#f0f9f3] border border-[#a3d9b4] text-[#2b593f]'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? (
              <AlertCircle size={16} className="shrink-0" />
            ) : (
              <CheckCircle size={16} className="shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 rounded-full hover:bg-black/5"
            aria-label="Փակել"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#eadfc8] pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'dashboard'
              ? 'bg-[#33271d] text-[#caaf83] shadow-sm'
              : 'border border-[#eadfc8] bg-white text-[#5d4c42] hover:bg-[#faf5ef]'
          }`}
        >
          <TrendingUp size={14} /> Ցուցանիշներ
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'products'
              ? 'bg-[#33271d] text-[#caaf83] shadow-sm'
              : 'border border-[#eadfc8] bg-white text-[#5d4c42] hover:bg-[#faf5ef]'
          }`}
        >
          <Package size={14} /> Ապրանքներ ({products.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'categories'
              ? 'bg-[#33271d] text-[#caaf83] shadow-sm'
              : 'border border-[#eadfc8] bg-white text-[#5d4c42] hover:bg-[#faf5ef]'
          }`}
        >
          <FolderTree size={14} /> Կատեգորիաներ ({categories.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'orders'
              ? 'bg-[#33271d] text-[#caaf83] shadow-sm'
              : 'border border-[#eadfc8] bg-white text-[#5d4c42] hover:bg-[#faf5ef]'
          }`}
        >
          <ShoppingBag size={14} /> Պատվերներ ({orders.length})
          {metrics.newOrders > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#caaf83] text-[#33271d] text-[10px] font-bold flex items-center justify-center">
              {metrics.newOrders}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'messages'
              ? 'bg-[#33271d] text-[#caaf83] shadow-sm'
              : 'border border-[#eadfc8] bg-white text-[#5d4c42] hover:bg-[#faf5ef]'
          }`}
        >
          <MessageSquare size={14} /> Նամակներ ({messages.length})
          {metrics.newMessages > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#c44] text-white text-[10px] font-bold flex items-center justify-center">
              {metrics.newMessages}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'settings'
              ? 'bg-[#33271d] text-[#caaf83] shadow-sm'
              : 'border border-[#eadfc8] bg-white text-[#5d4c42] hover:bg-[#faf5ef]'
          }`}
        >
          <Settings size={14} /> Կարգավորումներ
        </button>
      </div>

      {/* TAB 1: METRICS DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="p-5 rounded-2xl bg-white border border-[#eadfc8] shadow-xs">
              <span className="text-xs text-[#736358]">Ընդհանուր վաճառք</span>
              <div className="font-serif text-2xl font-bold text-[#2b2119] mt-2">
                {formatPrice(metrics.totalRevenue)}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#eadfc8] shadow-xs">
              <span className="text-xs text-[#736358]">Պատվերներ</span>
              <div className="font-serif text-2xl font-bold text-[#2b2119] mt-2 flex items-center gap-2">
                {orders.length}
                {metrics.newOrders > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#fbf0df] text-[#b89767]">
                    {metrics.newOrders} նոր
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#eadfc8] shadow-xs">
              <span className="text-xs text-[#736358]">Հաճախորդների նամակներ</span>
              <div className="font-serif text-2xl font-bold text-[#2b2119] mt-2 flex items-center gap-2">
                {messages.length}
                {metrics.newMessages > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#fde8e8] text-[#c44]">
                    {metrics.newMessages} նոր
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#eadfc8] shadow-xs">
              <span className="text-xs text-[#736358]">Ակտիվ ապրանքներ</span>
              <div className="font-serif text-2xl font-bold text-[#2b2119] mt-2">
                {metrics.activeProducts} / {products.length}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#eadfc8] shadow-xs">
              <span className="text-xs text-[#736358]">Նվազող մնացորդ (≤ 2)</span>
              <div className="font-serif text-2xl font-bold text-[#a94442] mt-2">
                {metrics.lowStock}
              </div>
            </div>
          </div>

          {/* Quick Previews Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Orders Preview */}
            <div className="p-6 rounded-3xl bg-white border border-[#eadfc8] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f2ece2]">
                <h3 className="font-serif text-lg font-bold text-[#2b2119]">
                  Վերջին պատվերները
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#b89767] hover:underline"
                >
                  Տեսնել բոլորը →
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-[#736358] py-4">Դեռևս նոր պատվերներ չկան:</p>
              ) : (
                <div className="space-y-2">
                  {orders.slice(0, 4).map((o) => (
                    <div
                      key={o.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#faf5ef] border border-[#eadfc8] text-xs"
                    >
                      <div>
                        <span className="font-bold text-[#2b2119]">#{o.id}</span> · {o.name} ({o.phone})
                        <div className="text-[11px] text-[#736358]">
                          {o.items.length} ապրանք · {new Date(o.createdAt).toLocaleDateString('hy-AM')}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-[#2b2119]">{formatPrice(o.totalAMD)}</span>
                        <span className="px-2.5 py-1 rounded-full bg-white border border-[#eadfc8] text-[10px] font-bold">
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Messages Preview */}
            <div className="p-6 rounded-3xl bg-white border border-[#eadfc8] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f2ece2]">
                <h3 className="font-serif text-lg font-bold text-[#2b2119]">
                  Վերջին հաղորդագրությունները
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('messages')}
                  className="text-xs font-semibold text-[#b89767] hover:underline"
                >
                  Տեսնել բոլորը →
                </button>
              </div>

              {messages.length === 0 ? (
                <p className="text-xs text-[#736358] py-4">Դեռևս հաղորդագրություններ չկան:</p>
              ) : (
                <div className="space-y-2">
                  {messages.slice(0, 4).map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-2xl bg-[#faf5ef] border border-[#eadfc8] text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2b2119]">{m.name}</span>
                        <span className="text-[10px] text-[#8a7b70]">
                          {new Date(m.createdAt).toLocaleDateString('hy-AM')}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5d4c42] line-clamp-1">{m.message}</p>
                      <div className="flex items-center justify-between pt-1">
                        <a href={`tel:${m.phone}`} className="text-[11px] text-[#b89767] font-semibold flex items-center gap-1">
                          <Phone size={11} /> {m.phone}
                        </a>
                        <span
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            m.status === 'new'
                              ? 'bg-[#c44] text-white'
                              : m.status === 'replied'
                              ? 'bg-[#eaf4ed] text-[#2b593f]'
                              : 'bg-white text-[#736358] border border-[#eadfc8]'
                          }`}
                        >
                          {m.status === 'new' ? 'Նոր' : m.status === 'replied' ? 'Պատասխանված' : 'Կարդացված'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Որոնել ըստ անվան, SKU, բրենդի..."
                  className="w-full rounded-full border border-[#eadfc8] bg-white px-4 py-2.5 text-xs text-[#2b2119] focus:outline-hidden"
                />
                <Search size={15} className="absolute right-3.5 top-3 text-[#9e8c80]" />
              </div>

              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="rounded-full border border-[#eadfc8] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#2b2119]"
              >
                <option value="all">Բոլոր կատեգորիաները ({products.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={productStatusFilter}
                onChange={(e) => setProductStatusFilter(e.target.value)}
                className="rounded-full border border-[#eadfc8] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#2b2119]"
              >
                <option value="all">Բոլոր կարգավիճակները</option>
                <option value="active">Միայն ակտիվները</option>
                <option value="inactive">Միայն պասիվները</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleOpenAddForm}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#33271d] text-[#caaf83] font-serif font-bold text-xs uppercase tracking-wider hover:bg-[#201712] transition-colors shadow-md"
            >
              <Plus size={15} /> Ավելացնել ապրանք
            </button>
          </div>

          {/* Products Table/Grid */}
          <div className="rounded-3xl bg-white border border-[#eadfc8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf5ef] text-[#5d4c42] uppercase text-[10px] tracking-wider border-b border-[#eadfc8]">
                  <tr>
                    <th className="p-4">Ապրանք</th>
                    <th className="p-4">Կատեգորիա</th>
                    <th className="p-4">Հասցեատեր</th>
                    <th className="p-4">Գին</th>
                    <th className="p-4">Մնացորդ</th>
                    <th className="p-4">Կարգավիճակ</th>
                    <th className="p-4 text-right">Գործողություններ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2ece2]">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-xs text-[#8a7b70]">
                        Ապրանքներ չեն գտնվել տրված պարամետրերով:
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#fcf9f5] transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={
                              p.images?.[0] ||
                              'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=400&q=80'
                            }
                            alt={p.title}
                            className="w-12 h-14 rounded-lg object-cover bg-[#f4ecdf] border border-[#eadfc8] shrink-0"
                          />
                          <div>
                            <div className="font-serif font-bold text-[#2b2119]">{p.title}</div>
                            <div className="text-[10px] text-[#8a7b70]">
                              {p.brand} · SKU: {p.sku}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-[#5d4c42]">{p.category}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-md bg-[#faf5ef] border border-[#eadfc8] text-[10px]">
                            {p.audience}
                          </span>
                        </td>
                        <td className="p-4 font-serif font-bold text-[#2b2119]">
                          {formatPrice(p.priceAMD)}
                        </td>
                        <td className="p-4">
                          <span className={p.stockQuantity <= 2 ? 'text-[#a94442] font-bold' : ''}>
                            {p.stockQuantity} հատ
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(p)}
                            title="Սեղմեք կարգավիճակը փոխելու համար"
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                              p.isActive
                                ? 'bg-[#eaf4ed] text-[#2b593f] hover:bg-[#d8eedc]'
                                : 'bg-[#f8eaea] text-[#a94442] hover:bg-[#f2d8d8]'
                            }`}
                          >
                            {p.isActive ? '● Ակտիվ' : '○ Պասիվ'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(p)}
                            className="p-1.5 rounded-lg border border-[#eadfc8] hover:border-[#b89767] text-[#4d3d33]"
                            title={p.isActive ? 'Ապաակտիվացնել (հանել վաճառքից)' : 'Ակտիվացնել (հրապարակել)'}
                            aria-label={p.isActive ? 'Ապաակտիվացնել' : 'Ակտիվացնել'}
                          >
                            {p.isActive ? <Eye size={14} /> : <EyeOff size={14} className="text-[#a94442]" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditForm(p)}
                            className="p-1.5 rounded-lg border border-[#eadfc8] hover:border-[#b89767] text-[#4d3d33]"
                            aria-label="Խմբագրել"
                            title="Խմբագրել"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p)}
                            className="p-1.5 rounded-lg border border-[#eadfc8] hover:border-[#c44] text-[#a85050]"
                            aria-label="Ջնջել"
                            title="Ջնջել"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#2b2119]">
                Կատեգորիաների կառավարում ({categories.length})
              </h2>
              <p className="text-xs text-[#736358] mt-0.5">
                Կառավարեք կայքի հիմնական կատեգորիաները և նկարագրությունները:
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddCategory}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#33271d] text-[#caaf83] font-serif font-bold text-xs uppercase tracking-wider hover:bg-[#201712] transition-colors shadow-md"
            >
              <Plus size={15} /> Ավելացնել կատեգորիա
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-3xl bg-white border border-[#eadfc8] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="aspect-16/9 rounded-2xl overflow-hidden bg-[#faf5ef] border border-[#eadfc8]">
                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#2b2119]">{c.name}</h3>
                    <span className="text-[11px] text-[#b89767] font-semibold">Slug: /{c.slug}</span>
                    <p className="text-xs text-[#736358] mt-1.5 leading-relaxed">{c.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f2ece2]">
                  <button
                    type="button"
                    onClick={() => handleOpenEditCategory(c)}
                    className="p-2 rounded-xl border border-[#eadfc8] hover:border-[#b89767] text-[#4d3d33]"
                    aria-label="Խմբագրել"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(c)}
                    className="p-2 rounded-xl border border-[#eadfc8] hover:border-[#c44] text-[#a85050]"
                    aria-label="Ջնջել"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#2b2119]">
                Պատվերների կառավարում ({orders.length})
              </h2>
              <p className="text-xs text-[#736358] mt-0.5">
                Կառավարեք ստացված պատվերները, կարգավիճակները և հաճախորդի տվյալները:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Փնտրել ըստ ID, անվան կամ հեռ..."
                  className="rounded-full border border-[#eadfc8] bg-white px-4 py-2 text-xs text-[#2b2119] focus:outline-hidden"
                />
                <Search size={14} className="absolute right-3.5 top-2.5 text-[#9e8c80]" />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="rounded-full border border-[#eadfc8] bg-white px-4 py-2 text-xs font-semibold text-[#2b2119]"
              >
                <option value="all">Բոլոր կարգավիճակները</option>
                <option value="new">Նոր (New)</option>
                <option value="processing">Ընթացքի մեջ (Processing)</option>
                <option value="ready">Պատրաստ է (Ready)</option>
                <option value="completed">Ավարտված (Completed)</option>
                <option value="cancelled">Չեղարկված (Cancelled)</option>
              </select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-[#eadfc8] text-center text-xs text-[#736358]">
              Պատվերներ չեն գտնվել նշված ֆիլտրով:
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredOrders.map((o) => (
                <div
                  key={o.id}
                  className="p-6 rounded-3xl bg-white border border-[#eadfc8] shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f2ece2]">
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-base text-[#2b2119]">
                        Պատվեր #{o.id}
                      </span>
                      <span className="text-xs text-[#736358]">
                        <Clock size={12} className="inline mr-1 text-[#b89767]" />
                        {new Date(o.createdAt).toLocaleString('hy-AM')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#736358]">Կարգավիճակ՝</span>
                      <select
                        value={o.status}
                        onChange={(e) => {
                          updateOrderStatus(o.id, e.target.value as OrderStatus);
                          showNotification(`Պատվերի #${o.id} կարգավիճակը թարմացվեց:`);
                        }}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                          o.status === 'new'
                            ? 'bg-[#fbf0df] border-[#caaf83] text-[#33271d]'
                            : o.status === 'completed'
                            ? 'bg-[#eaf4ed] border-[#a3d9b4] text-[#2b593f]'
                            : o.status === 'cancelled'
                            ? 'bg-[#fde8e8] border-[#f8b4b4] text-[#c44]'
                            : 'bg-[#faf5ef] border-[#eadfc8] text-[#2b2119]'
                        }`}
                      >
                        <option value="new">Նոր (New)</option>
                        <option value="processing">Ընթացքի մեջ (Processing)</option>
                        <option value="ready">Պատրաստ է (Ready)</option>
                        <option value="completed">Ավարտված (Completed)</option>
                        <option value="cancelled">Չեղարկված (Cancelled)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 text-xs text-[#5d4c42]">
                    <div className="space-y-2">
                      <div>
                        <span className="text-[11px] text-[#918175] block">Հաճախորդ</span>
                        <span className="font-semibold text-sm text-[#2b2119]">{o.name}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#918175] block">Հեռախոսահամար</span>
                        <a
                          href={`tel:${o.phone}`}
                          className="text-[#b89767] font-bold text-sm hover:underline inline-flex items-center gap-1"
                        >
                          <Phone size={13} /> {o.phone}
                        </a>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#918175] block">Առաքման հասցե</span>
                        <span className="text-xs text-[#2b2119]">{o.address || 'Ք․ Երևան'}</span>
                      </div>
                      {o.notes && (
                        <div>
                          <span className="text-[11px] text-[#918175] block">Հաճախորդի նշում</span>
                          <span className="text-xs italic text-[#736358]">«{o.notes}»</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 bg-[#faf5ef] p-4 rounded-2xl border border-[#eadfc8]">
                      <div className="font-semibold text-[#2b2119] pb-1 border-b border-[#eadfc8]">
                        Պատվիրված ապրանքներ՝
                      </div>
                      {o.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs py-1">
                          <span>
                            {item.title} <strong className="text-[#b89767]">× {item.quantity}</strong>
                          </span>
                          <span className="font-semibold text-[#2b2119]">
                            {formatPrice(item.priceAMD * item.quantity)}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-[#eadfc8] flex justify-between font-serif font-bold text-sm text-[#2b2119]">
                        <span>Ընդհանուր գումար՝</span>
                        <span className="text-base text-[#b89767]">{formatPrice(o.totalAMD)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: MESSAGES MANAGEMENT */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#2b2119]">
                Հաճախորդների հաղորդագրություններ ({messages.length})
              </h2>
              <p className="text-xs text-[#736358] mt-0.5">
                Կապի էջից կամ մոդալից ուղարկված բոլոր հաղորդագրությունները:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={messageStatusFilter}
                onChange={(e) => setMessageStatusFilter(e.target.value)}
                className="rounded-full border border-[#eadfc8] bg-white px-4 py-2 text-xs font-semibold text-[#2b2119]"
              >
                <option value="all">Բոլոր նամակները</option>
                <option value="new">Միայն նորերը</option>
                <option value="read">Կարդացված</option>
                <option value="replied">Պատասխանված</option>
              </select>
            </div>
          </div>

          {filteredMessages.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white border border-[#eadfc8] text-center text-xs text-[#736358]">
              Հաղորդագրություններ չկան:
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredMessages.map((m) => (
                <div
                  key={m.id}
                  className={`p-6 rounded-3xl bg-white border shadow-xs space-y-4 transition-all ${
                    m.status === 'new' ? 'border-[#caaf83] ring-1 ring-[#caaf83]/30' : 'border-[#eadfc8]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f2ece2]">
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-base text-[#2b2119]">{m.name}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          m.status === 'new'
                            ? 'bg-[#c44] text-white'
                            : m.status === 'replied'
                            ? 'bg-[#eaf4ed] text-[#2b593f]'
                            : 'bg-[#faf5ef] text-[#736358] border border-[#eadfc8]'
                        }`}
                      >
                        {m.status === 'new' ? 'Նոր' : m.status === 'replied' ? 'Պատասխանված' : 'Կարդացված'}
                      </span>
                    </div>

                    <span className="text-xs text-[#736358]">
                      {new Date(m.createdAt).toLocaleString('hy-AM')}
                    </span>
                  </div>

                  <div className="text-xs text-[#33271d] bg-[#faf5ef] p-4 rounded-2xl border border-[#eadfc8] leading-relaxed whitespace-pre-wrap">
                    {m.message}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <a
                        href={`tel:${m.phone}`}
                        className="flex items-center gap-1.5 font-bold text-[#b89767] hover:underline"
                      >
                        <Phone size={13} /> {m.phone}
                      </a>
                      {m.email && (
                        <a
                          href={`mailto:${m.email}`}
                          className="flex items-center gap-1.5 text-[#736358] hover:text-[#2b2119]"
                        >
                          <Mail size={13} /> {m.email}
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {m.status !== 'replied' && (
                        <button
                          type="button"
                          onClick={() => {
                            updateMessageStatus(m.id, 'replied');
                            showNotification('Նամակը նշվեց որպես պատասխանված:');
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#eaf4ed] border border-[#a3d9b4] text-[#2b593f] text-xs font-semibold hover:bg-[#d8edd9] transition-colors"
                        >
                          <Check size={12} /> Պատասխանված
                        </button>
                      )}
                      {m.status === 'new' && (
                        <button
                          type="button"
                          onClick={() => {
                            updateMessageStatus(m.id, 'read');
                            showNotification('Նամակը նշվեց որպես կարդացված:');
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#eadfc8] bg-white text-[#5d4c42] text-xs font-semibold hover:bg-[#faf5ef] transition-colors"
                        >
                          <Eye size={12} /> Կարդացված
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteConfirmation({
                            type: 'message',
                            id: m.id,
                            title: `${m.name} (${m.phone})`,
                          })
                        }
                        className="p-1.5 rounded-full border border-[#eadfc8] text-[#a85050] hover:border-[#c44] hover:bg-[#fde8e8] transition-colors"
                        aria-label="Ջնջել"
                        title="Ջնջել"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: SITE SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-8 rounded-3xl bg-white border border-[#eadfc8] shadow-xs space-y-6 max-w-2xl">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2b2119]">
              Կայքի տեքստեր և կոնտակտներ
            </h3>
            <p className="text-xs text-[#736358] mt-1">
              Փոփոխությունները անմիջապես կարտացոլվեն կայքի գլխավոր էջում, ֆուտերում և պատվերի ձևերում:
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#4d3d33] mb-1">
                Վերևի ակցիայի/հայտարարության տեքստ (Banner notice)
              </label>
              <input
                type="text"
                value={settingsForm.bannerNotice}
                onChange={(e) => setSettingsForm({ ...settingsForm, bannerNotice: e.target.value })}
                className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-[#2b2119]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4d3d33] mb-1">
                Գլխավոր էջի խորագիր (Hero title)
              </label>
              <input
                type="text"
                value={settingsForm.heroTitle}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-[#2b2119]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4d3d33] mb-1">
                Գլխավոր էջի ենթախորագիր (Hero subtitle)
              </label>
              <input
                type="text"
                value={settingsForm.heroSubtitle}
                onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-[#2b2119]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4d3d33] mb-1">
                Բրենդի ներկայացում
              </label>
              <input
                type="text"
                value={settingsForm.brandPresentation}
                onChange={(e) => setSettingsForm({ ...settingsForm, brandPresentation: e.target.value })}
                className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-[#2b2119]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4d3d33] mb-1">
                Հեռախոսահամար
              </label>
              <input
                type="text"
                value={settingsForm.phoneContact}
                onChange={(e) => setSettingsForm({ ...settingsForm, phoneContact: e.target.value })}
                className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-[#2b2119]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4d3d33] mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={settingsForm.instagramUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-[#2b2119]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4d3d33] mb-1">
                Telegram URL
              </label>
              <input
                type="text"
                value={settingsForm.telegramUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, telegramUrl: e.target.value })}
                className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-[#2b2119]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4d3d33] mb-1">
                TikTok URL
              </label>
              <input
                type="text"
                value={settingsForm.tiktokUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-[#2b2119]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4d3d33] mb-1">
                Գործակալության հեղինակային նշում (Agency Credit)
              </label>
              <input
                type="text"
                value={settingsForm.agencyCredit}
                onChange={(e) => setSettingsForm({ ...settingsForm, agencyCredit: e.target.value })}
                className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2.5 text-[#2b2119]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#33271d] text-[#caaf83] font-serif font-bold text-xs uppercase tracking-wider hover:bg-[#201712] transition-colors shadow-md"
          >
            Պահպանել կարգավորումները
          </button>
        </form>
      )}

      {/* CATEGORY ADD/EDIT MODAL */}
      {isCategoryFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#eadfc8] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f2ece2]">
              <h3 className="font-serif text-lg font-bold text-[#2b2119]">
                {editingCategory ? 'Խմբագրել կատեգորիան' : 'Ավելացնել նոր կատեգորիա'}
              </h3>
              <button
                type="button"
                onClick={() => setIsCategoryFormOpen(false)}
                className="p-1 rounded-full text-[#736358] hover:bg-[#faf5ef]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#4d3d33] mb-1">Կատեգորիայի անվանում</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Օրինակ՝ Ժամացույցներ"
                  className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2 text-[#2b2119]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4d3d33] mb-1">URL Slug</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="օր. watches"
                  className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2 text-[#2b2119]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4d3d33] mb-1">Նկարագրություն</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2 text-[#2b2119]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4d3d33] mb-1">Նկարի URL</label>
                <input
                  type="text"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2 text-[#2b2119]"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-[#f2ece2]">
                <button
                  type="button"
                  onClick={() => setIsCategoryFormOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#eadfc8] text-xs font-semibold text-[#5d4c42]"
                >
                  Չեղարկել
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#33271d] text-[#caaf83] font-serif font-bold text-xs uppercase tracking-wider hover:bg-[#201712]"
                >
                  Պահպանել
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT ADD/EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#eadfc8] my-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#eadfc8]">
              <h3 className="font-serif text-xl font-bold text-[#2b2119]">
                {editingProduct ? 'Խմբագրել ապրանքը' : 'Ավելացնել նոր ապրանք'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-full text-[#736358] hover:bg-[#faf5ef]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-[#4d3d33] mb-1">Ապրանքի անվանում *</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    placeholder="Օրինակ՝ Rolex Submariner Gold"
                    className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2 text-[#2b2119]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#4d3d33] mb-1">Բրենդ</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="Rolex, Patek Philippe, Hublot..."
                    className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2 text-[#2b2119]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-semibold text-[#4d3d33] mb-1">Կատեգորիա</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3 py-2 text-[#2b2119]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#4d3d33] mb-1">Հասցեատեր</label>
                  <select
                    value={productForm.audience}
                    onChange={(e) =>
                      setProductForm({ ...productForm, audience: e.target.value as ProductAudience })
                    }
                    className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3 py-2 text-[#2b2119]"
                  >
                    {AUDIENCES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#4d3d33] mb-1">SKU կոդ</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2 text-[#2b2119]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-semibold text-[#4d3d33] mb-1">Գին (AMD) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={productForm.priceAMD}
                    onChange={(e) => setProductForm({ ...productForm, priceAMD: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2 text-[#2b2119]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#4d3d33] mb-1">Հին գին (AMD)</label>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={productForm.compareAtPriceAMD ?? ''}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        compareAtPriceAMD: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2 text-[#2b2119]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#4d3d33] mb-1">Քանակ (պահեստում)</label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.stockQuantity}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2 text-[#2b2119]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 items-center pt-2">
                <div>
                  <label className="block font-semibold text-[#4d3d33] mb-1">Նշան (Badge)</label>
                  <input
                    type="text"
                    value={productForm.badge || ''}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="Նոր, Զեղչ, Exclusive..."
                    className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2 text-[#2b2119]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#b89767]"
                  />
                  <label htmlFor="featuredCheck" className="font-semibold text-[#2b2119]">
                    Ցուցադրել գլխավորում
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="activeCheck"
                    checked={productForm.isActive}
                    onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#2b593f]"
                  />
                  <label htmlFor="activeCheck" className="font-semibold text-[#2b2119]">
                    Ակտիվ է վաճառքում
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4d3d33] mb-1">Կարճ նկարագրություն</label>
                <input
                  type="text"
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  placeholder="Մեկ տողով ամփոփում..."
                  className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2 text-[#2b2119]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4d3d33] mb-1">Մանրամասն նկարագրություն</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3.5 py-2 text-[#2b2119]"
                />
              </div>

              {/* Images Manager */}
              <div className="space-y-2 pt-2 border-t border-[#f2ece2]">
                <label className="block font-semibold text-[#4d3d33]">
                  Լուսանկարներ ({productForm.images.length})
                </label>

                <div className="flex flex-wrap gap-3">
                  {productForm.images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-16 h-20 rounded-xl overflow-hidden border border-[#eadfc8]"
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Ավելացնել նկարի URL..."
                    className="flex-1 min-w-[200px] rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3 py-1.5 text-xs text-[#2b2119]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-1.5 rounded-xl border border-[#caaf83] bg-[#faf5ef] font-semibold text-xs text-[#33271d]"
                  >
                    Ավելացնել URL
                  </button>
                  <label className="cursor-pointer flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#33271d] text-[#caaf83] font-semibold text-xs hover:bg-[#221812] transition-colors">
                    {isUploadingImage ? <RefreshCw size={13} className="animate-spin" /> : <Upload size={13} />}
                    {isUploadingImage ? 'Վերբեռնվում է...' : 'Ֆայլերից (Storage / Local)'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFileUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Specifications Manager */}
              <div className="space-y-2 pt-2 border-t border-[#f2ece2]">
                <label className="block font-semibold text-[#4d3d33]">Տեխնիկական բնութագրեր</label>
                <div className="flex flex-wrap gap-2">
                  {productForm.specifications.map((spec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf5ef] border border-[#eadfc8] text-xs text-[#33271d]"
                    >
                      {spec}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(i)}
                        className="text-[#a89082] hover:text-[#c44]"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newSpec}
                    onChange={(e) => setNewSpec(e.target.value)}
                    placeholder="Օրինակ՝ 41 մմ պողպատե կորպուս"
                    className="flex-1 rounded-xl border border-[#eadfc8] bg-[#faf5ef] px-3 py-1.5 text-xs text-[#2b2119]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="px-4 py-1.5 rounded-xl border border-[#eadfc8] bg-white font-semibold text-xs text-[#2b2119]"
                  >
                    + Ավելացնել
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#eadfc8]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-3 rounded-full border border-[#eadfc8] text-xs font-semibold text-[#5d4c42]"
                >
                  Չեղարկել
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#33271d] text-[#caaf83] font-serif font-bold text-xs uppercase tracking-wider hover:bg-[#201712] transition-colors shadow-md"
                >
                  {editingProduct ? 'Պահպանել փոփոխությունները' : 'Ավելացնել ապրանքը'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IN-APP DELETE CONFIRMATION MODAL */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#eadfc8] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#fde8e8] text-[#c44] flex items-center justify-center mx-auto">
              <Trash2 size={22} />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-serif text-lg font-bold text-[#2b2119]">Հաստատել ջնջումը</h4>
              <p className="text-xs text-[#736358] leading-relaxed">
                Իսկապե՞ս ցանկանում եք հեռացնել «<strong>{deleteConfirmation.title}</strong>»-ը:
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 py-2.5 rounded-full border border-[#eadfc8] text-xs font-semibold text-[#5d4c42] hover:bg-[#faf5ef]"
              >
                Չեղարկել
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-full bg-[#c44] text-white text-xs font-bold hover:bg-[#a33] transition-colors shadow-sm"
              >
                Ջնջել
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
