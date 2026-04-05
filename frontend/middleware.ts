import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if it's an admin route but NOT the login page
  const isAdminSubRoute = /\/admin\/(dashboard|coupons|products|orders|messages)/.test(pathname)

  if (isAdminSubRoute) {
    const token = request.cookies.get('adminToken')?.value
    if (!token) {
      // Extract locale from path (e.g. /en/admin/dashboard → en)
      const locale = pathname.split('/')[1] || 'en'
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url))
    }
  }

  // Run intl middleware for everything else
  return intlMiddleware(request)
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};