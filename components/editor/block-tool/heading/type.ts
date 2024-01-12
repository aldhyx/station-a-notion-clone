import { type BlockToolConstructorOptions } from "@editorjs/editorjs"
import { type Align } from "../../utility/alignment"

export type HeadingData = {
  /** Header's content */
  text: string
  /** Header's level from 1 to3 */
  level: number
  alignment: Align
}

export type HeadingLevel = {
  /** Level number */
  level: 1 | 2 | 3
  /** Tag corresponds with level number */
  tag: "H1" | "H2" | "H3"
  /** SVG Icon */
  svg: string
}

export type HeadingConfig = {
  /** Block's placeholder */
  placeholder: string
  /** Default heading level */
  defaultLevel: HeadingLevel["level"]
}

export type HeadingConstructor = BlockToolConstructorOptions<
  HeadingData,
  Partial<HeadingConfig>
>
