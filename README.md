# ONLYLUXE × ICLONEEVN — Complete Luxury E-Commerce & Admin Platform

OnlyLuxe (OnlyLuxe × iCloneEvn) is an ultra-premium, full-featured online boutique for luxury watches (Rolex, Patek Philippe, Audemars Piguet, Hublot, Cartier, etc.), designer leather bags, and wallets in Yerevan, Armenia.

## Features

- **Storefront & Multipage Experience**:
  - Homepage with hero showcase, brand highlights, trust guarantees, and trending collections.
  - Multipage routes: Catalog, Watches, Bags, Wallets, Men's, Women's, Couples, Product Details, Cart, Favorites, About, Warranty, Delivery, FAQ, Contact, Privacy, Terms.
  - Currency formatted in Armenian Dram (֏ AMD).
  - Smooth animations with Framer Motion and responsive layouts styled with Tailwind CSS.

- **Admin Management Panel (`/admin`)**:
  - Real-time product creation, editing, deletion, and toggle visibility (publish/unpublish).
  - Multi-image file upload with preview and deletion.
  - Category and brand management with auto slug generation supporting Armenian and Latin scripts.
  - Order status tracking and customer contact message management.
  - Instant persistence via LocalStorage and optional Cloud Firestore / Storage synchronization.

- **Brand & Social Contacts**:
  - Phone: `055-31-61-91`
  - Instagram: `https://www.instagram.com/onlyluxe.evn/`
  - TikTok: `https://www.tiktok.com/@onlyluxe.evn`
  - Telegram: `https://t.me/+sAs7VSzcRhhjOTFi`
  - Agency signature: «Պատրաստված է Mkheyan Agency-ի կողմից»

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
npm run preview
```

### 4. Admin Access
Navigate to `/admin/login`.
- **Demo Access**: Click «Դեմո ռեժիմով մուտք» or enter password `admin123`.
- **Firebase Auth**: Connects automatically using the configured project credentials.
