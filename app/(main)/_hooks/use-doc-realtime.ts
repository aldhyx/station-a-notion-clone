import { client } from "@/lib/supabase/client"
import { Database } from "@/lib/supabase/database.types"
import { useDocStore } from "@/store/use-doc-store"
import { useSidebarStore } from "@/store/use-sidebar-store"
import { useEffect } from "react"

type Page = Database["public"]["Tables"]["pages"]["Row"]

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
          const doc = payload.new as Page

          if (doc) {
            docRealtimeHandler({ eventType, doc, old: payload.old })
            sidebarTreeRealtimeHandler({
              eventType,
              doc: {
                uuid: doc.uuid,
                title: doc.title,
                emoji: doc.emoji,
                parent_uuid: doc.parent_uuid,
                is_deleted: doc.is_deleted,
                created_at: doc.created_at,
                updated_at: doc.updated_at,
                is_locked: doc.is_locked,
              },
            })
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
