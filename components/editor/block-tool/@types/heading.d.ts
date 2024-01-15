import { type BlockToolConstructorOptions } from "@editorjs/editorjs"

type HeadingData = {
  /** Header's content */
  text: string
  /** Header's level from 1 to 3 */
  level: number
}

type HeadingLevel = {
  /** Level number */
  level: number
  /** Tag corresponds with level number */
  tag: "H1" | "H2" | "H3"
  /** SVG Icon */
  svg: string
}

type HeadingConfig = {
  /** Block's placeholder */
  placeholder?: string
  /** Default heading level */
  defaultLevel?: HeadingLevel["level"]
}
