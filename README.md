# Skincare E-Commerce Platform

A fullstack skincare e-commerce project for Topicrem and Novexpert products with Arabic/English multilingual support, built using Next.js, Express.js, MongoDB, and Cloudinary.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Repository Structure](#repository-structure)
- [Frontend](#frontend)
- [Backend](#backend)
- [Internationalization (i18n)](#internationalization-i18n)
- [Environment Variables](#environment-variables)
- [Setup and Run](#setup-and-run)
- [Development Workflow](#development-workflow)
- [Production Build](#production-build)
- [Architecture and Data Flow](#architecture-and-data-flow)
- [Conventions and Notes](#conventions-and-notes)

## Project Overview

This repository contains two main applications:

- `backend/`: Express.js + TypeScript API server with MongoDB persistence.
- `frontend/`: Next.js + React user-facing storefront with Tailwind CSS and multilingual support.

The system is designed for a skincare storefront with product browsing, order placement via WhatsApp, coupon validation, and admin-managed backend APIs.

## Key Features

- Product catalog for Topicrem and Novexpert brands
- Product detail pages with description, benefits, ingredients, and usage
- WhatsApp order flow with prefilled message generation
- Coupon validation and discounted price calculation
- MongoDB data persistence for products, orders, coupons, messages, visits, and admins
- JWT-based backend authentication for protected admin routes
- Cloudinary image upload support for backend product images
- Arabic and English localization with RTL/LTR support
- Modern UI using Tailwind CSS and Radix components

## Repository Structure

```
/ (project root)
  ├── backend/            # Express API server
  ├── frontend/           # Next.js storefront
  ├── PROJECT_ARCHITECTURE.md
  ├── README.md           # This file
  └── READMEmd.txt        # Existing text file
```

### Backend Structure

```
backend/
  package.json
  tsconfig.json
  src/
    config/
      cloudinary.ts
      database.ts
    controllers/
      analyticsController.ts
      authController.ts
      couponController.ts
      messageController.ts
      orderController.ts
      productController.ts
    middleware/
      auth.ts
    models/
      Admin.ts
      Coupon.ts
      CouponSettings.ts
      Message.ts
      Order.ts
      Product.ts
      Visit.ts
    routes/
      analytics.ts
      auth.ts
      coupon.ts
      messages.ts
      orders.ts
      products.ts
      upload.ts
    utils/
      password.ts
      seedAdmin.ts
    server.ts
```

### Frontend Structure

```
frontend/
  package.json
  tsconfig.json
  app/
    globals.css
    layout.tsx
    [locale]/
      layout.tsx
      page.tsx
      about/
      admin/
      brand/
      cart/
      checkout/
      contact/
      order-confirmed/
      product/
      api/
  components/
    brand-page-client-new.tsx
    brand-page-client.tsx
    cart-button.tsx
    cart-provider.tsx
    product-card.tsx
    site-footer.tsx
    site-header.tsx
    theme-provider.tsx
    VisitTracker.tsx
    ui/...
  data/
    store.json
  hooks/
    use-mobile.ts
    use-toast.ts
  lib/
    categories.ts
    products-data.ts
    products-old.ts
    products.ts
    store.ts
    utils.ts
  messages/
    ar.json
    en.json
  public/
    fonts/
    novexpertimage/
    skincareimages/
    topicremimage/
  src/
    i18n/
  styles/
    globals.css
```

## Frontend

The frontend is a Next.js application built for multi-locale rendering.

- Framework: Next.js 16
- UI: React + Tailwind CSS + Radix UI components
- State: React hooks and Context API
- Forms: `react-hook-form`
- Animations: `framer-motion`
- Localization: `next-intl` and custom locale-aware routing
- Static data: `frontend/data/store.json`

### Frontend Scripts

```bash
cd frontend
npm install
npm run dev
npm run build
npm run start
npm run lint
```

## Backend

The backend is an Express.js API server using TypeScript and MongoDB.

- Framework: Express 5
- Database: MongoDB via Mongoose
- Authentication: JWT tokens
- File upload: `multer` + Cloudinary
- Validation: `joi`

### Backend Scripts

```bash
cd backend
npm install
npm run dev
npm run build
npm start
npm run seed
```

## Internationalization (i18n)

The frontend supports Arabic and English locales.

- Default locale: Arabic (`ar`)
- Supported locales: `ar`, `en`
- Locale-aware routes live inside `frontend/app/[locale]/`
- Translation files in `frontend/messages/ar.json` and `frontend/messages/en.json`
- Arabic pages render RTL text direction and use Arabic font support

## Environment Variables

### Backend `.env`

Create `backend/.env` with:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skin-care
JWT_SECRET=your-secret-key-here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
PORT=5000
```

### Frontend `.env.local`

Create `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Setup and Run

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # if available
# edit .env with MongoDB and Cloudinary credentials
npm run seed
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
# create .env.local with API URL
npm run dev
```

### 3. Open the App

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## Development Workflow

Run both apps concurrently:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Reload the browser while editing frontend or backend source files.

## Production Build

Build both applications before deploying.

```bash
cd backend
npm run build
npm start

cd frontend
npm run build
npm start
```

## Architecture and Data Flow

### Frontend → Backend

The frontend calls API routes under `frontend/app/api/`.
These routes may proxy requests to the backend or read local JSON data.

### Backend Services

The backend handles:

- Product CRUD
- Order processing
- Coupon validation
- Message logging
- Analytics and visit tracking
- Admin authentication

### Order Flow

Customers place orders through the frontend form.
The app sends order data to `/api/orders`, which can store orders and generate a WhatsApp message link for checkout.

## Conventions and Notes

### Backend Conventions

- Use `camelCase` for variables and functions
- Keep validation in controllers with `joi`
- Use async/await in all async flows
- Store bilingual content in objects like `{ en: string, ar: string }`

### Frontend Conventions

- Use `kebab-case` for filenames
- Use `useTranslations()` for all user-facing text
- Mark client components with `"use client"`
- Prefer server components by default in Next.js

### Known Project Details

- Brands are limited to `Topicrem` and `Novexpert`
- Prices are displayed in JOD
- The product page and brand pages should support SKU details, descriptions, benefits, and ingredients
- The frontend should preserve locale context in all navigation links

## Troubleshooting

- If the backend cannot connect to MongoDB, verify `MONGODB_URI`
- If images fail to upload, check Cloudinary credentials
- If translations are missing, verify keys in `frontend/messages/ar.json` and `frontend/messages/en.json`
- If the frontend does not display Arabic correctly, confirm `dir="rtl"` is applied on Arabic pages

## Recommended Next Improvements

- Add admin frontend for product and coupon management
- Add customer authentication and order history
- Add payment gateway integration
- Complete missing localization in any hardcoded frontend strings
- Add automated tests for backend routes and frontend components

---

This README summarizes the full project architecture, install steps, directory layout, and runtime behavior for both the backend and frontend applications.