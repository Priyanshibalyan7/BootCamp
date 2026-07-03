# shop.co — React E-Commerce App

A fully-featured e-commerce app built with React, React Router DOM, and the free Fake Store API.

## Features
- 🛒 **Cart** — Add, remove, adjust quantity, live total in slide-in drawer
- ❤️ **Wishlist** — Save/unsave items from any page
- 💰 **Cart total** — Always visible in drawer + item count badge in nav
- 🔍 **Search + filter + sort** — On the products page
- 🔔 **Toast notifications** — For every cart/wishlist action
- 💀 **Skeleton loaders** — While API data loads
- ✨ **Animations** — Stagger, fadeUp, slideIn, shimmer, hover effects

## Pages
| Route | Page |
|-------|------|
| `/` | Home — hero + featured products |
| `/products` | Full catalog with search/filter/sort |
| `/product/:id` | Product detail with related items |
| `/wishlist` | Saved items |
| `/checkout` | Order confirmation |

## Stack
- **React 18** + hooks (useState, useEffect, useContext, useCallback)
- **React Router DOM v6** — client-side routing
- **Fake Store API** — free, no key needed (https://fakestoreapi.com)
- **Vite** — build tool

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:5173
```

## Project Structure

```
src/
├── api/            # Fake Store API fetch helpers
├── components/
│   ├── layout/     # Navbar, Footer, CartDrawer
│   ├── ui/         # ProductCard, Stars, SkeletonCard, etc.
│   └── common/     # Button, Badge
├── constants/      # Route paths
├── context/        # Cart, Wishlist, Toast providers
├── hooks/          # useCart, useWishlist, useToast, useProducts
├── pages/          # One file per route
├── styles/         # CSS split by concern
└── utils/          # formatPrice, filterProducts
```
