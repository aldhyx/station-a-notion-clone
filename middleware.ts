import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "./lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const { data, error } = await supabase.auth.getSession()

  if (
    !data.session &&
    (request.nextUrl.pathname.startsWith("/page") ||
      request.nextUrl.pathname.startsWith("/pages") ||
      request.nextUrl.pathname.startsWith("/reset-password") ||
      request.nextUrl.pathname.startsWith("/setting"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (
    data.session &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup") ||
      request.nextUrl.pathname.startsWith("/forgot-password"))
  ) {
    return NextResponse.redirect(new URL("/page", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/page",
    "/pages/:path*",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/settings/:path*",
  ],
}
