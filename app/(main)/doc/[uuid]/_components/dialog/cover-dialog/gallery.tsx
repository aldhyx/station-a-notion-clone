import Gradients from "./gradients"
import Pictures from "./pictures"

export default function Gallery() {
  return (
    <div className="mt-3 flex flex-col gap-y-6">
      <Gradients />
      <Pictures />
    </div>
  )
}
