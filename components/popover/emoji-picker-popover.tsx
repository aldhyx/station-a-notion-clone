import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { useTheme } from "next-themes"
import { PropsWithChildren } from "react"
import { Button } from "../ui/button"
import { Trash2Icon } from "lucide-react"

enum SKIN_TYPES {
  DEFAULT = 1,
  LIGHT = 2,
  MEDIUM_LIGHT = 3,
  MEDIUM = 4,
  MEDIUM_DARK = 5,
  DARK = 5,
}

export type Emoji = {
  id: string
  keywords: string[]
  name: string
  native: string
  shortcodes: string
  unified: string
  skin?: SKIN_TYPES
  aliases?: string[]
}

type Props = PropsWithChildren & {
  onEmojiSelect: (emoji: Emoji, event: PointerEvent) => void
  onClickRemove?: () => void
}

export default function EmojiPickerPopover({
  children,
  onEmojiSelect,
  onClickRemove,
}: Props) {
  const { theme } = useTheme()

  const th = theme === "dark" ? "dark" : "light"

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0 outline-none" align="start">
        <div>
          <div className="flex w-full items-center justify-between p-2">
            <p className="pl-1 text-sm font-medium">Emoji</p>
            {onClickRemove && (
              <Button
                size="sm"
                className="h-auto p-1 text-xs font-normal"
                variant="secondary"
                onClick={onClickRemove}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Picker
            data={data}
            onEmojiSelect={onEmojiSelect}
            searchPosition="none"
            theme={th}
            skinTonePosition="none"
            previewPosition="none"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
