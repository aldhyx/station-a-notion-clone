import {
  type BlockToolConstructable,
  type EditorConfig,
  type ToolConfig,
} from "@editorjs/editorjs"

// @ts-ignore
import NestedList from "@editorjs/nested-list"
// @ts-ignore
import Marker from "@editorjs/marker"
// @ts-ignore
import InlineCode from "@editorjs/inline-code"

import ParagraphBlock, { type ParagraphConfig } from "./block-tool/paragraph"
import HeadingBlock, { type HeadingConfig } from "./block-tool/heading"

import AlignmentTune from "./block-tune/alignment"
import { BoldInlineTool } from "./inline-tool/bold"
import { ItalicInlineTool } from "./inline-tool/inline"
import { UnderlineInlineTool } from "./inline-tool/underline"
import { CodeInlineTool } from "./inline-tool/inline-code"

export const tools: EditorConfig["tools"] = {
  alignment: AlignmentTune,
  paragraph: {
    class: ParagraphBlock as unknown as BlockToolConstructable,
    inlineToolbar: ["bold", "italic", "underline", "inlineCode"],
    config: { preserveBlank: true } as ToolConfig<ParagraphConfig>,
    tunes: ["alignment"],
  },
  heading: {
    class: HeadingBlock as unknown as BlockToolConstructable,
    inlineToolbar: ["italic", "underline"],
    config: { defaultLevel: 2 } as ToolConfig<HeadingConfig>,
    tunes: ["alignment"],
  },
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
  inlineCode: CodeInlineTool,
}
