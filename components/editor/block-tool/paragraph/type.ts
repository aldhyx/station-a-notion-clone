import { BlockToolConstructorOptions } from "@editorjs/editorjs"

export type ParagraphData = {
  /** Paragraph's content. Can include HTML tags: <a><b><i> */
  text: string
  alignment: "left" | "right" | "center" | "justify"
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
