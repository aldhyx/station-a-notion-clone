import {
  type BlockToolConstructable,
  type EditorConfig,
  type ToolConfig,
} from "@editorjs/editorjs"

// @ts-ignore
import NestedList from "@editorjs/nested-list"

import ParagraphBlock, { type ParagraphConfig } from "./block-tool/paragraph"
import HeadingBlock, { type HeadingConfig } from "./block-tool/heading"

import AlignmentTune from "./block-tune/alignment"
import { BoldInlineTool } from "./inline-tool/bold"
import { ItalicInlineTool } from "./inline-tool/italic"
import { UnderlineInlineTool } from "./inline-tool/underline"
import { CodeInlineTool } from "./inline-tool/inline-code"
import { StrikethroughInlineTool } from "./inline-tool/strikethrough"
import DividerBlock from "./block-tool/divider"

export const tools: EditorConfig["tools"] = {
  alignment: AlignmentTune,
  paragraph: {
    class: ParagraphBlock as unknown as BlockToolConstructable,
    inlineToolbar: ["bold", "italic", "underline", "inlineCode", "strikethrough"],
    config: { preserveBlank: true } as ToolConfig<ParagraphConfig>,
    tunes: ["alignment"],
  },
  heading: {
    class: HeadingBlock as unknown as BlockToolConstructable,
    inlineToolbar: ["italic", "underline", "strikethrough"],
    config: { defaultLevel: 2 } as ToolConfig<HeadingConfig>,
    tunes: ["alignment"],
  },
  divider: DividerBlock,
  nestedList: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  bold: BoldInlineTool,
  italic: ItalicInlineTool,
  underline: UnderlineInlineTool,
  strikethrough: StrikethroughInlineTool,
  inlineCode: CodeInlineTool,
}
