import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "./lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const { data, error } = await supabase.auth.getSession()

  if (!data.session && request.nextUrl.pathname.startsWith("/docs")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (
    data.session &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup"))
  ) {
    return NextResponse.redirect(new URL("/docs", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/docs/:path*",
    "/login/:path*",
    "/signup/:path*",
    "/signup-verification/:path*",
  ],
}
