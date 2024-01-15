import { type BlockToolConstructorOptions } from "@editorjs/editorjs"

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
