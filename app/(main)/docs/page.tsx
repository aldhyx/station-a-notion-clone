import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function DocumentsPage() {
  return (
    <div className="flex h-[calc(100vh-48px)] flex-col items-center justify-center">
      <Image
        alt=""
        src="/assets/heroes.png"
        width={600}
        height={700}
        className="mb-5 object-contain grayscale"
      />
      <p className="mb-5">Create new page to start write your idea.</p>
      <Button>Create New Page</Button>
    </div>
  )
}
