import {
  type BlockToolConstructable,
  type EditorConfig,
  type ToolConfig,
} from "@editorjs/editorjs"
import { type HeadingConfig, type ParagraphConfig } from "./block-tool/@types"

// @ts-ignore
import NestedList from "@editorjs/nested-list"
// @ts-ignore
import Marker from "@editorjs/marker"
// @ts-ignore
import InlineCode from "@editorjs/inline-code"

import ParagraphBlock from "./block-tool/paragraph"
import HeadingBlock from "./block-tool/heading"

import AlignmentTune from "./block-tune/alignment"

export const tools: EditorConfig["tools"] = {
  alignment: AlignmentTune,
  paragraph: {
    class: ParagraphBlock as unknown as BlockToolConstructable,
    inlineToolbar: true,
    config: { preserveBlank: true } as ToolConfig<ParagraphConfig>,
    tunes: ["alignment"],
  },
  heading: {
    class: HeadingBlock as unknown as BlockToolConstructable,
    inlineToolbar: ["italic"],
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
  marker: {
    class: Marker,
    shortcut: "CMD+M",
  },
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+E",
  },
}
