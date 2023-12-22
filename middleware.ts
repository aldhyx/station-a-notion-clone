import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "./lib/supabase/middleware"

const protectedRoutes = ["/doc", "/reset-password", "/settings"]
const privateRoutes = ["/login", "/signup", "/forget-password"]

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const { data } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  if (!data.session && protectedRoutes.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL))
  }

  if (data.session && privateRoutes.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/doc", process.env.NEXT_PUBLIC_APP_URL))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
