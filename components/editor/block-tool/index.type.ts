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

export type Heading = {
  Data: HeadingData
  Level: HeadingLevel
  Config: HeadingConfig
  Constructor: BlockToolConstructorOptions<HeadingData, HeadingConfig>
}

type ParagraphData = {
  /** Paragraph's content. Can include HTML tags: <a><b><i> */
  text: string
}

type ParagraphConfig = {
  /** Block's placeholder */
  placeholder?: string
  /** Whether or not to keep blank paragraphs when saving editor data */
  preserveBlank?: boolean
}

export type Paragraph = {
  Data: ParagraphData
  Config: ParagraphConfig
  Constructor: BlockToolConstructorOptions<ParagraphData, ParagraphConfig>
}
