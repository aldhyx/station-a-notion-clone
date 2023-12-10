import EmojiPickerPopover, { type Emoji } from "@/components/popover/emoji-picker-popover"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useDocStore } from "@/store/use-doc-store"
import Image from "next/image"
import { useParams } from "next/navigation"
import CoverDialog from "./cover-dialog/dialog"

export default function CoverBlock() {
  const params = useParams()
  const uuid = params.uuid as string

  const { doc, loadingDoc, signedUrl, updateEmojiAsync } = useDocStore()

  const emoji = doc?.emoji ? (doc.emoji as Emoji) : null
  const loading = loadingDoc || !doc

  return (
    <div className={cn("group/cover peer/cover relative mx-auto")}>
      {loading && <Skeleton className="h-48 w-full rounded-none bg-zinc-200 md:h-72" />}

      {!loading && signedUrl && (
        <div className="h-48 w-full md:h-72">
          <Image
            src={signedUrl}
            alt="cover"
            className="object-cover"
            fill
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAAEgCAYAAABM2WqwAAACFUlEQVR42u3SQQ0AAAjEMM6/TRJkgAp+rYRl6Z4teBajYTSMBkbDaBgNjIbRwGgYDaOB0TAaGA2jYTQwGkYDo2E0jAZGw2hgNIyG0cBoGA2jgdEwGhgNo2E0MBpGA6NhNIwGRsNoYDSMhtHAaBgNjIbRMBoYDaNhNDAaRgOjYTSMBkbDaGA0jIbRwGgYDYyG0TAaGA2jgdEwGkYDo2E0jAZGw2hgNIyG0cBoGA2MhtEwGhgNo4HRMBpGA6NhNDAaRsNoYDSMhtHAaBgNjIbRMBoYDaOB0TAaRgOjYTQwGkbDaGA0jAZGw2gYDYyG0TAaGA2jgdEwGkYDo2E0MBpGw2hgNIwGRsNoGA2MhtHAaBgNo4HRMBpGA6NhNDAaRsNoYDSMBkbDaBgNjIbRwGgYDaOB0TAaGA2jYTQwGkbDaDJgNIwGRsNoGA2MhtHAaBgNo4HRMBoYDaNhNDAaRgOjYTSMBkbDaBjNaBgNo4HRMBpGA6NhNDAaRsNoYDSMBkbDaBgNjIbRwGgYDaOB0TAaRjMaRsNoYDSMhtHAaBgNjIbRMBoYDaOB0TAaRgOjYTQwGkbDaGA0jIbRjIbRMBoYDaNhNDAaRgOjYTSMBkbDaGA0jIbRwGgYDYyG0TAaGA2jYTSjYTSMBkbDaBgNjIbRwGgYDaOB0TAaGA2jYTQwGkYDo2E0jAZGw2hgNIyG0cBoGA2jwZ8DIHclHTL/dUEAAAAASUVORK5CYII="
          />
        </div>
      )}

      {!loading && (
        <div
          className={cn(
            "relative mx-auto h-auto w-auto max-w-3xl",
            !signedUrl && "pt-20",
          )}
        >
          {signedUrl && (
            <CoverDialog>
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-4 right-4 h-auto p-[6px] text-xs font-normal text-zinc-500 md:hidden md:group-hover/cover:flex"
              >
                Change cover
              </Button>
            </CoverDialog>
          )}

          {emoji?.native && (
            <div className="absolute bottom-[-24px] left-5 rounded-full md:bottom-[-30px] md:left-0">
              <EmojiPickerPopover
                onEmojiSelect={(emoji, event) => updateEmojiAsync({ emoji, uuid })}
              >
                <span
                  role="button"
                  className="block rounded-sm py-2 text-5xl hover:bg-zinc-200/50 md:text-6xl"
                >
                  {emoji.native}
                </span>
              </EmojiPickerPopover>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
