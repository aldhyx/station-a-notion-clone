import { Button } from "@/components/ui/button"
import Image from "next/image"
import NewDocDialog from "../_components/dialog/new-doc-dialog"

export default function DocPage() {
  return (
    <div className="flex h-[calc(100vh-48px)] flex-col items-center justify-center ">
      <Image
        alt=""
        src="/assets/documents.png"
        width={400}
        height={500}
        className="mb-8 w-[200px] object-contain filter dark:invert md:w-[400px]"
      />
      <h2 className="mb-1 text-2xl ">
        Welcome to <strong className="underline">Station</strong>
      </h2>
      <p className="mb-8 ">Create new page to start write your idea.</p>

      <NewDocDialog>
        <Button>Create New Page</Button>
      </NewDocDialog>
    </div>
  )
}
