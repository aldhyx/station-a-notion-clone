import { LoaderIcon, MessageCircleQuestionIcon } from "lucide-react"
import React, { type PropsWithChildren } from "react"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import useFeedback from "../../_hooks/use-feedback"

type Props = PropsWithChildren & {}

export default function FeedbackDialog({ children }: Props) {
  const {
    closeButtonRef,
    content,
    contentChangeHandler,
    resetContentHandler,
    onSubmitHandler,
    FEEL,
  } = useFeedback()

  const { feel, isContacted, isSubmitting, message } = content

  return (
    <Dialog onOpenChange={resetContentHandler}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onOpenAutoFocus={e => e.preventDefault()}
        className="top-[5%] flex w-[90%] translate-y-[0] flex-col gap-0 rounded-xl bg-background p-0 md:!max-w-md"
      >
        <FeedbackDialog.Title />

        <div className="mb-7 mt-4 flex flex-col items-center px-3">
          <p className="mb-1 text-sm">
            What do you feel when using <strong>Station Note</strong>?
          </p>
          <RadioGroup
            className="flex gap-x-2 md:gap-x-3"
            onValueChange={v => contentChangeHandler({ feel: FEEL[Number(v)] ?? null })}
          >
            <div className="flex items-center">
              <RadioGroupItem hidden value="1" id="feel-one" className="peer" />
              <Label
                className="flex shrink-0 cursor-pointer flex-col gap-y-1 text-center text-xs grayscale transition hover:grayscale-0 peer-[[data-state=checked]]:grayscale-0"
                htmlFor="feel-one"
              >
                <Image
                  src="/assets/emoji/1F620.svg"
                  alt=""
                  height={48}
                  width={48}
                  className="scale-125"
                />
                Terrible
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem hidden value="2" id="feel-two" className="peer" />
              <Label
                className="flex shrink-0 cursor-pointer flex-col gap-y-1 text-center text-xs grayscale transition hover:grayscale-0 peer-[[data-state=checked]]:grayscale-0"
                htmlFor="feel-two"
              >
                <Image
                  src="/assets/emoji/2639.svg"
                  alt=""
                  height={48}
                  width={48}
                  className="scale-125"
                />
                Bad
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem hidden value="3" id="feel-three" className="peer" />
              <Label
                className="flex shrink-0 cursor-pointer flex-col gap-y-1 text-center text-xs grayscale transition hover:grayscale-0 peer-[[data-state=checked]]:grayscale-0"
                htmlFor="feel-three"
              >
                <Image
                  src="/assets/emoji/1F610.svg"
                  alt=""
                  height={48}
                  width={48}
                  className="scale-125"
                />
                Okay
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem hidden value="4" id="feel-four" className="peer" />
              <Label
                className="flex shrink-0 cursor-pointer flex-col gap-y-1 text-center text-xs grayscale transition hover:grayscale-0 peer-[[data-state=checked]]:grayscale-0"
                htmlFor="feel-four"
              >
                <Image
                  src="/assets/emoji/1F642.svg"
                  alt=""
                  height={48}
                  width={48}
                  className="scale-125"
                />
                Good
              </Label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem hidden value="5" id="feel-five" className="peer" />
              <Label
                className="flex shrink-0 cursor-pointer flex-col gap-y-1 text-center text-xs grayscale transition hover:grayscale-0 peer-[[data-state=checked]]:grayscale-0"
                htmlFor="feel-five"
              >
                <Image
                  src="/assets/emoji/1F600.svg"
                  alt=""
                  height={48}
                  width={48}
                  className="scale-125"
                />
                Amazing
              </Label>
            </div>
          </RadioGroup>
        </div>

        {feel && (
          <div className="mb-3 px-3">
            <Label htmlFor="message" className="mb-2 block">
              {feel === "AMAZING"
                ? "So, we did a good job?"
                : "Any thoughts you'd like to share?"}
            </Label>
            <Textarea
              value={message}
              onChange={e => contentChangeHandler({ message: e.target.value })}
              id="message"
              className="focus-within:bg-transparent focus-within:!ring-transparent"
            />
          </div>
        )}

        {feel && (
          <div className="mb-3 flex items-center gap-x-2 px-3">
            <Checkbox
              id="is-contacted"
              onCheckedChange={v => contentChangeHandler({ isContacted: !!v })}
              checked={isContacted}
            />
            <Label htmlFor="is-contacted" className="leading-tight">
              I&apos;m happy to be contacted to discuss this feedback
            </Label>
          </div>
        )}

        {feel && (
          <div className="mb-6 flex w-full gap-2 px-3">
            <Button
              variant="default"
              className="w-full"
              disabled={isSubmitting}
              onClick={onSubmitHandler}
            >
              {isSubmitting && (
                <LoaderIcon className="animate mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </div>
        )}

        <DialogClose hidden ref={closeButtonRef} />
      </DialogContent>
    </Dialog>
  )
}

FeedbackDialog.Title = function Title() {
  return (
    <div className="flex items-center justify-start p-3">
      <MessageCircleQuestionIcon className="mr-2 h-4 w-4" />
      <p className="text-base font-medium leading-none">Give feedback</p>
    </div>
  )
}
