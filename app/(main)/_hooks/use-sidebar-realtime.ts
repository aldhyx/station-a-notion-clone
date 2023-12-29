import { client } from "@/lib/supabase/client"
import { Database } from "@/lib/supabase/database.types"
import { useSidebarStore } from "@/store/use-sidebar-store"
import { useEffect } from "react"

type Page = Pick<
  Database["public"]["Tables"]["pages"]["Row"],
  "uuid" | "title" | "emoji" | "parent_uuid" | "created_at" | "is_deleted"
>

export default function useSidebarRealtime() {
  const { sidebarTreeRealtimeHandler } = useSidebarStore()

  useEffect(() => {
    const subscribe = client
      .channel("sidebar_menu_room")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pages" },
        payload => {
          const { eventType } = payload
          const doc = payload.new as Page | null

          const newDoc: Page | null = doc
            ? {
                uuid: doc.uuid,
                title: doc.title,
                emoji: doc.emoji,
                parent_uuid: doc.parent_uuid,
                is_deleted: doc.is_deleted,
                created_at: doc.created_at,
              }
            : null

          sidebarTreeRealtimeHandler({ eventType, doc: newDoc })
          // console.log("Change received!", payload)
        },
      )
      .subscribe()
    return () => {
      client.removeChannel(subscribe)
    }
  }, [])

  return {}
}
