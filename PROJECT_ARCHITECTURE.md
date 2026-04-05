# Skincare E-Commerce Fullstack Project - AI Agent Onboarding Guide

**Project Overview**: A French luxury skincare e-commerce platform selling Topicrem & Novexpert products with English/Arabic i18n support, built on Next.js + Express.js + MongoDB.

---

## 1. ARCHITECTURE OVERVIEW

### System Diagram
```
┌─────────────────────────────────────────┐
│  Frontend: Next.js 14+ (skincare/)      │
│  - Pages: [locale]/* (ar, en)           │
│  - Components: React + Framer Motion    │
│  - Styling: Tailwind + Radix UI         │
│  - i18n: next-intl (Arabic default)     │
└──────────────┬──────────────────────────┘
               │ HTTP/fetch
               ↓
┌──────────────────────────────────────────────────────────┐
│  Next.js API Routes (skincare/app/api/*)                 │
│  - Proxy to backend OR read local store.json             │
└──────────────┬───────────────────────────────────────────┘
               │ HTTP calls
               ↓
┌─────────────────────────────────────────────────────────┐
│  Backend: Express.js + TypeScript (backend/)             │
│  - Port: 5000 (default)                                 │
│  - Routes: /api/auth, /products, /orders, /analytics   │
│  - Database: Mongoose to MongoDB Atlas                  │
└──────────────────────────────────────────────────────────┘
```

### Frontend-Backend Communication

**Two-Layer Approach** (somewhat confusing legacy):
1. **Frontend API Routes** (`skincare/app/api/*`): Serve as proxy/adaptation layer
   - May forward to Express backend OR
   - May use local JSON store (`data/store.json`)
   
2. **Express Backend** (`backend/src/`): Primary API server
   - Connects to MongoDB
   - Handles authentication, products, orders, analytics
   - Uses middleware for auth (JWT)

**Key Point**: Frontend `fetch(/api/orders)` → Next.js route handler → May call backend OR local store.json

### Data Flow Examples

#### Getting Products
```
Frontend Component → fetch('/api/products') → 
Next.js Route (app/api/products/route.ts) → 
Reads store.json OR calls backend→ 
Returns Product[]
```

#### Placing Order
```
Product Card Modal → Post order data →
fetch('/api/orders', POST) →
Next.js Route Handler → 
Store in store.json + Backend →
Generate WhatsApp message link →
User opens WhatsApp with pre-filled order
```

#### Admin Login & Product Management (Backend-Direct)
```
Admin Tool/Postman →
POST /api/auth/login (backend:5000) →
Returns JWT token →
Use token to POST /api/products (backend:5000) →
Creates product in MongoDB
```

---

## 2. BUILD, TEST, RUN COMMANDS

### Backend Commands (`cd backend/`)

| Command | Purpose | Notes |
|---------|---------|-------|
| `npm install` | Install dependencies | Uses npm (not pnpm) |
| `npm run dev` | Start dev server (port 5000) | Uses nodemon, auto-reload |
| `npm run build` | Compile TypeScript to `dist/` | Outputs JavaScript |
| `npm start` | Run compiled server | From `dist/server.js` |
| `npm run seed` | Create first admin account | Reads ADMIN_EMAIL/PASSWORD from .env |
| `npm run test` | Run tests (PLACEHOLDER) | No tests configured yet |

**Dev Workflow**:
```bash
cd backend
npm install
cp .env.example .env && edit .env  # Add MongoDB URI, secrets
npm run seed                        # Create admin
npm run dev                         # Watch mode - watch src/* → compile & reload
```

### Frontend Commands (`cd skincare/`)

| Command | Purpose | Notes |
|---------|---------|-------|
| `npm install` OR `pnpm install` | Install dependencies | Uses pnpm-lock.yaml |
| `npm run dev` | Start Next.js dev server (port 3000) | Fast refresh enabled |
| `npm run build` | Build for production | Creates `.next/` |
| `npm start` | Serve production build | Requires prior `build` |
| `npm run lint` | Run ESLint | Check code quality |

**Dev Workflow**:
```bash
cd skincare
pnpm install
npm run dev           # Hot reload on file changes
# Open http://localhost:3000
```

### Both Running Together (Development)

**Terminal 1 - Backend**:
```bash
cd backend && npm run dev
# Output: Server running on port 5000
```

**Terminal 2 - Frontend**:
```bash
cd skincare && npm run dev
# Output: ▲ Next.js 14.x ready - http://localhost:3000
```

**Terminal 3 - MongoDB** (if local): 
```bash
mongod  # or use MongoDB Atlas in cloud (already configured)
```

### Production Build

**Backend**:
```bash
cd backend && npm run build && npm start
```

**Frontend**:
```bash
cd skincare && npm run build && npm start
```

---

## 3. PROJECT-SPECIFIC CONVENTIONS

### Naming Conventions

**Backend** (Express + TypeScript):
- **Files**: `camelCase.ts` or `snake_case.ts`
  - Models: `Product.ts`, `Order.ts`, `Admin.ts`
  - Controllers: `productController.ts`, `authController.ts`
  - Routes: `products.ts`, `auth.ts`
  - Middleware: `auth.ts`
  - Utils: `password.ts`, `seedAdmin.ts`

- **Functions/Methods**: `camelCase()`
  - `getProducts()`, `createOrder()`, `hashPassword()`

- **Interfaces**: `I[NOUN]`
  - `IProduct`, `IOrder`, `IAdmin`, `IMessage`

- **Database Collections**: Singular
  - `Product`, `Order`, `Admin`, `Message`, `Visit`

- **Enum Values**: String literals 
  - Brands: `'Topicrem' | 'Novexpert'` (exact case!)
  - Status: `'Pending' | 'Confirmed' | 'Delivered'`

**Frontend** (Next.js + React):
- **Files**: `kebab-case-with-suffix.tsx`
  - Pages: `page.tsx`, `layout.tsx`
  - Components: `product-card.tsx`, `site-header.tsx`, `cart-button.tsx`
  - Hooks: `use-mobile.ts`, `use-toast.ts`
  - Utilities: `utils.ts`, `store.ts`, `products.ts`

- **Components**: `PascalCase`
  - `ProductCard`, `SiteHeader`, `CartProvider`, `ThemeProvider`

- **Functions/Constants**: `camelCase` or `CONSTANT_CASE`
  - `fetchProducts()`, `useCart()`, `HERO_SLIDES`

- **Directories**: `kebab-case`
  - `app/[locale]`, `components/ui`, `lib/`

### File Organization Philosophy

**Backend**: MVC-like separation
```
models/      → Mongoose schemas + TypeScript interfaces
controllers/ → Business logic + request handlers
routes/      → Express route definitions
middleware/  → Auth, validation, error handling
config/      → Connections (DB, etc.)
utils/       → Reusable utilities (password, seed)
```

**Frontend**: Feature-based + utility-based
```
app/[locale]  → Page content + routing
components/ui → Atomic UI primitives (from Radix)
components/   → Feature components (ProductCard, Header)
lib/          → Data fetching + utilities
src/i18n/     → Internationalization configuration
messages/     → Translation JSON files
public/       → Static images, fonts
```

### Authentication & Middleware Approach

**Backend Authentication**:
- **Type**: JWT (JSON Web Token) issued by `/api/auth/login`
- **Storage**: Admin model in MongoDB (email + bcrypt-hashed password)
- **Token Format**: Bearer token in `Authorization: Bearer <token>` header
- **Expiration**: 1 hour from issue
- **Validation**: `auth.ts` middleware extracts & verifies token using `JWT_SECRET`

**Protected Routes**:
- **Product CRUD** (POST, PUT, DELETE): Auth required
- **Orders GET**: Auth required (but POST is public for customer orders)
- **Analytics/Admin endpoints**: Auth required

**Frontend**: 
- No centralized auth state (products/orders are mostly public)
- Admin login would require frontend UI (currently missing)
- Customers place orders without authentication

### i18n Approach

**Configuration**:
- **Router**: `next-intl/routing` defines locales
- **Middleware**: `middleware.ts` detects locale from URL
- **Namespace Pattern**: Translation keys organized by feature
  - `Nav`, `Home`, `Product`, `Cart`, `Checkout`, `Contact`, `About`, `Common`, `Footer`

**Usage Pattern**:
```tsx
"use client"
import { useTranslations, useLocale } from 'next-intl'

export default function Component() {
  const t = useTranslations('SectionName')     // Get translator
  const locale = useLocale()                   // 'ar' or 'en'
  const isArabic = locale === 'ar'
  
  return (
    <div dir={isArabic ? 'rtl' : 'ltr'}>
      <h1>{t('key')}</h1>  {/* Looks up SectionName.key */}
    </div>
  )
}
```

**Defaults**:
- Default locale: `'ar'` (Arabic)
- RTL applied automatically for Arabic
- LTR for English

---

## 4. KEY FILES EXEMPLIFYING PATTERNS

### Backend Patterns

#### 1. Data Model Pattern: [Product.ts](backend/src/models/Product.ts)
**Shows**: Mongoose schema with bilingual fields, enums, timestamps
```typescript
// Pattern: Bilingual fields (all user-facing text)
name: { en: string, ar: string }        // Always both languages
description: { en: string, ar: string }

// Pattern: Restricted enums
brand: 'Topicrem' | 'Novexpert'        // Only 2 options, case-sensitive
status: 'Pending' | 'Confirmed' | 'Delivered'

// Pattern: Currency fields  
price: number  // Always in JOD (Jordanian Dinar)

// Pattern: Timestamps
{ timestamps: true }  // Auto createdAt, updatedAt
```

#### 2. Controller Pattern: [productController.ts](backend/src/controllers/productController.ts)
**Shows**: CRUD operations, Joi validation, error handling, filtering
```typescript
// Pattern: REST endpoints
export const getProducts = async (req, res) => {
  const { brand, category } = req.query    // Extract filters
  const filter = {}
  
  // Pattern: Case-insensitive comparison
  if (brand) filter.brand = new RegExp(`^${brand}$`, 'i')
  
  const products = await Product.find(filter)
  res.json(products)
}

// Pattern: Validation before save
const { error } = productSchema.validate(req.body)
if (error) {
  res.status(400).json({ message: error.details[0].message })
  return
}
```

#### 3. Authentication Pattern: [authController.ts](backend/src/controllers/authController.ts)
**Shows**: Login, JWT issuance, password verification
```typescript
export const login = async (req, res) => {
  const { email, password } = req.body
  
  const admin = await Admin.findOne({ email })
  const isMatch = await comparePassword(password, admin.password)
  
  // Pattern: JWT token generation
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, 
    { expiresIn: '1h' })
  res.json({ token })
}
```

#### 4. Middleware Pattern: [auth.ts](backend/src/middleware/auth.ts)
**Shows**: TToken extraction and verification
```typescript
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')  // Extract
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)  // Verify
    req.admin = decoded  // Attach to request
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Usage: router.post('/create', authMiddleware, createProduct)
```

### Frontend Patterns

#### 1. Component with i18n: [site-header.tsx](skincare/components/site-header.tsx)
**Shows**: Locale switching, translated navigation, locale-aware Link
```typescript
"use client"
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/src/i18n/navigation'

export function SiteHeader() {
  const t = useTranslations('Nav')
  const locale = useLocale()
  const router = useRouter()
  
  // Pattern: Locale-aware links
  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') }
  ]
  
  // Pattern: Locale switching
  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as any })
  }
  
  return (
    <header dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Locale switcher button calls switchLocale('en') or switchLocale('ar') */}
    </header>
  )
}
```

#### 2. Cart Context Pattern: [cart-provider.tsx](skincare/components/cart-provider.tsx)
**Shows**: Client-side state management for shopping cart
```typescript
"use client"
import { createContext, useContext, useState } from 'react'

interface CartItem {
  id: string; name: string; price: number; quantity: number; brand: string; image: string
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }) {
  const [items, setItems] = useState<CartItem[]>([])
  
  const addToCart = (item) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      return existing 
        ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }]
    })
  }
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  return <CartContext.Provider value={{ items, addToCart, ...ops }}>{children}</CartContext.Provider>
}

// Usage: const { items, addToCart } = useCart()
```

#### 3. Order Form Pattern: [product-card.tsx](skincare/components/product-card.tsx)
**Shows**: Modal form, WhatsApp integration, backend API call
```typescript
"use client"
import { useForm } from 'react-hook-form'
import { useLocale } from 'next-intl'

export function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale()
  const { register, handleSubmit } = useForm<OrderFormData>()
  
  const onSubmit = async (data: OrderFormData) => {
    try {
      // Pattern: Save to backend
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: data.name,
          customerPhone: data.whatsappNumber,
          productName: locale === 'ar' ? product.name.ar : product.name.en,
          brand: product.brand,
          // ... other fields
        })
      })
    } catch (error) {
      console.error('Error:', error)
    }
    
    // Pattern: Generate WhatsApp message with encoded params
    const message = `New Order...\nCustomer: ${data.name}\n...`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/+962780686156?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')  // Opens WhatsApp
  }
  
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register('name', { required: true })} placeholder={t('name')} />
        {/* React Hook Form handles validation */}
      </form>
    </Dialog>
  )
}
```

#### 4. Data Fetching Pattern: [products.ts](skincare/lib/products.ts)
**Shows**: Fetch with error handling, filtering, type safety
```typescript
export interface Product {
  id: string; brand: string; category?: string; images: string[]; price: number
  name: { en: string; ar: string }
  description: { en: string; ar: string }
  howToUse: { en: string; ar: string }
}

export const fetchProducts = async (
  brand?: string,
  category?: string
): Promise<Product[]> => {
  try {
    const res = await fetch('/api/products')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    
    let data: Product[] = await res.json()
    
    // Pattern: Client-side filtering
    if (brand) {
      data = data.filter(p => 
        getField(p.brand, 'en').toLowerCase() === brand.toLowerCase()
      )
    }
    
    return data
  } catch (error) {
    console.error('Fetch error:', error)
    return []  // Graceful fallback
  }
}

function getField(val: string | { en: string; ar: string } | undefined, lang = 'en'): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  return lang === 'ar' ? val.ar : val.en
}
```

#### 5. Next.js API Route Pattern: [app/api/products/route.ts](skincare/app/api/products/route.ts)
**Shows**: Reading from local store.json, filtering, POST/GET patterns
```typescript
import { NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/store'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const brandQuery = searchParams.get('brand')
    
    const store = readStore()  // Read from data/store.json
    
    if (brandQuery) {
      const filtered = store.products.filter(product => {
        const productBrand = typeof product.brand === 'string' 
          ? product.brand 
          : product.brand?.en || ''
        return productBrand.toLowerCase() === brandQuery.toLowerCase()
      })
      return NextResponse.json(filtered)
    }
    
    return NextResponse.json(store.products)
  } catch (e) {
    return NextResponse.json([], { status: 200 })  // Graceful fail
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const store = readStore()
    const product = { ...body, id: Date.now().toString(), createdAt: new Date() }
    store.products.push(product)
    writeStore(store)  // Write back to data/store.json
    return NextResponse.json(product, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
```

---

## 5. DOCUMENTATION FILES

### Provided Documentation

| File | Location | Purpose |
|------|----------|---------|
| INTERNATIONALIZATION_SETUP.md | `skincare/` | i18n progress, completed + remaining work, translation status |
| TRANSLATION_STATUS.md | `skincare/` | Translation scope, coverage by page |
| This File | Root | Complete architecture guide |

### Key Code Comments

- **Backend Models**: Interfaces explain field purposes and types
- **Controllers**: Minimal comments (code is self-explanatory via Joi schemas)
- **Routes**: Clear route definitions with middleware application
- **Frontend Components**: Exported types document prop shapes
- **i18n Files**: JSON keys are self-documenting with logical nesting

### Key Insights from Code

1. **store.ts** ([skincare/lib/store.ts](skincare/lib/store.ts)): Shows local JSON persistence pattern - reads/writes to `data/store.json` as fallback when database unavailable

2. **seedAdmin.ts** ([backend/src/utils/seedAdmin.ts](backend/src/utils/seedAdmin.ts)): Shows setup pattern - idempotent script using environment variables for initial credentials

3. **password.ts** ([backend/src/utils/password.ts](backend/src/utils/password.ts)): Simple bcrypt wrapper showing hashing + comparison pattern

---

## 6. COMMON PITFALLS & ENVIRONMENT ISSUES

### Environment Configuration

**Backend `.env` (REQUIRED)**:
```bash
# Database connection (used by server.ts via connectDB)
MONGODB_URI=mongodb+srv://rmast2006_db_user:MHZurl6IDyzUjC2Q@cluster0.v5dxx0v.mongodb.net/skincare
# ⚠️ Already contains credentials in template - consider rotation

# JWT secret for admin auth token signing
JWT_SECRET=your-super-secret-jwt-key
# ⚠️ MUST be different per environment (dev/prod)

# Cloudinary image hosting
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin bootstrap credentials (for npm run seed)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword
# ⚠️ Change after first seed!

# Optional
PORT=5000  # Default if omitted
```

**Frontend**: No `.env` needed (Next.js dev server proxies to backend)

### Database Seeding Issues

**Issue**: "Admin already exists" when running `npm run seed`
- **Cause**: Script checks `Admin.findOne({ email })`
- **Fix**: Either delete admin in DB or use different email

**Issue**: MongoDB connection timeout
- **Cause**: MONGODB_URI invalid or MongoDB temporarily down
- **Fix**: Verify URI, check internet connection, ensure cluster whitelisted

**Issue**: "MONGODB_URI is not defined"
- **Cause**: `.env` file missing or `dotenv.config()` not called before use
- **Fix**: Create `.env` file, ensure `dotenv.config()` at top of `server.ts`

### Authentication Issues

**Issue**: "Invalid token" on admin routes
- **Cause**: Missing `Authorization` header or wrong format
- **Correct Format**: `Authorization: Bearer <token>`
- **Fix**: Include Bearer prefix, ensure token not expired (1h)

**Issue**: JWT expires after 1 hour during long sessions
- **Workaround**: Re-login before token expires OR extend `expiresIn: '24h'` in authController

**Issue**: Admin login fails with correct credentials
- **Cause**: Hashed password not matching (could be Unicode, whitespace issues)
- **Verify**: Check bcrypt comparison in `authController` login flow

### Build & Runtime Issues

**Backend**:

**Issue**: `npm run dev` fails - "nodemon: command not found"
- **Fix**: `npm install` (devDependencies not installed)

**Issue**: Build fails - `TypeScript error in dist/`
- **Fix**: `npm run build` should compile; if errors, check `tsconfig.json`

**Issue**: Server starts but routes 404
- **Cause**: Routes not mounted in `server.ts`
- **Fix**: Check `app.use('/api/products', productRoutes)` etc.

**Frontend**:

**Issue**: `npm run dev` slow or crashes
- **Cause**: `pnpm-lock.yaml` may be corrupted, or many dependencies
- **Fix**: Delete `node_modules`, `pnpm-lock.yaml`, then `pnpm install --force`

**Issue**: Build fails - "Module not found: next-intl"
- **Fix**: `npm install next-intl` (may not be installed if pnpm-lock out of sync)

**Issue**: Styles not applying (Tailwind)
- **Cause**: PostCSS config missing or `globals.css` not imported in root layout
- **Fix**: Check `postcss.config.mjs`, ensure `@tailwind` directives in `app/globals.css`

### Brand Name Case Sensitivity

**Issue**: "Novexpert" products don't show when querying "novexpert"
- **Cause**: MongoDB enum validation is exact case on insert - stored as "Novexpert"
- **Fix**: Queries use case-insensitive regex (`new RegExp('^Novexpert$', 'i')`), but ensure insert uses exact "Novexpert"
- **Alternatively**: Change schema to store lowercase, compare lowercase

### API Communication Issues

**Issue**: Frontend `fetch('/api/products')` hangs or returns empty
- **Cause**: Next.js route handler fails silently or doesn't forward to backend
- **Check**:
  1. Is backend running? (`npm run dev` in backend folder)
  2. Is route handler trying to read backend or local store? Check `app/api/products/route.ts`
  3. Check browser DevTools network tab for actual response

**Issue**: CORS error when calling backend directly (from browser console)
- **Context**: Should not happen if using Next.js routes as proxy
- **If calling backend directly**: Backend has `app.use(cors())`, should work
- **If not working**: Verify Express server is running, CORS middleware order

### Cart Persistence

**Issue**: Cart empties on page reload
- **Design**: Cart lives in CartContext (client-side state only)
- **Current Design**: No localStorage persistence implemented
- **Fix Needed** (if required):
  ```tsx
  // In cart-provider.tsx, add localStorage sync:
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])
  ```

### WhatsApp Integration

**Issue**: WhatsApp link not opening or message not encoding correctly
- **Cause**: Special characters in name/address not URL encoded
- **Current Implementation**: Uses `encodeURIComponent()` - should handle most cases
- **Test**: Manually try URL: `https://wa.me/+962780686156?text=Hello`

**Issue**: WhatsApp number hardcoded as +962780686156
- **Fix**: Make configurable via env var or database setting
- **Current**: Hardcoded in `product-card.tsx` onSubmit

### Internationalization Issues

**Issue**: Arabic text shows but RTL layout not applied
- **Cause**: `dir="rtl"` not set on container
- **Fix**: Check that component renders `dir={locale === 'ar' ? 'rtl' : 'ltr'}` on `<html>` or root element

**Issue**: Translations missing for a page
- **Status** (from INTERNATIONALIZATION_SETUP.md):
  - ✅ Done: Nav, Home, Footer translations
  - ❌ Not Done: SiteFooter, Cart, Checkout, Contact, About, Brand, Product pages
- **Fix**: Add `useTranslations('SectionName')` to component, create `SectionName` keys in `messages/ar.json` and `messages/en.json`

**Issue**: useTranslations() throws error
- **Cause**: Component not wrapped in layout with i18n context
- **Fix**: Ensure component is under `app/[locale]/` and layout imports i18n setup

---

## 7. i18n SETUP EXPLAINED

### Configuration Files

#### [src/i18n/routing.ts](skincare/src/i18n/routing.ts)
Defines locale system:
```typescript
export const routing = defineRouting({
  locales: ['ar', 'en'],        // Supported locales
  defaultLocale: 'ar',          // Arabic is default
})
```

#### [middleware.ts](skincare/middleware.ts)
Intercepts all requests to detect locale:
```typescript
import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']  // Match all routes except static
}
```
- Runs on every request
- Looks at URL path for `/ar/...` or `/en/...`
- If missing, uses default (`/ar/...`)

#### [app/layout.tsx](skincare/app/layout.tsx) - Root Layout
Sets up i18n provider (HTML dir, lang attribute):
```typescript
import { StrictMode } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  )
}
```

#### [app/[locale]/layout.tsx](skincare/app/[locale]/layout.tsx) - Locale Layout
Wraps locale-specific routes, enables i18n context:
```typescript
import { setRequestLocale } from 'next-intl/server'

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'en' }]
}

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  setRequestLocale(params.locale)  // Enable i18n for this route
  
  return (
    <html lang={params.locale} dir={params.locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        {children}
      </body>
    </html>
  )
}
```

### Translation File Structure

#### [messages/ar.json](skincare/messages/ar.json)
Complete Arabic translations organized by feature:
```json
{
  "Nav": { "home": "الرئيسية", "about": "من نحن", ... },
  "Home": { "specialOffer": "عرض خاص!", ... },
  "Checkout": { "total": "الإجمالي", ... },
  "Contact": { "title": "تواصل معنا", ... },
  ...
}
```

#### [messages/en.json](skincare/messages/en.json)
Complete English translations (same keys, different values):
```json
{
  "Nav": { "home": "Home", "about": "About", ... },
  "Home": { "specialOffer": "Special Offer!", ... },
  ...
}
```

### Usage in Components

#### Client Components (most common)
```typescript
'use client'
import { useTranslations, useLocale } from 'next-intl'

export function MyComponent() {
  const t = useTranslations('Nav')        // Access Nav.* keys
  const locale = useLocale()              // 'ar' or 'en'
  
  return (
    <nav dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <a href="/">{t('home')}</a>         // Looks up Nav.home in current locale's messages
    </nav>
  )
}
```

#### Locale-Aware Routing
```typescript
import { Link, useRouter } from '@/src/i18n/navigation'

// Link automatically preserves locale
<Link href="/about">About</Link>  // Routes to /ar/about or /en/about based on current

// Router same way
const router = useRouter()
router.push('/product/123')       // Preserves locale in URL
```

### Remaining Work

From [INTERNATIONALIZATION_SETUP.md](skincare/INTERNATIONALIZATION_SETUP.md):

**Completed** ✅:
- Core routing setup
- Translation files (ar.json, en.json complete)
- Layout structure with RTL/LTR
- SiteHeader component (header.tsx has translations)
- HomePage (page.tsx has all translations)

**TODO** ❌ (Priority order):
1. **SiteFooter** - Add `useTranslations('Footer')`, replace hardcoded strings
2. **Cart Page** - Add translations for "Shopping Cart", "Subtotal", etc.
3. **Checkout Page** - Translate form labels and buttons
4. **Contact Page** - Translate contact form fields
5. **About Page** - Translate about content
6. **Brand Pages** - Translate brand descriptions
7. **Product Pages** - Translate product details sections

**Pattern to apply** (example for SiteFooter):
```typescript
import { useTranslations } from 'next-intl'

export function SiteFooter() {
  const t = useTranslations('Footer')
  return (
    <footer>
      <p>{t('about')}</p>      {/* Replace hardcoded "About" */}
      <p>{t('contact')}</p>    {/* Replace hardcoded "Contact" */}
    </footer>
  )
}
```

---

## 8. QUICK REFERENCE: API ENDPOINTS

### Backend Express Routes (http://localhost:5000/api/*)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/login` | ❌ | Admin login, returns JWT |
| GET | `/products` | ❌ | List all products (query: brand, category) |
| GET | `/products/:id` | ❌ | Get single product |
| POST | `/products` | ✅ | Create product (needs JWT) |
| PUT | `/products/:id` | ✅ | Update product (needs JWT) |
| DELETE | `/products/:id` | ✅ | Delete product (needs JWT) |
| POST | `/orders` | ❌ | Create order (customer order) |
| GET | `/orders` | ✅ | List orders (admin only) |
| PUT | `/orders/:id/status` | ✅ | Update order status |
| POST | `/analytics/visit` | ❌ | Track page visit |
| GET | `/analytics` | ❌ | Get visit statistics |

### Frontend Next.js API Routes (http://localhost:3000/api/*)

| Endpoint | Behavior | Implementation |
|----------|----------|-----------------|
| `/api/products` | GET: Read from store.json, POST: Add to store.json | `app/api/products/route.ts` |
| `/api/products/[id]` | GET: Single product from store.json | `app/api/products/[id]/route.ts` |
| `/api/orders` | GET/POST orders to/from store.json | `app/api/orders/route.ts` |
| `/api/orders/[id]` | GET/PUT/DELETE single order | `app/api/orders/[id]/route.ts` |
| `/api/auth/*` | Proxy or local auth | `app/api/auth/route.ts` |
| `/api/analytics/*` | Visit tracking | `app/api/analytics/route.ts` |
| `/api/messages/*` | Contact form messages | `app/api/messages/route.ts` |
| `/api/upload/*` | Cloudinary image upload | `app/api/upload/route.ts` |

---

## 9. TECH STACK SUMMARY

| Layer | Technology | Purpose | Key Details |
|-------|-----------|---------|------------|
| **Frontend Framework** | Next.js 14+ | React server, API routes, SSR | App Router (`app/` directory) |
| **Frontend UI** | React 18 | Component library | TSX, client/server components |
| **Styling** | Tailwind CSS + PostCSS | Utility-first CSS | autoprefixer, tailwind plugins |
| **UI Components** | Radix UI + shadcn/ui | Accessible primitives | 60+ components (Dialog, Form, etc.) |
| **Backend Framework** | Express.js 5.2+ | HTTP server, routing | TypeScript, async/await |
| **Language** | TypeScript | Type safety | Compiled to JavaScript |
| **Runtime** | Node.js | Server execution | v17+ (check package.json engines) |
| **Database** | MongoDB | Document store | Atlas (cloud), Mongoose ORM |
| **ORM/Driver** | Mongoose 9.3+ | MongoDB abstraction | Schema validation, middleware |
| **Authentication** | JWT (jsonwebtoken) | Admin token auth | Bearer token, 1h expiry |
| **Password Hashing** | bcryptjs | Secure password storage | 10 salt rounds |
| **Validation** | Joi | Backend schema validation | On POST/PUT before save |
| **HTTP Client** | Fetch API | Browser/Node requests | Native, no axios needed |
| **Form Management** | React Hook Form | Form state, validation | useForm hook, watch fields |
| **Animation** | Framer Motion | UI transitions | motion.* components |
| **Internationalization** | next-intl | Multi-language support | routing, middleware, useTranslations |
| **File Upload** | Cloudinary | Image hosting, CDN | multer on backend, fetch on frontend |
| **Environment** | dotenv | .env file loading | Loaded on startup (backend) |
| **Development** | nodemon | Auto-reload server | Watch src/, compile on change |
| **Linting** | ESLint | Code quality | Config in project root |

---

## 10. DEPLOYMENT READINESS CHECKLIST

- [ ] All `.env` variables set (backend only needed)
- [ ] MongoDB Atlas cluster created and URI valid
- [ ] Admin account seeded (`npm run seed`)
- [ ] JWT_SECRET different from default
- [ ] Cloudinary account configured (if using image uploads)
- [ ] Frontend & backend built successfully (`npm run build`)
- [ ] All 404s and errors handled gracefully
- [ ] i18n routing tested (both `/ar/` and `/en/` paths work)
- [ ] Order submission and WhatsApp link working
- [ ] Analytics tracking functional
- [ ] Product CRUD working (with admin token)
- [ ] No hardcoded localhost URLs (use env var or config)
- [ ] CORS properly configured for production domain
- [ ] Secrets not committed to git (.env in .gitignore)
- [ ] Build process tested on clean checkout

---

## 11. NEXT STEPS FOR DEVELOPERS

### Onboarding Tasks
1. Clone repo, run `npm install` in both folders
2. Set up `.env` in backend with MongoDB URI
3. Run `npm run seed` in backend
4. Start both `npm run dev` processes in parallel terminals
5. Visit `http://localhost:3000` and test navigation

### Common Development Tasks

**Add a new page**:
1. Create `skincare/app/[locale]/my-page/page.tsx`
2. Use `useTranslations()` for text
3. Add new keys to `messages/ar.json` and `messages/en.json`

**Add a new API endpoint**:
1. Create `backend/src/routes/myroute.ts`
2. Create `backend/src/controllers/myController.ts`
3. Mount in `backend/src/server.ts`
4. Create `skincare/app/api/myroute/route.ts` if proxying

**Update product model**:
1. Modify `backend/src/models/Product.ts` schema
2. Update validation in `productController.ts`
3. Ensure bilingual fields remain for all user-facing text

**Test admin functionality**:
1. Get JWT: `curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"securepassword"}'`
2. Copy token from response
3. Use for protected routes: `curl -H "Authorization: Bearer <token>" http://localhost:5000/api/products`

---

**Document Last Updated**: April 2, 2026  
**Arch Overview Last Verified**: Project structure explored and documented  
**Status**: Production-ready with remaining i18n work
