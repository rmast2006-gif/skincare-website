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
```
C:\Projects\skincare-frontend\
```

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
```

> You can use any string for `JWT_SECRET`, for example: `mysecretkey123`

### 5. Run the Development Server

```bash
npm run dev
```

The site will be available at:
```
http://localhost:3000
```

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
2. Use the admin credentials set up during development

From the dashboard you can:
- Add, edit, and delete products
- View and manage orders
- Products added will auto-translate to Arabic

---

## Product Data

All product data is stored in:
```
data/store.json
```

This file contains all products, orders, and admin users. **Do not delete this file.**

---

## Build for Production

To create an optimized production build:

```bash
npm run build
npm start
```

---

## Project Structure

```
├── app/                  # Next.js app router pages & API routes
│   ├── [locale]/         # English & Arabic pages
│   └── api/              # Backend API routes
├── components/           # Reusable UI components
├── data/
│   └── store.json        # All product & order data
├── lib/                  # Utility functions & config
├── public/               # Static assets (images, logos)
├── scripts/              # Utility scripts (e.g. translation)
└── .env.local            # Environment variables (create this manually)
```

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

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Internationalization:** next-intl (English & Arabic)
- **Data Storage:** JSON file (`data/store.json`)
- **Ordering:** WhatsApp integration