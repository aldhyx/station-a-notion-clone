import React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { COLOR_AND_GRADIENT } from "@/constants/color-gradient"
import ColorGradientDialog from "./dialog/color-gradient-dialog"
import { Button } from "@/components/ui/button"
import { ImagePlusIcon, Trash2Icon } from "lucide-react"
import EmojiPickerPopover, { type Emoji } from "@/components/popover/emoji-picker-popover"
import { useDocStore } from "@/store/use-doc-store"
import { useParams } from "next/navigation"

export default function Cover() {
  const params = useParams()
  const uuid = params.uuid as string
  const { loadingDoc, doc, updateDocAsync, isLocked } = useDocStore()
  const emoji = doc?.emoji ? (doc.emoji as Emoji) : null

  const bgColor = doc?.image_url
    ? COLOR_AND_GRADIENT.find(v => v.name === doc.image_url)
    : null

  return (
    <div
      className={cn(
        "group/cover peer/cover relative mx-auto mb-4",
        emoji && !bgColor && "mb-32 mt-20",
        emoji && bgColor && "mb-12",
      )}
    >
      {/* if loading */}
      {loadingDoc && <Skeleton className="h-40 w-full rounded-none bg-primary/5" />}

      {!loadingDoc && (
        <>
          {bgColor && (
            <div
              className="h-40 w-full dark:brightness-90"
              style={{ background: bgColor.background }}
            />
          )}

          <div
            className={cn(
              "relative mx-auto h-auto w-auto max-w-3xl",
              !bgColor && !emoji && "hidden",
            )}
          >
            {emoji && (
              <div className="absolute bottom-[-24px] left-5 rounded-full md:bottom-[-30px] md:left-0">
                <EmojiPickerPopover
                  onEmojiSelect={(emoji, event) => updateDocAsync(uuid, { emoji })}
                  onClickRemove={() => updateDocAsync(uuid, { emoji: null })}
                >
                  <button
                    role="button"
                    className="block rounded-md py-2 text-5xl hover:bg-primary/10 md:text-6xl"
                    disabled={isLocked}
                  >
                    {emoji.native}
                  </button>
                </EmojiPickerPopover>
              </div>
            )}

            {bgColor && !isLocked && (
              <div className="absolute bottom-4 right-4 flex gap-x-2">
                <ColorGradientDialog>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-auto p-[6px] text-xs font-normal transition md:opacity-0 md:group-hover/cover:opacity-100"
                    disabled={isLocked}
                  >
                    <ImagePlusIcon className="mr-2 h-4 w-4" />
                    Change cover
                  </Button>
                </ColorGradientDialog>

                <Button
                  variant="secondary"
                  size="sm"
                  className="h-auto p-[6px] text-xs font-normal transition md:opacity-0 md:group-hover/cover:opacity-100"
                  onClick={() => updateDocAsync(uuid, { image_url: null })}
                  disabled={isLocked}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
