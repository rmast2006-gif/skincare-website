# Topicrem & Novexpert — Skincare Website

A Next.js e-commerce website for Topicrem and Novexpert skincare brands with bilingual support (English & Arabic), admin dashboard, and WhatsApp ordering.

---

## Requirements

Before running the project, make sure you have the following installed:

- **Node.js** v18 or higher → https://nodejs.org
- **npm** v9 or higher (comes with Node.js)

To verify, run in terminal:
```bash
node -v
npm -v
```

---

## Setup Instructions

### 1. Extract the ZIP

Extract the project ZIP file to any folder on your computer, for example:
C:\Projects\skincare-frontend\

### 2. Open Terminal in Project Folder

- Open the extracted folder in **VS Code**
- Open the terminal: **Terminal → New Terminal**

Or open **PowerShell** / **Command Prompt** and navigate to the folder:
```bash
cd C:\Projects\skincare-frontend
```

### 3. Install Dependencies
```bash
npm install
```

This will install all required packages. It may take 1–2 minutes.

### 4. Set Up Environment Variables

Create a file named `.env.local` in the root of the project and add the following:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here
CLOUDINARY_CLOUD_NAME=dc55ymrbx
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
GOOGLE_TRANSLATE_API_KEY=your-google-translate-api-key
```

> **Note:** Replace the placeholder values with your actual API keys. You can use any string for `JWT_SECRET`, for example: `mysecretkey123`

### 5. Run the Development Server
```bash
npm run dev
```

The site will be available at:
http://localhost:3000

---

## Accessing the Website

| Page | URL |
|------|-----|
| Home (English) | http://localhost:3000/en |
| Home (Arabic) | http://localhost:3000/ar |
| Topicrem Brand | http://localhost:3000/en/brand/topicrem |
| Novexpert Brand | http://localhost:3000/en/brand/novexpert |
| Admin Dashboard | http://localhost:3000/en/admin/dashboard |

---

## Admin Dashboard

To log in to the admin dashboard:

1. Go to http://localhost:3000/en/admin
2. Use the default admin credentials:
   - **Username:** admin
   - **Password:** admin123

From the dashboard you can:
- Add, edit, and delete products
- View and manage orders
- Upload product images (automatically stored in Cloudinary for new products)
- Products added will auto-translate to Arabic using Google Translate

---

## Features

### ✅ Bilingual Support
- Full English and Arabic translations
- RTL (Right-to-Left) layout for Arabic
- Auto-translation for new products

### ✅ Product Management
- 61 pre-loaded skincare products
- Categories: Cleansers, Moisturizers, Serums, Treatments
- Image management (local + Cloudinary)
- Product search and filtering

### ✅ Order Management
- WhatsApp ordering integration
- Order tracking and management
- Customer information storage

### ✅ Image Handling
- Existing products: Local images (fast loading)
- New products: Cloudinary cloud storage (scalable)
- Automatic image optimization

---

## Product Data

All product data is stored in:
data/store.json

This file contains all products, orders, and admin users. **Do not delete this file.**

The project includes:
- **61 skincare products** from Topicrem and Novexpert
- **English and Arabic** product descriptions
- **Product categories** and pricing
- **Admin user accounts**

---

## Build for Production

To create an optimized production build:
```bash
npm run build
npm start
```

---

## Deployment

### For VPS/Server Deployment:

1. Upload the project to your server
2. Install dependencies:
```bash
   npm install --production
```
3. Build the project:
```bash
   npm run build
```
4. Start the production server:
```bash
   npm start
```

### Environment Variables for Production:

Update `.env.local` with your production URLs:
```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
JWT_SECRET=your-secure-secret-key
CLOUDINARY_CLOUD_NAME=dc55ymrbx
CLOUDINARY_API_KEY=your-production-api-key
CLOUDINARY_API_SECRET=your-production-api-secret
GOOGLE_TRANSLATE_API_KEY=your-production-translate-key
```

---

## Project Structure
├── app/                  # Next.js app router pages & API routes
│   ├── [locale]/         # English & Arabic pages
│   │   ├── admin/        # Admin dashboard
│   │   ├── brand/        # Brand pages (Topicrem/Novexpert)
│   │   └── page.tsx      # Home page
│   └── api/              # Backend API routes
│       ├── products/     # Product CRUD operations
│       ├── orders/       # Order management
│       └── upload/       # Image upload (Cloudinary)
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components
│   └── layout/          # Layout components
├── data/
│   └── store.json        # All product & order data
├── lib/                  # Utility functions & config
│   ├── categories.ts     # Product categories
│   └── products.ts       # Brand information
├── public/               # Static assets (images, logos)
│   ├── topicrem/        # Topicrem product images
│   └── novexpert/       # Novexpert product images
├── scripts/              # Utility scripts
│   └── translate.mjs     # Translation automation
└── .env.local            # Environment variables (create manually)

---

## API Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/products` | GET | Get all products |
| `/api/products` | POST | Create new product |
| `/api/products` | PUT | Update product |
| `/api/products` | DELETE | Delete product |
| `/api/orders` | GET | Get all orders |
| `/api/orders` | POST | Create new order |
| `/api/upload/upload` | POST | Upload image to Cloudinary |

---

## Troubleshooting

**Port already in use?**
```bash
npm run dev -- -p 3001
```
Then open http://localhost:3001

**`npm install` fails?**
Make sure Node.js v18+ is installed and try:
```bash
npm install --legacy-peer-deps
```

**Products not showing?**
Make sure `data/store.json` exists and is not empty.

**Admin login not working?**
Check that `JWT_SECRET` is set in `.env.local`.

**Images not uploading?**
Verify Cloudinary credentials in `.env.local`.

**Translation not working?**
Check Google Translate API key in `.env.local`.

**Arabic text not displaying correctly?**
Ensure your browser supports Arabic fonts and RTL layout.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Internationalization:** next-intl (English & Arabic)
- **Data Storage:** JSON file (`data/store.json`)
- **Image Storage:** Local files + Cloudinary
- **Translation:** Google Translate API
- **Ordering:** WhatsApp integration

---

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

---

## License

This project is proprietary software. All rights reserved.

---

## Support

For questions, issues, or feature requests:
- **Email:** [your-email@domain.com]
- **GitHub:** https://github.com/rmast2006-gif/skincare-website

---

## Changelog

### v1.0.0 (Latest)
- ✅ Initial release with 61 products
- ✅ Bilingual support (English/Arabic)
- ✅ Admin dashboard with CRUD operations
- ✅ Cloudinary integration for new uploads
- ✅ Google Translate API integration
- ✅ WhatsApp ordering system
- ✅ Bug fixes and optimizations

---

**Made with ❤️ for skincare enthusiasts**