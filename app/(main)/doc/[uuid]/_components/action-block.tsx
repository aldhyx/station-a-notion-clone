import EmojiPickerPopover, { type Emoji } from "@/components/popover/emoji-picker-popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDocStore } from "@/store/use-doc-store"
import { ImageMinusIcon, ImagePlusIcon, SmileIcon, SmilePlusIcon } from "lucide-react"
import { useParams } from "next/navigation"
import CoverDialog from "./cover-dialog/dialog"

export default function ActionBlock() {
  const params = useParams()
  const uuid = params.uuid as string
  const { loadingDoc, doc, updateDocAsync, signedUrl } = useDocStore()

  const loading = loadingDoc || !doc
  if (loading) return null

  const emoji = doc?.emoji ? (doc.emoji as Emoji) : null

  return (
    <div
      className={cn(
        "mx-auto mb-5 flex w-full max-w-3xl gap-x-2 px-4 md:px-0",
        emoji?.native ? "pt-10" : "pt-3",
        (emoji?.native || signedUrl) &&
          "md:opacity-0 md:hover:opacity-100 md:peer-hover/cover:opacity-100",
      )}
    >
      {!emoji?.native ? (
        <EmojiPickerPopover onEmojiSelect={emoji => updateDocAsync(uuid, { emoji })}>
          <Button
            variant="secondary"
            size="sm"
            className="h-auto p-[6px] text-xs font-normal text-zinc-500"
          >
            <SmilePlusIcon className="mr-2 h-4 w-4" />
            Add icon
          </Button>
        </EmojiPickerPopover>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          className="h-auto p-[6px] text-xs font-normal text-zinc-500"
          onClick={() => updateDocAsync(uuid, { emoji: null })}
        >
          <SmileIcon className="mr-2 h-4 w-4" />
          Remove icon
        </Button>
      )}

      <CoverDialog>
        <Button
          variant="secondary"
          size="sm"
          className={cn(
            "h-auto p-[6px] text-xs font-normal text-zinc-500",
            signedUrl && "hidden",
          )}
        >
          <ImagePlusIcon className="mr-2 h-4 w-4" />
          Add cover
        </Button>
      </CoverDialog>

      <Button
        variant="secondary"
        size="sm"
        className={cn(
          "hidden h-auto p-[6px] text-xs font-normal text-zinc-500",
          signedUrl && "flex",
        )}
        onClick={() => updateDocAsync(uuid, { image_url: null })}
      >
        <ImageMinusIcon className="mr-2 h-4 w-4" />
        Remove cover
      </Button>
    </div>
  )
}
