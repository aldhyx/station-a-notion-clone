"use client"

import { Emoji } from "@/components/popover/emoji-picker-popover"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffectOnce } from "usehooks-ts"
import { useSidebarStore } from "../../../store/use-sidebar-store"
import SidebarMoreMenuPopover from "./popovers/sidebar-more-menu-popover"
import { useLayoutStore } from "@/store/use-layout-store"

type Props = {
  uuid?: string
  level?: number
}

export default function SidebarPages({ uuid, level = 0 }: Props) {
  const params = useParams()
  const router = useRouter()
  const { triggerMinimize } = useLayoutStore()
  const {
    loading,
    sidebarList,
    getSidebarListAsync,
    sidebarCollapsedList: collapsedMap,
    setSidebarCollapsedList,
  } = useSidebarStore()

  useEffectOnce(() => {
    getSidebarListAsync(uuid)
  })

  // first loading at root level
  if (loading["root"] && !sidebarList && !uuid) {
    return <SidebarPages.Skeleton level={level} />
  }

  const navigateDocHandler = (uuid: string) => {
    triggerMinimize("doc")
    if (params.uuid && params.uuid === uuid) return
    router.push(`/doc/${uuid}`)
  }

  const toggleCollapseHandler = (
    e: React.MouseEvent<HTMLSpanElement>,
    v: { uuid: string; parent_uuid: string | null },
  ) => {
    e.stopPropagation()
    setSidebarCollapsedList({ ...v })
  }

  const items = sidebarList
    ? Array.from(sidebarList ?? [])
        .filter(([, item]) => (uuid ? item.parent_uuid === uuid : !item.parent_uuid))
        .sort(([, a], [, b]) => {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateA - dateB
        })
    : []

  if (loading[uuid!] && !items.length) return <SidebarPages.Skeleton level={level} />
  if (!items.length) return <SidebarPages.Empty level={level} />

  return (
    <>
      <SidebarPages.Title level={level} />

      {items.map(([key, item]) => {
        const emoji = item?.emoji as Emoji | null

        return (
          <section key={key}>
            <div
              role="button"
              onClick={e => {
                e.stopPropagation()
                navigateDocHandler(item.uuid)
              }}
              className="group flex h-8 w-full cursor-pointer items-center justify-between rounded-sm pr-1 transition hover:bg-zinc-200 dark:hover:bg-zinc-700"
              style={{
                paddingLeft:
                  level === 0
                    ? "4px"
                    : level === 1
                    ? `${level * 20}px`
                    : `${level * 20}px`,
              }}
            >
              <div className="flex items-center justify-start truncate">
                <span
                  role="button"
                  className="grid h-6 w-6 shrink-0 place-content-center rounded-sm text-zinc-500 hover:bg-zinc-400/30 dark:text-zinc-400"
                  onClick={e =>
                    toggleCollapseHandler(e, {
                      uuid: item.uuid,
                      parent_uuid: item.parent_uuid,
                    })
                  }
                >
                  {collapsedMap.has(item.uuid) ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )}
                </span>

                {emoji?.native ? (
                  <span
                    role="img"
                    aria-label={emoji?.name}
                    className="mr-2 block w-4 text-sm antialiased"
                  >
                    {emoji.native}
                  </span>
                ) : (
                  <FileIcon className="mr-2 h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                )}

                <span
                  className={cn(
                    "truncate text-sm text-zinc-700 antialiased dark:text-zinc-200",
                    params?.uuid === item.uuid &&
                      "font-semibold text-zinc-800 dark:text-zinc-100",
                  )}
                >
                  {item.title}
                </span>
              </div>

              <SidebarMoreMenuPopover uuid={item.uuid}>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="ml-3 h-6 w-6 shrink-0 text-zinc-500 opacity-100 hover:bg-zinc-400/30 dark:text-zinc-400 dark:hover:bg-zinc-400/30 md:opacity-0 md:group-hover:opacity-100 md:[&[data-state=open]]:opacity-100"
                  onClick={e => {
                    e.stopPropagation()
                    return
                  }}
                >
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </SidebarMoreMenuPopover>
            </div>

            {collapsedMap.has(item.uuid) && (
              <SidebarPages uuid={item.uuid} level={level + 1} />
            )}
          </section>
        )
      })}
    </>
  )
}

type LevelProps = { level: number }

SidebarPages.Title = function Title({ level }: LevelProps) {
  if (level > 0) return null
  return (
    <h2 className="mb-1 px-3 pt-3 text-xs text-zinc-600 dark:text-zinc-400">Personal</h2>
  )
}

SidebarPages.Skeleton = function Loading({ level }: LevelProps) {
  return (
    <div className={cn(level === 0 ? "pt-3" : "pt-1")}>
      {level === 0 && <h2 className="mb-2 px-3 text-xs text-zinc-500">Personal</h2>}
      {Array(level === 0 ? 4 : 1)
        .fill(null)
        .map((_, i) => (
          <Skeleton
            key={i + 1}
            className="mb-1 h-7 w-full bg-zinc-200 dark:bg-zinc-600"
          />
        ))}
    </div>
  )
}

SidebarPages.Empty = function Empty({ level }: LevelProps) {
  const paddingLeft =
    level === 0 ? "13px" : level === 1 ? `${level * 30}px` : `${level * 22}px`

  return (
    <div
      className={"py-1 text-xs text-zinc-500 dark:text-zinc-400"}
      style={{ paddingLeft }}
    >
      No page inside
    </div>
  )
}
