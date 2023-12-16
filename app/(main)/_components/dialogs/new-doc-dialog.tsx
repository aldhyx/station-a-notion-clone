import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderIcon, PlusCircleIcon } from "lucide-react"
import { type PropsWithChildren } from "react"
import useNewDoc from "../../_hooks/use-doc-page"

type Props = PropsWithChildren & {
  uuid?: string
}

export default function NewDocDialog({ children, uuid }: Props) {
  const { closeButtonRef, form, isDisableSubmit, isLoadingSubmit, submitHandler } =
    useNewDoc({ uuid })

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        hideCloseButton
        className="top-[5%] flex w-[90%] translate-y-[0] flex-col gap-0 rounded-xl bg-background p-0 md:!max-w-xl"
      >
        <NewDocDialog.Title />

        <Form {...form}>
          <form
            onSubmit={submitHandler}
            className="flex w-full flex-col gap-y-3"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <div className="flex items-center px-3 pb-3">
                      <Input
                        type="text"
                        placeholder="Type page title..."
                        className="rounded-xl rounded-r-none border-r-0 bg-background text-sm placeholder:text-sm placeholder:text-zinc-500 focus-visible:ring-transparent"
                        {...field}
                      />

                      <Button
                        size="sm"
                        className="h-10 w-24 rounded-l-none rounded-r-xl"
                        type="submit"
                        disabled={isDisableSubmit}
                      >
                        {isLoadingSubmit ? (
                          <LoaderIcon className="h-4 w-4 animate-spin" />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </div>
                  </FormControl>

                  <FormMessage className="m-0 px-3 pb-3 pt-0" />
                </FormItem>
              )}
            />
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
    <div className="mb-1 flex items-center justify-start p-3">
      <PlusCircleIcon className="mr-2 h-4 w-4" />
      <p className="text-base font-medium leading-none">New page</p>
    </div>
  )
}
