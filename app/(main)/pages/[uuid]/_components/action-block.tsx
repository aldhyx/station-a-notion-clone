import CoverDialog from "@/components/dialogs/cover/dialog"
import EmojiPickerPopover, { type Emoji } from "@/components/popover/emoji-picker-popover"
import { Button } from "@/components/ui/button"
import { usePageStore } from "@/hooks/page-store/use-page-store"
import { cn } from "@/lib/utils"
import { ImageMinusIcon, ImagePlusIcon, SmileIcon, SmilePlusIcon } from "lucide-react"

export default function ActionBlock() {
  const { loadingPage, page, removeCover, updateEmoji } = usePageStore()
  const loading = loadingPage || !page

  if (loading) return null

  const emoji = page.emoji as Emoji | null

  return (
    <div
      className={cn(
        "mx-auto mb-5 flex w-full max-w-3xl gap-x-2 px-4 md:px-0",
        emoji?.native ? "pt-10" : "pt-3",
        (emoji?.native || page.image_url) &&
          "md:opacity-0 md:hover:opacity-100 md:peer-hover/cover:opacity-100",
      )}
    >
      {!emoji?.native ? (
        <EmojiPickerPopover onEmojiSelect={(emoji, event) => updateEmoji({ emoji })}>
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
          onClick={() => updateEmoji()}
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
            page.image_url && "hidden",
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
          page.image_url && "flex",
        )}
        onClick={() => removeCover()}
      >
        <ImageMinusIcon className="mr-2 h-4 w-4" />
        Remove cover
      </Button>
    </div>
  )
}
