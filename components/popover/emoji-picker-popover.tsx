import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { PropsWithChildren } from "react"

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
}

export default function EmojiPickerPopover({ children, onEmojiSelect }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-auto border-none bg-transparent p-0 shadow-none outline-none"
        align="start"
      >
        <Picker
          data={data}
          onEmojiSelect={onEmojiSelect}
          searchPosition="none"
          theme="light"
          skinTonePosition="none"
          previewPosition="none"
        />
      </PopoverContent>
    </Popover>
  )
}
