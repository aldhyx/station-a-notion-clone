import { Database } from "@/lib/supabase/database.types"

type Page = Pick<
  Database["public"]["Tables"]["pages"]["Row"],
  "uuid" | "title" | "emoji" | "parent_uuid" | "created_at" | "updated_at" | "is_locked"
>

export const getSidebarTreeData = (
  list: Map<string, Page> | null,
  uuid: string | undefined,
) => {
  return list
    ? Array.from(list ?? [])
        .filter(([, item]) => (uuid ? item.parent_uuid === uuid : !item.parent_uuid))
        .sort(([, a], [, b]) => {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateA - dateB
        })
    : []
}
