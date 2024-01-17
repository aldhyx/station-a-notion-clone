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
import SidebarMoreMenuPopover from "./popover/sidebar-more-menu-popover"
import { useLayoutStore } from "@/store/use-layout-store"
import { getSidebarTreeData } from "@/helper/data.helper"

type Props = {
  uuid?: string
  level?: number
}

export default function SidebarTree({ uuid, level = 0 }: Props) {
  const params = useParams()
  const router = useRouter()
  const { triggerMinimize } = useLayoutStore()
  const {
    loading,
    sidebarTree,
    getSidebarTreeAsync,
    sidebarTreeCollapsed: collapsedMap,
    sidebarTreeCollapseHandler,
  } = useSidebarStore()

  useEffectOnce(() => {
    getSidebarTreeAsync(uuid)
  })

  // first loading at root level
  if (loading["root"] && !sidebarTree && !uuid) {
    return <SidebarTree.Skeleton level={level} />
  }

  const navigateDocHandler = (uuid: string) => {
    triggerMinimize("doc")
    if (params.uuid && params.uuid === uuid) return
    router.push(`/doc/${uuid}`)
  }

  const items = getSidebarTreeData(sidebarTree, uuid)

  if (loading[uuid!] && !items.length) return <SidebarTree.Skeleton level={level} />
  if (!items.length) return <SidebarTree.Empty level={level} />

  return (
    <>
      <SidebarTree.Title level={level} />

      {items.map(([key, item]) => {
        const emoji = item?.emoji as Emoji | null

        return (
          <section
            key={key}
            onClick={e => {
              e.stopPropagation()
              return
            }}
          >
            <div
              role="button"
              onClick={e => {
                e.stopPropagation()
                navigateDocHandler(item.uuid)
              }}
              className="group flex h-8 w-full cursor-pointer items-center justify-between rounded-md pr-1 transition hover:bg-primary/5"
              style={{
                paddingLeft: level === 0 ? "4px" : `${level * 20}px`,
              }}
            >
              <div className="flex items-center justify-start truncate">
                <span
                  role="button"
                  className="grid h-6 w-6 shrink-0 place-content-center rounded-md text-muted-foreground hover:bg-primary/10"
                  onClick={e => {
                    e.stopPropagation()
                    sidebarTreeCollapseHandler({
                      uuid: item.uuid,
                      parent_uuid: item.parent_uuid,
                    })
                  }}
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
                  <FileIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                )}

                <span
                  className={cn(
                    "truncate text-sm text-primary/70 antialiased",
                    params?.uuid === item.uuid && "font-semibold text-primary",
                  )}
                >
                  {item.title}
                </span>
              </div>

              <SidebarMoreMenuPopover
                uuid={item.uuid}
                created_at={item.created_at}
                updated_at={item.updated_at}
                is_locked={item.is_locked}
              >
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="ml-3 h-6 w-6 shrink-0 text-muted-foreground opacity-100 hover:bg-primary/10 md:opacity-0 md:group-hover:opacity-100 md:[&[data-state=open]]:opacity-100"
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
              <SidebarTree uuid={item.uuid} level={level + 1} />
            )}
          </section>
        )
      })}
    </>
  )
}

type LevelProps = { level: number }

SidebarTree.Title = function Title({ level }: LevelProps) {
  if (level > 0) return null
  return <h2 className="mb-1 px-3 pt-3 text-xs text-muted-foreground">Personal</h2>
}

SidebarTree.Skeleton = function Loading({ level }: LevelProps) {
  return (
    <div className={cn(level === 0 ? "pt-3" : "pt-1")}>
      {level === 0 && (
        <h2 className="mb-2 px-3 text-xs text-muted-foreground">Personal</h2>
      )}

      {Array(level === 0 ? 4 : 1)
        .fill(null)
        .map((_, i) => (
          <Skeleton key={i + 1} className="mb-1 h-7 w-full bg-primary/5" />
        ))}
    </div>
  )
}

SidebarTree.Empty = function Empty({ level }: LevelProps) {
  if (level === 0) return null

  const paddingLeft =
    level === 0 ? "13px" : level === 1 ? `${level * 30}px` : `${level * 22}px`

  return (
    <div className={"py-1 text-xs text-muted-foreground"} style={{ paddingLeft }}>
      No page inside
    </div>
  )
}
