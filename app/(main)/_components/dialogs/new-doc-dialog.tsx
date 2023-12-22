import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderIcon, PlusCircleIcon, SmilePlusIcon } from "lucide-react"
import { type PropsWithChildren } from "react"
import useNewDoc from "../../_hooks/use-new-doc"
import EmojiPickerPopover from "@/components/popover/emoji-picker-popover"

type Props = PropsWithChildren & {
  uuid?: string
}

export default function NewDocDialog({ children, uuid }: Props) {
  const {
    closeButtonRef,
    form,
    isDisableSubmit,
    isLoadingSubmit,
    submitHandler,
    openDialogHandler,
  } = useNewDoc({ uuid })

  return (
    <Dialog onOpenChange={openDialogHandler}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="top-[5%] flex w-[90%] translate-y-[0] flex-col gap-0 rounded-xl bg-background p-0 md:!max-w-xl">
        <NewDocDialog.Title />

        <Form {...form}>
          <form
            onSubmit={submitHandler}
            className="flex w-full gap-x-2 px-3 pb-3"
            autoComplete="off"
          >
            <EmojiPickerPopover onEmojiSelect={emoji => form.setValue("emoji", emoji)}>
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 shrink-0 rounded-xl p-0 text-zinc-500"
              >
                {form.getValues("emoji.native") ? (
                  <span className="text-xl">{form.getValues("emoji.native")}</span>
                ) : (
                  <SmilePlusIcon className="w-5" />
                )}
              </Button>
            </EmojiPickerPopover>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full space-y-0">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter page title..."
                      className="rounded-xl bg-background text-sm placeholder:text-sm placeholder:text-zinc-500 focus-visible:ring-transparent"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="m-0 px-3 pb-3 pt-0" />
                </FormItem>
              )}
            />

            <Button
              size="sm"
              className="h-10 w-24 rounded-xl"
              type="submit"
              disabled={isDisableSubmit}
            >
              {isLoadingSubmit ? (
                <LoaderIcon className="h-4 w-4 animate-spin" />
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </Form>

        <DialogClose asChild>
          <Button className="hidden" ref={closeButtonRef}>
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

NewDocDialog.Title = function Title() {
  return (
    <div className="mb-1 flex items-center justify-start p-3 dark:text-zinc-100">
      <PlusCircleIcon className="mr-2 h-4 w-4" />
      <p className="text-base font-medium leading-none">New page</p>
    </div>
  )
}
