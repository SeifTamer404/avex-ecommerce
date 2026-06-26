<div align="center">

<img src="./public/logo.png" alt="AVEX Logo" width="140" />

# AVEX — Premium E-Commerce Platform

**A full-stack, production-grade marketplace built with Next.js 16, MongoDB, and Redux Toolkit.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.6-green)](https://www.better-auth.com/)
[![License](https://img.shields.io/badge/License-Private-red)](./LICENSE)

</div>

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Live Features](#-live-features)
3. [Tech Stack](#-tech-stack)
4. [Project Architecture](#-project-architecture)
5. [Directory Structure](#-directory-structure)
6. [Database Design](#-database-design)
7. [Authentication System](#-authentication-system)
8. [State Management](#-state-management)
9. [API Routes & Server Actions](#-api-routes--server-actions)
10. [Pages & Routing](#-pages--routing)
11. [UI Components](#-ui-components)
12. [Styling System](#-styling-system)
13. [SEO & Performance](#-seo--performance)
14. [Getting Started](#-getting-started)
15. [Environment Variables](#-environment-variables)
16. [Database Seeding](#-database-seeding)
17. [Scripts Reference](#-scripts-reference)

---

## 🌟 Project Overview

**AVEX** is a full-stack e-commerce web application built from scratch as a production-ready marketplace. It supports browsing across **6 product categories**, full **cart management**, **user authentication**, **checkout with server-side order creation**, and a rich **account dashboard** — all built on a modern React Server Components architecture.

The platform prioritizes:
- **Performance** — ISR caching, parallel data fetching, lean server queries
- **Security** — server-side price validation, session-verified checkout, protected routes
- **UX** — dark/light mode, glassmorphism, smooth animations, mobile-first layout
- **Code Quality** — feature-sliced architecture, clean separation of server/client concerns

---

## ✅ Live Features

### 🛍️ Shopping Experience
| Feature | Details |
|---|---|
| **Homepage Hero** | Gradient mesh background with animated floating product cards |
| **Featured Products** | ISR-cached product row from `featured: true` DB query |
| **Category Grid** | 6 gradient category tiles with hover animations |
| **Promo Banners** | Editorial bento-layout promotional banners |
| **Product Listing** | Paginated grid with filter panel (price range, sort) |
| **Product Detail** | Image gallery, specs tabs, rating, add-to-cart, wishlist |
| **Related Products** | Same-category recommendations on product page |
| **Search** | Full-text MongoDB search with relevance scoring |
| **New Arrivals** | Dedicated page for newest products |
| **Deals** | Dedicated page for discounted/on-sale products |

### 🔐 Authentication
| Feature | Details |
|---|---|
| **Register** | Email + password sign-up with form validation via Zod |
| **Login** | Session-based login with redirect-back support |
| **Logout** | Session destruction via Better Auth |
| **Route Protection** | Middleware-level guard on `/account/*` and `/checkout/*` |
| **Guest Redirect** | Logged-in users redirected away from `/login` and `/register` |

### 🛒 Cart & Checkout
| Feature | Details |
|---|---|
| **Cart Drawer** | Slide-out cart panel accessible from any page |
| **Persistent Cart** | Cart survives page reload via `redux-persist` + localStorage |
| **Add / Remove Items** | Quantity controls with live subtotal recalculation |
| **Checkout Form** | Multi-section: Shipping → Delivery Method → Payment |
| **Delivery Options** | Standard (free) vs Priority (+$12) |
| **Server-Side Validation** | Price & stock verified on the server before order creation |
| **Tax Calculation** | 8% tax calculated server-side |
| **Order Confirmation** | Dedicated confirmation page with order summary |

### 👤 Account Dashboard
| Feature | Details |
|---|---|
| **Dashboard Overview** | Total orders, active deliveries, loyalty points |
| **Order History** | Paginated order list with status filter |
| **Order Detail** | Populated order with product images, tracking status |
| **Wishlist** | Add/remove products, persisted to MongoDB |
| **Address Book** | Full CRUD — add, edit, delete, set default address |
| **Profile Settings** | Update name, avatar, change password |
| **Notification Prefs** | Toggle email notification types |
| **Help Center** | FAQ & support page |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.4 | Framework — App Router, SSR, ISR, Server Actions |
| **React** | 19.2.4 | UI rendering, concurrent features |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Redux Toolkit** | 2.11.2 | Global client state management |
| **redux-persist** | 6.0.0 | Cart persistence in localStorage |
| **next-themes** | 0.4.6 | Dark/light mode switching |
| **lucide-react** | 1.21.0 | Icon library |
| **Material Symbols** | Google CDN | Icon system (outlined style) |
| **Inter** | Google Fonts | Body typeface |
| **Plus Jakarta Sans** | Google Fonts | Display/heading typeface |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js API Routes** | 16.2.4 | REST endpoints (auth handler) |
| **Next.js Server Actions** | 16.2.4 | Server-side mutations |
| **MongoDB Atlas** | Cloud | Primary database |
| **Mongoose** | 9.4.1 | ODM — schema definition, queries |
| **Better Auth** | 1.6.20 | Authentication framework (session-based) |
| **Zod** | 4.4.3 | Runtime schema validation |

### Developer Tools
| Tool | Purpose |
|---|---|
| **@faker-js/faker** | Realistic seed data generation |
| **dotenv** | Environment variable loading in scripts |
| **ESLint** | Code quality enforcement |
| **PostCSS** | CSS processing for Tailwind v4 |

---

## 🏗️ Project Architecture

AVEX uses **Next.js App Router** with a **feature-sliced** approach:

```
Server Components (RSC) ──── fetch data directly from MongoDB
       │
       ▼
Client Components ────────── receive serialized data as props
       │                      dispatch Redux actions
       ▼
Redux Store ──────────────── cart (persisted), ui, user slices
       │
       ▼
Server Actions ───────────── mutations (place order, update profile)
       │                      always auth-verified server-side
       ▼
MongoDB Atlas ────────────── via Mongoose + cached connection pool
```

### Key Design Decisions

1. **Server Components First**: All pages are Server Components by default. Data is fetched directly on the server — no client-side data fetching waterfalls.
2. **Serialization Pattern**: `.lean()` + `JSON.parse(JSON.stringify())` ensures MongoDB BSON objects (ObjectIds, Dates) are safely serialized before crossing the server→client boundary.
3. **Cached DB Connection**: `lib/db.js` uses a `global._mongooseCache` to survive Next.js hot-reload without opening multiple connections.
4. **Lazy Auth Init**: `lib/auth.js` lazily initializes Better Auth on first request, ensuring the DB connection exists before extracting native MongoDB handles.
5. **SSR-Safe Redux**: The Redux store uses a custom `createStorage()` that returns a no-op on the server and real `localStorage` on the client — preventing "failed to create sync storage" SSR warnings.

---

## 📁 Directory Structure

```
avex/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route Group — no shared layout
│   │   ├── layout.js             # Minimal auth layout (no Navbar/Footer)
│   │   ├── login/
│   │   │   ├── layout.jsx        # Login page metadata
│   │   │   └── page.jsx          # Login form page
│   │   └── register/
│   │       └── page.jsx          # Registration form page
│   ├── account/                  # Protected dashboard pages
│   │   ├── layout.js             # Dashboard layout with sidebar nav
│   │   ├── loading.js            # Dashboard skeleton loader
│   │   ├── error.js              # Dashboard error boundary
│   │   ├── page.js               # Account overview / dashboard home
│   │   ├── orders/
│   │   │   ├── page.js           # Order history list
│   │   │   └── [id]/page.js      # Single order detail
│   │   ├── wishlist/page.js      # Saved products (wishlist)
│   │   ├── addresses/page.js     # Address book management
│   │   ├── settings/page.js      # Profile & password settings
│   │   └── help/page.js          # Help center / FAQ
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/         # Better Auth catch-all API route
│   │           └── route.js      # Handles all auth HTTP requests
│   ├── cart/                     # Cart page (dedicated route)
│   ├── categories/               # Category listing page
│   ├── checkout/
│   │   ├── layout.jsx            # Checkout layout wrapper
│   │   └── page.jsx              # Checkout multi-step form
│   ├── deals/                    # Sale / discounted products page
│   ├── new-arrivals/             # Newest products page
│   ├── order-confirmed/          # Post-checkout confirmation page
│   ├── products/
│   │   └── [slug]/               # Dynamic product detail page
│   │       ├── page.js           # Product detail with metadata
│   │       ├── loading.js        # Product skeleton loader
│   │       └── error.js          # Product error boundary
│   ├── search/
│   │   ├── page.js               # Full-text search results page
│   │   └── loading.js            # Search skeleton
│   ├── globals.css               # Global CSS — design tokens & utilities
│   ├── layout.js                 # Root layout (fonts, providers, nav)
│   ├── loading.js                # Global loading skeleton
│   ├── not-found.js              # 404 page
│   ├── error.js                  # Global error boundary
│   ├── robots.js                 # /robots.txt generation
│   └── sitemap.js                # Dynamic XML sitemap generation
│
├── components/                   # Shared UI components
│   ├── layout/
│   │   ├── Navbar.jsx            # Top navigation bar (glassmorphism)
│   │   ├── BottomNav.jsx         # Mobile bottom navigation bar
│   │   ├── CartDrawer.jsx        # Slide-out cart panel
│   │   ├── Footer.jsx            # Site footer with links & newsletter
│   │   └── NewsletterForm.jsx    # Newsletter subscription form
│   ├── providers/
│   │   ├── Index.jsx             # Root provider composition
│   │   ├── ReduxProvider.jsx     # Redux store + PersistGate wrapper
│   │   ├── ThemeProvider.jsx     # next-themes dark/light provider
│   │   └── AuthSync.jsx          # Syncs Better Auth session → Redux
│   ├── account/
│   │   ├── AccountSidebarNav.jsx # Dashboard sidebar navigation
│   │   ├── AddressManager.jsx    # Address CRUD component
│   │   ├── SettingsManager.jsx   # Profile & password settings UI
│   │   └── HelpCenter.jsx        # FAQ accordion & support links
│   └── ui/
│       ├── Button.jsx            # Polymorphic button (primary/secondary/ghost)
│       ├── Input.jsx             # Styled input with label & error state
│       ├── Badge.jsx             # Status/label badge component
│       ├── CartButton.jsx        # Navbar cart icon with item count badge
│       ├── NotificationContainer.jsx # Toast notification system
│       └── ErrorBoundaryUI.jsx   # Error boundary fallback UI
│
├── features/                     # Feature-sliced modules
│   ├── products/
│   │   ├── actions.js            # Server Actions: get, search, filter products
│   │   ├── ProductCard.jsx       # Product grid card with wishlist button
│   │   ├── ProductSkeletonCard.jsx # Loading placeholder card
│   │   ├── FilterPanel.jsx       # Category/price/sort filter sidebar
│   │   ├── ImageGallery.jsx      # Product image viewer
│   │   ├── ProductTabs.jsx       # Description/specs/reviews tabs
│   │   ├── ProductActions.jsx    # Add-to-cart + quantity selector
│   │   ├── AddToCartButton.jsx   # Standalone add-to-cart CTA
│   │   └── WishlistButton.jsx    # Heart toggle for wishlist
│   ├── cart/
│   │   ├── CartItem.jsx          # Individual cart item row
│   │   └── OrderSummary.jsx      # Cart subtotal / order total panel
│   ├── checkout/
│   │   ├── CheckoutClient.jsx    # Main checkout form orchestrator
│   │   ├── CheckoutSummary.jsx   # Right-panel order summary
│   │   ├── ShippingForm.jsx      # Shipping address form
│   │   ├── DeliveryMethod.jsx    # Standard/Priority delivery selector
│   │   └── PaymentSection.jsx    # Payment method selector (COD / Card)
│   ├── orders/
│   │   └── actions.js            # Server Actions: place order
│   └── user/
│       └── actions.js            # Server Actions: profile, addresses, wishlist
│
├── lib/
│   ├── db.js                     # Mongoose connection with global cache
│   ├── auth.js                   # Better Auth server instance (lazy init)
│   └── auth-client.js            # Better Auth browser client + hooks
│
├── models/
│   ├── Product.js                # Mongoose Product schema & text indexes
│   ├── User.js                   # Mongoose User schema with addresses
│   └── Order.js                  # Mongoose Order schema with items
│
├── store/
│   ├── index.js                  # Redux store config + persistor
│   └── slices/
│       ├── cartSlice.js          # Cart state: items, itemCount, subtotal
│       ├── uiSlice.js            # UI state: cart open, notifications
│       └── userSlice.js          # User state: session data, wishlist
│
├── scripts/
│   └── seed.mjs                  # DB seed script (100 products × 6 categories)
│
├── public/
│   ├── logo.png                  # Brand logo
│   └── images/                   # Static assets
│
├── proxy.js                      # Next.js middleware (route protection)
├── next.config.mjs               # Next.js configuration
├── postcss.config.mjs            # PostCSS + Tailwind v4 config
├── jsconfig.json                 # Path aliases (@/ → root)
├── eslint.config.mjs             # ESLint configuration
├── .env.local                    # Environment variables (not committed)
└── package.json                  # Dependencies & scripts
```

---

## 🗄️ Database Design

AVEX uses **MongoDB Atlas** as its database. Three collections are managed through Mongoose schemas.

### `Product` Collection

```js
{
  name:           String,     // Product display name
  slug:           String,     // URL-safe unique identifier (e.g. "electronics-pro-wireless-earbuds")
  price:          Number,     // Current selling price
  compareAtPrice: Number,     // Original price — null if not on sale
  category:       String,     // Enum: electronics | fashion | home-living | beauty | groceries | toys
  images:         [String],   // Array of image URLs (Picsum Photos for seed data)
  stock:          Number,     // Available inventory count
  description:    String,     // Long-form product description
  rating:         Number,     // 0–5 average rating
  reviewCount:    Number,     // Number of reviews
  featured:       Boolean,    // Appears on homepage "Trending Today" row
  specs:          [{ key, value }], // Product specification key-value pairs
  createdAt:      Date,       // Mongoose timestamps
  updatedAt:      Date
}
```

**Indexes on `Product`:**
| Index | Purpose |
|---|---|
| `{ category: 1, featured: -1 }` | Fast category page + featured filtering |
| `{ price: 1 }` | Price range queries & sorting |
| `{ name: "text", description: "text", category: "text" }` | Full-text search (name weighted 3×) |

---

### `User` Collection

> Managed jointly by Better Auth (session data) and our Mongoose schema (business data).

```js
{
  name:               String,    // Display name
  email:              String,    // Unique, lowercase — used for login
  passwordHashed:     String,    // Bcrypt hash (managed by Better Auth)
  role:               String,    // Enum: customer | user | admin | seller
  points:             Number,    // Loyalty points balance
  avatar:             String,    // Profile image URL
  emailOrderUpdates:  Boolean,   // Notification preference
  emailPromotions:    Boolean,   // Notification preference
  emailNewArrivals:   Boolean,   // Notification preference
  wishlist:           [String],  // Array of product IDs
  addresses: [{                  // Embedded address sub-documents
    fullName:        String,
    phone:           String,
    street:          String,
    city:            String,
    state:           String,
    country:         String,
    zip:             String,
    buildingDetails: String,
    isDefault:       Boolean     // Only one address can be default
  }],
  createdAt:          Date,
  updatedAt:          Date
}
```

---

### `Order` Collection

```js
{
  user:           ObjectId,    // Reference → User
  items: [{
    product:      ObjectId,    // Reference → Product
    quantity:     Number,      // Units ordered
    price:        Number       // Server-verified unit price at order time
  }],
  status:         String,      // Enum: pending | processing | shipped | delivered | cancelled
  deliveryMethod: String,      // Enum: standard | priority
  total:          Number,      // Server-calculated final total (items + shipping + 8% tax)
  address: {
    fullName:        String,
    phone:           String,
    street:          String,
    city:            String,
    buildingDetails: String    // State, ZIP, Country joined
  },
  createdAt:      Date,
  updatedAt:      Date
}
```

---

## 🔐 Authentication System

Authentication is powered by **[Better Auth](https://www.better-auth.com/)** — a modern, framework-agnostic auth library.

### How It Works

```
Client                    Server (Next.js)               MongoDB
  │                             │                            │
  │── POST /api/auth/sign-in ──▶│                            │
  │                             │── betterAuth.handler() ───▶│
  │                             │◀─── session cookie ────────│
  │◀── Set-Cookie (session) ────│                            │
  │                             │                            │
  │  (subsequent requests)      │                            │
  │── Cookie in header ────────▶│                            │
  │                             │── getSession(headers) ────▶│
  │                             │◀─── user object ───────────│
```

### Key Files

| File | Role |
|---|---|
| `lib/auth.js` | Server-side Better Auth instance — lazily initialized to ensure DB is ready. Defines extended user fields (role, points, wishlist, notification prefs). |
| `lib/auth-client.js` | Browser-side auth client — exports `useSession`, `signIn`, `signUp`, `signOut` hooks/functions. |
| `app/api/auth/[...all]/route.js` | Catch-all API route that passes all `/api/auth/*` requests to the Better Auth handler. |
| `proxy.js` | Next.js middleware — cookie-only session check (no DB hit) for route-level guards. |
| `components/providers/AuthSync.jsx` | Client component that watches `useSession()` and keeps Redux `userSlice` in sync. |

### Route Protection Strategy

```
Request to /account/* or /checkout/*
         │
         ▼
    proxy.js (middleware)
         │
    getSessionCookie() ← reads cookie header (no DB)
         │
    ┌────┴────┐
    │ No cookie│ Yes cookie
    ▼          ▼
 Redirect    Allow + continue
 /login      to page
```

---

## 🔄 State Management

Global client state is managed with **Redux Toolkit** and **redux-persist**.

### Store Slices

#### `cartSlice` — Persisted to `localStorage`

```
State Shape:
{
  items: [{ productId, slug, name, price, image, quantity }],
  itemCount: number,   // derived — sum of all quantities
  subtotal: number     // derived — sum of price × quantity
}

Actions:
  addToCart(product)              → push new item or increment existing
  removeFromCart(productId)       → filter item out
  updateQuantity({ productId, newQty }) → set quantity (0 = remove)
  clearCart()                     → reset to empty (called post-checkout)
```

#### `userSlice` — Not Persisted (managed by AuthSync)

```
State Shape:
{
  id, name, email, avatar, role, points,
  wishlist: [],
  isAuthenticated: boolean
}

Actions:
  setUser(userData)       → populated after login (by AuthSync)
  clearUser()             → reset after logout (by AuthSync)
  setWishlist(ids)        → replace entire wishlist array
  toggleWishlist(id)      → add/remove single product from wishlist
}
```

#### `uiSlice` — Not Persisted (always fresh on boot)

```
State Shape:
{
  isCartOpen: boolean,
  isSidebarOpen: boolean,
  searchQuery: string,
  notifications: []     // toast notifications array
}

Actions:
  toggleCart()
  setIsCartOpen(bool)
  toggleSidebar()
  setSearchQuery(query)
  addNotification(notification)
  removeNotification(id)
}
```

### Persistence Configuration

Only the `cart` slice is persisted:

```js
// store/index.js
const cartPersistConfig = { key: "cart", storage, version: 1 };
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
```

**Why only cart?**
- `uiSlice` (drawer open state, notifications) should always boot fresh.
- `userSlice` is managed by `AuthSync` which reads the live Better Auth session — persisting it would cause stale data.

**SSR Safety**: A custom `createStorage()` returns a no-op storage on the server and real `localStorage` on the client, preventing SSR warnings.

---

## 🔌 API Routes & Server Actions

### API Routes

| Route | File | Method | Description |
|---|---|---|---|
| `/api/auth/[...all]` | `app/api/auth/[...all]/route.js` | GET/POST | Better Auth catch-all — handles sign-in, sign-up, sign-out, session |
| `/api/products/related` | `app/api/products/related/route.js` | GET | Returns related products for a given category |

### Server Actions

All data mutations are Server Actions (`"use server"`) — they run on the server and are called directly from client components.

#### `features/products/actions.js`

| Action | Description |
|---|---|
| `getFeaturedProducts()` | Returns up to 12 featured products, sorted by newest. Powers homepage hero row. |
| `getProducts(options)` | Paginated + filtered product list. Supports `category`, `page`, `sort`, `minPrice`, `maxPrice`, `search`. |
| `getProductBySlug(slug)` | Full product detail by URL slug. Returns `null` if not found. |
| `getRelatedProducts(category, excludeId, limit)` | Top-rated products in same category, excluding current product. |
| `searchProducts(query, limit)` | Fast full-text search using MongoDB text index. Used by Navbar dropdown. |

#### `features/orders/actions.js`

| Action | Description |
|---|---|
| `placeOrderAction(payload)` | Full checkout pipeline: authenticate → validate cart → verify stock → calculate total → create order → decrement stock. Returns `{ ok, orderId }` or `{ ok, error }`. |

**Order Creation Flow (6 Steps):**
1. Verify Better Auth session — no unauthenticated orders
2. Validate cart item shape (valid ObjectId, qty ≥ 1)
3. Bulk-fetch products from DB — verify existence and stock
4. Recalculate total server-side (items + shipping + 8% tax)
5. Create `Order` document in MongoDB
6. Decrement stock with `Product.bulkWrite()` for efficiency

#### `features/user/actions.js`

| Action | Description |
|---|---|
| `getDashboardData(userId)` | Parallel fetch: order count, active deliveries, points, recent orders |
| `getOrders(userId, opts)` | Paginated order history with status filter |
| `getOrderById(orderId, userId)` | Populated order detail (product names, images) |
| `updateUserProfile(userId, data)` | Update name and/or avatar URL |
| `addAddress(userId, addressData)` | Add address to embedded array; auto-default if first |
| `updateAddress(userId, addressId, data)` | Update specific address, handle default flag logic |
| `deleteAddress(userId, addressId)` | Remove address; auto-promote next to default |
| `setDefaultAddress(userId, addressId)` | Set one address as default, clear all others |
| `updateNotificationPreferences(userId, prefs)` | Update email notification toggles |
| `changeUserPassword(current, new)` | Change password via Better Auth API |
| `addToWishlist(productId)` | `$addToSet` on user's wishlist array (no duplicates) |
| `removeFromWishlist(productId)` | `$pull` product from wishlist |
| `getWishlist()` | Fetch full product documents for all wishlisted IDs |

---

## 📄 Pages & Routing

| Route | Component | Rendering | Description |
|---|---|---|---|
| `/` | `app/page.js` | SSG (ISR 10min) | Homepage: hero, trending, banners, categories |
| `/login` | `app/(auth)/login/page.jsx` | Static | Email/password login form |
| `/register` | `app/(auth)/register/page.jsx` | Static | Account creation form |
| `/products/[slug]` | `app/products/[slug]/page.js` | SSR | Full product detail page |
| `/categories` | `app/categories/page.js` | SSR | All categories overview |
| `/categories/[slug]` | `app/categories/[slug]/page.js` | SSR | Category product listing + filters |
| `/search` | `app/search/page.js` | SSR | Full-text search results |
| `/new-arrivals` | `app/new-arrivals/page.js` | SSR | Newest products by `createdAt` |
| `/deals` | `app/deals/page.js` | SSR | Products where `compareAtPrice != null` |
| `/cart` | `app/cart/page.js` | Client | Cart review page |
| `/checkout` | `app/checkout/page.jsx` | Client | Multi-step checkout form |
| `/order-confirmed` | `app/order-confirmed/page.js` | Client | Post-order success page |
| `/account` | `app/account/page.js` | SSR | Dashboard overview |
| `/account/orders` | `app/account/orders/page.js` | SSR | Order history |
| `/account/orders/[id]` | `app/account/orders/[id]/page.js` | SSR | Order detail |
| `/account/wishlist` | `app/account/wishlist/page.js` | SSR | Saved products |
| `/account/addresses` | `app/account/addresses/page.js` | Client | Address book management |
| `/account/settings` | `app/account/settings/page.js` | Client | Profile & password |
| `/account/help` | `app/account/help/page.js` | Client | Help center |

---

## 🧩 UI Components

### Layout Components

#### `Navbar.jsx`
Full-featured glassmorphism navigation bar:
- Brand logo + navigation links (desktop)
- Live search bar with dropdown results (powered by `searchProducts` Server Action)
- Dark/light mode toggle
- Cart icon button with item count badge
- Auth-aware: shows account menu when logged in, login link when guest
- Sticks to top with `backdrop-filter: blur(16px)`

#### `CartDrawer.jsx`
Slide-out overlay cart panel:
- Opens/closes via Redux `uiSlice.isCartOpen`
- Lists all cart items with thumbnail, quantity controls, and remove button
- Shows running subtotal + checkout CTA
- Empty state illustration

#### `BottomNav.jsx`
Mobile-only bottom navigation bar (hidden on `md+`):
- Home, Categories, Search, Account quick links
- Shows cart item count badge on cart icon

#### `Footer.jsx`
Full-width site footer:
- Brand section with tagline
- Category quick-links
- Newsletter subscription form
- Legal links and copyright

### Reusable UI Components

#### `Button.jsx`
Polymorphic button component:
```jsx
<Button type="primary" size="md" href="/shop">Shop Now</Button>
// Renders as <a> when href is provided, <button> otherwise
// Types: primary | secondary | ghost | danger
// Sizes: sm | md | lg
```

#### `Input.jsx`
Styled form input with full error state:
```jsx
<Input label="Email" type="email" error={errors.email} {...register("email")} />
```

#### `Badge.jsx`
Status/label pill badge:
```jsx
<Badge variant="success">Delivered</Badge>
// Variants: default | success | warning | danger | info
```

#### `NotificationContainer.jsx`
Toast notification system driven by `uiSlice.notifications`:
- Stacked notifications in bottom-right corner
- Auto-dismiss with configurable duration
- Types: success, error, info, warning

---

## 🎨 Styling System

AVEX uses **Tailwind CSS v4** with a custom design token system defined in `globals.css`.

### Design Tokens

```css
@theme {
  /* Brand Colors */
  --color-primary:       #134af1;    /* Electric Blue */
  --color-secondary:     #8a2be2;    /* Violet */
  --color-tertiary:      #ff00c1;    /* Magenta */
  --color-brand-purple:  #7500cc;    /* Deep Purple */

  /* Typography */
  --font-sans:    var(--font-inter);        /* Body text */
  --font-display: var(--font-jakarta);      /* Headings */

  /* Motion */
  --ease-kinetic: cubic-bezier(0.2, 0, 0, 1);  /* Material You easing */
}
```

### Adaptive Color System (Light / Dark Mode)

```css
:root { /* Light Mode */
  --color-surface:          #ffffff;
  --color-surface-low:      #f8fafc;
  --color-surface-highest:  #f1f5f9;
  --color-outline-variant:  rgba(0,0,0,0.1);
  --color-inverted-bg:      #000000;
}

.dark { /* Dark Mode */
  --color-surface:          #0a0a0a;
  --color-surface-low:      #141414;
  --color-surface-highest:  #1f1f1f;
  --color-outline-variant:  rgba(255,255,255,0.2);
  --color-inverted-bg:      #ffffff;
}
```

### Special Utilities

| Class | Effect |
|---|---|
| `.glass-header` | Glassmorphism: `backdrop-blur(16px)` + 60% surface color |
| `.bg-kinetic-pulse` | Primary → Brand Purple diagonal gradient |
| `.bg-surface` | Semantic surface background (adapts to theme) |
| `font-display` | Plus Jakarta Sans for headings |
| `font-sans` | Inter for body text |

### Typography Scale
- Display/Hero: `Plus Jakarta Sans`, `font-extrabold`, `tracking-tight`
- Body: `Inter`, `antialiased`
- Icons: `Material Symbols Outlined` (Google Fonts CDN) + `lucide-react`

---

## ⚡ SEO & Performance

### SEO Features

| Feature | Implementation |
|---|---|
| **Dynamic Sitemap** | `app/sitemap.js` — auto-generates XML with all product pages, category pages, and homepage |
| **Robots.txt** | `app/robots.js` — Next.js robots file generation |
| **Page Metadata** | Every page exports a `metadata` object (title, description, canonical) |
| **Global Title Template** | `"AVEX — %s"` applied via root layout metadata |
| **Semantic HTML** | `<article>`, `<section>`, `<nav>`, `<main>`, `aria-label` throughout |
| **Single H1 per Page** | Strict heading hierarchy enforced |
| **Canonical URLs** | Set on homepage and major landing pages |

### Performance Optimizations

| Technique | Where Applied |
|---|---|
| **ISR (10-minute revalidation)** | Homepage (`export const revalidate = 600`) |
| **Parallel Data Fetching** | `Promise.all()` in server components and server actions |
| **Lean Queries** | All Mongoose queries use `.lean()` — returns plain JS, not Mongoose documents |
| **Selective Field Projection** | `.select("_id name slug price images")` on search queries |
| **`next/image`** | Optimized image loading with remote pattern allowlist |
| **Compound DB Indexes** | `{ category: 1, featured: -1 }` and `{ price: 1 }` for fast queries |
| **Full-text Index** | MongoDB text index with field weights — single index covers all search queries |
| **Connection Pooling** | `global._mongooseCache` prevents multiple Mongoose connections per hot-reload |
| **PersistGate** | Delays render until localStorage hydration — prevents cart count flicker |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB 6+)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd avex

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI and auth secret

# 4. Seed the database with sample products
npm run seed

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
# ── Database ──────────────────────────────────────────────────────────────────
DB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?appName=<app>"

# ── Authentication ─────────────────────────────────────────────────────────────
BETTER_AUTH_SECRET="<random-64-char-hex-string>"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# ── App (Optional — used for sitemap & OG metadata) ───────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

| Variable | Required | Description |
|---|---|---|
| `DB_URI` | ✅ Yes | MongoDB connection string |
| `BETTER_AUTH_SECRET` | ✅ Yes | Secret key for signing sessions (min 32 chars) |
| `BETTER_AUTH_URL` | ✅ Yes | Server-side base URL for Better Auth API |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | ✅ Yes | Client-side base URL for auth requests |
| `NEXT_PUBLIC_APP_URL` | ⚠️ Optional | Used for sitemap and canonical URL generation |

> **Security Note**: Never commit `.env.local` to version control. It is already listed in `.gitignore`.

---

## 🌱 Database Seeding

The seed script populates the database with **100 realistic products** across 6 categories, complete with:
- Names, slugs, descriptions (via Faker.js)
- Price ranges per category
- ~40% of products flagged as "on sale" (have `compareAtPrice`)
- 3 featured products per category (for homepage row)
- Ratings between 3.2–5.0 and review counts between 4–1240
- Stock levels between 0–200
- Placeholder images from [Picsum Photos](https://picsum.photos) (stable, slug-based URLs)

```bash
npm run seed
```

**What the seed does:**
1. Reads `DB_URI` from `.env.local`
2. Connects to MongoDB
3. Wipes the existing `products` collection
4. Generates and inserts products for all 6 categories
5. Disconnects and exits

> ⚠️ The seed script wipes all existing products before inserting. Do not run on production without a backup.

---

## 📜 Scripts Reference

| Script | Command | Description |
|---|---|---|
| `dev` | `next dev` | Start development server with hot-reload |
| `build` | `next build` | Build production bundle |
| `start` | `next start` | Start production server (requires `build`) |
| `lint` | `eslint` | Run ESLint on the project |
| `seed` | `node scripts/seed.mjs` | Wipe + re-seed the products collection |

---

<div align="center">

Built with ❤️ by **Seif Tamer**

*AVEX — Everything You Love, Delivered.*

</div>
