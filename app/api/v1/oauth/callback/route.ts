import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"
export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const code = searchParams.get("code") as string

  const cookiesStore = cookies()
  const server = createClient(cookiesStore)

  try {
    const { data, error } = await server.auth.exchangeCodeForSession(code)

    if (data) return Response.redirect(`${req.nextUrl.origin}/doc`)

    throw new Error(error?.message)
  } catch (error) {
    return Response.redirect(`${req.nextUrl.origin}/login`)
  }
}
