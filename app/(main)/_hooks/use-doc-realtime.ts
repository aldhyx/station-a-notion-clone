import { client } from "@/lib/supabase/client"
import { Database } from "@/lib/supabase/database.types"
import { useDocStore } from "@/store/use-doc-store"
import { useSidebarStore } from "@/store/use-sidebar-store"
import { useEffect } from "react"

type Page = Pick<
  Database["public"]["Tables"]["pages"]["Row"],
  "uuid" | "title" | "emoji" | "parent_uuid" | "created_at" | "is_deleted"
>

// only mounting once
export default function useDocRealtime() {
  const { sidebarTreeRealtimeHandler } = useSidebarStore()
  const { docRealtimeHandler } = useDocStore()

  useEffect(() => {
    const subscribe = client
      .channel("sidebar_menu_room")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pages" },
        payload => {
          const { eventType } = payload
          const doc = payload.new as Page | null

          if (doc) {
            // todo: handler type conflig
            docRealtimeHandler({ eventType, doc })
            sidebarTreeRealtimeHandler({ eventType, doc })
          }
        },
      )
      .subscribe()
    return () => {
      client.removeChannel(subscribe)
    }
  }, [])

  return null
}
