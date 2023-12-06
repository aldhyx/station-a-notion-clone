import { createBrowserClient } from "@supabase/ssr"
import { type Database } from "@/lib/supabase/database.types"

const client = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export { client }
