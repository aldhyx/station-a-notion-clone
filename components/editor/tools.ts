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
import ListBlock from "./block-tool/list"
//@ts-ignore
import Checklist from "@editorjs/checklist"

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
  checklist: {
    class: Checklist,
    inlineToolbar: ["bold", "italic", "underline", "inlineCode", "strikethrough"],
    toolbox: {
      title: "To-do list",
      icon: `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 17 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>
      `,
    },
  },
  list: {
    class: ListBlock as unknown as BlockToolConstructable,
    inlineToolbar: ["bold", "italic", "underline", "inlineCode", "strikethrough"],
  },
  divider: DividerBlock,
  bold: BoldInlineTool,
  italic: ItalicInlineTool,
  underline: UnderlineInlineTool,
  strikethrough: StrikethroughInlineTool,
  inlineCode: CodeInlineTool,
}
