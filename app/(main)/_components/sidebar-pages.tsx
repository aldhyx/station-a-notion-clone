"use client"

import { Emoji } from "@/components/popover/emoji-picker-popover"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FileIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react"
import { useParams } from "next/navigation"
import { useEffectOnce } from "usehooks-ts"
import { useSidebarStore } from "../../../store/use-sidebar-store"
import { useSidebar } from "../_hooks/use-sidebar"

type Props = {
  uuid?: string
  level?: number
}

export default function SidebarPages({ uuid, level = 0 }: Props) {
  const params = useParams()
  const {
    navigateDocHandler,
    createNewDocHandler,
    deleteDocHandler,
    docCollapseHandler,
    collapsedMap,
  } = useSidebar()

  const { docList, getDocListsAsync } = useSidebarStore()

  useEffectOnce(() => {
    getDocListsAsync(uuid)
  })

  const items = docList?.[uuid ?? "root"]
  if (!items) return <SidebarPages.Skeleton level={level} />
  if (!items.length) return <SidebarPages.Empty level={level} />

  return (
    <>
      <SidebarPages.Title level={level} />

      {items.map(item => {
        const emoji = item?.emoji as Emoji | null

        return (
          <section key={item.uuid}>
            <div
              role="button"
              onClick={() => navigateDocHandler(item.uuid)}
              className={
                "group flex w-full cursor-pointer items-center justify-between rounded-sm py-1 pr-1 text-zinc-600 transition hover:bg-zinc-200"
              }
              style={{
                paddingLeft:
                  level === 0
                    ? "4px"
                    : level === 1
                    ? `${level * 20}px`
                    : `${level * 18}px`,
              }}
            >
              <div className="flex items-center justify-start truncate">
                <span
                  role="button"
                  className="grid h-5 w-5 shrink-0  place-content-center rounded-sm hover:bg-zinc-400/30"
                  onClick={e => docCollapseHandler(e, item.uuid)}
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
                  <FileIcon className="mr-2 h-4 w-4 shrink-0" />
                )}

                <span
                  className={cn(
                    "truncate text-sm antialiased",
                    params?.uuid === item.uuid && "font-semibold text-zinc-800",
                  )}
                >
                  {item.title}
                </span>
              </div>

              <div className="flex items-center pl-2 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5 text-zinc-600 hover:bg-zinc-400/30"
                  onClick={() => deleteDocHandler(item.uuid)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5 text-zinc-600 hover:bg-zinc-400/30"
                  onClick={() => createNewDocHandler(item.uuid)}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
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
  return <h2 className="mb-1 px-3 pt-3 text-xs text-zinc-500">Private</h2>
}

SidebarPages.Skeleton = function Loading({ level }: LevelProps) {
  return (
    <div className={cn(level === 0 ? "pt-3" : "pt-1")}>
      {level === 0 && <h2 className="mb-1 px-3 text-xs text-zinc-500">Private</h2>}
      {Array(level === 0 ? 4 : 1)
        .fill(null)
        .map((_, i) => (
          <Skeleton key={i + 1} className="mb-1 h-6 w-full bg-zinc-200" />
        ))}
    </div>
  )
}

SidebarPages.Empty = function Empty({ level }: LevelProps) {
  const paddingLeft =
    level === 0 ? "13px" : level === 1 ? `${level * 26}px` : `${level * 19}px`

  return (
    <div className={"py-1 pr-3 text-xs text-zinc-500"} style={{ paddingLeft }}>
      No page inside
    </div>
  )
}