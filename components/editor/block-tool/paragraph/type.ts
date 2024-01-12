import { type BlockToolConstructorOptions } from "@editorjs/editorjs"
import { type Align } from "../../utility/alignment"

export type ParagraphData = {
  /** Paragraph's content. Can include HTML tags: <a><b><i> */
  text: string
  alignment: Align
}

export type ParagraphConfig = {
  /** Block's placeholder */
  placeholder?: string
  /** Whether or not to keep blank paragraphs when saving editor data */
  preserveBlank?: boolean
}

export type ParagraphConstructor = BlockToolConstructorOptions<
  ParagraphData,
  Partial<ParagraphConfig>
>
