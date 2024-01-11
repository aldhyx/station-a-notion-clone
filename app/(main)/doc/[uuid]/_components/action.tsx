import EmojiPickerPopover from "@/components/popover/emoji-picker-popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ImagePlusIcon, SmilePlusIcon } from "lucide-react"
import React from "react"
import ColorGradientDialog from "./dialog/color-gradient-dialog"
import { useDocStore } from "@/store/use-doc-store"
import { useParams } from "next/navigation"
import { COLOR_AND_GRADIENT } from "@/constants/color-gradient"

export default function Action() {
  const params = useParams()
  const uuid = params.uuid as string
  const { loadingDoc, doc, updateDocAsync, isLocked } = useDocStore()
  if (loadingDoc || (doc?.emoji && doc.image_url)) return null

  const bgColor = doc?.image_url
    ? COLOR_AND_GRADIENT.find(v => v.name === doc.image_url)
    : null

  return (
    <div className="mx-auto mb-6 flex w-full max-w-3xl gap-x-2 px-4 md:px-0">
      {!doc?.emoji && (
        <EmojiPickerPopover onEmojiSelect={emoji => updateDocAsync(uuid, { emoji })}>
          <Button
            variant="secondary"
            size="sm"
            className="h-auto p-[6px] text-xs font-normal"
            disabled={isLocked}
          >
            <SmilePlusIcon className="mr-2 h-4 w-4" />
            Add icon
          </Button>
        </EmojiPickerPopover>
      )}

      {!bgColor && (
        <ColorGradientDialog>
          <Button
            variant="secondary"
            size="sm"
            className={cn("h-auto p-[6px] text-xs font-normal")}
            onClick={() => {
              const random = Math.floor(Math.random() * COLOR_AND_GRADIENT.length)
              updateDocAsync(uuid, { image_url: COLOR_AND_GRADIENT[random].name })
            }}
            disabled={isLocked}
          >
            <ImagePlusIcon className="mr-2 h-4 w-4" />
            Add cover
          </Button>
        </ColorGradientDialog>
      )}
    </div>
  )
}
