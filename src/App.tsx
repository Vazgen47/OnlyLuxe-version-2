import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CartPage } from './pages/CartPage';
import { AboutPage } from './pages/AboutPage';
import { WarrantyPage } from './pages/WarrantyPage';
import { DeliveryPage } from './pages/DeliveryPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useStore } from './context/StoreContext';

function AppContent() {
  const location = useLocation();
  const { isAdminAuthenticated } = useStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="catalog/:category" element={<CatalogPage />} />
            <Route path="watches" element={<CatalogPage initialCategory="Ժամացույցներ" />} />
            <Route path="watches/:brand" element={<CatalogPage initialCategory="Ժամացույցներ" />} />
            <Route path="bags" element={<CatalogPage initialCategory="Պայուսակներ" />} />
            <Route path="wallets" element={<CatalogPage initialCategory="Դրամապանակներ" />} />
            <Route path="men" element={<CatalogPage initialAudience="Տղամարդու" />} />
            <Route path="women" element={<CatalogPage initialAudience="Կանացի" />} />
            <Route path="couples" element={<CatalogPage initialAudience="Զույգերի" />} />
            <Route path="product/:slug" element={<ProductDetailPage />} />
            <Route path="favorites" element={<FavoritesPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="warranty" element={<WarrantyPage />} />
            <Route path="delivery" element={<DeliveryPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route
              path="admin/login"
              element={isAdminAuthenticated ? <Navigate to="/admin" replace /> : <AdminLoginPage />}
            />
            <Route
              path="admin"
              element={isAdminAuthenticated ? <AdminDashboardPage /> : <Navigate to="/admin/login" replace />}
            />
            <Route
              path="admin/*"
              element={isAdminAuthenticated ? <AdminDashboardPage /> : <Navigate to="/admin/login" replace />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return <AppContent />;
}
