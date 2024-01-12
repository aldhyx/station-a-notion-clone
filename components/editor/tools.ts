import { ToolConstructable, ToolSettings } from "@editorjs/editorjs"
// @ts-ignore
import NestedList from "@editorjs/nested-list"
// @ts-ignore
import Marker from "@editorjs/marker"
// @ts-ignore
import InlineCode from "@editorjs/inline-code"

import { Heading, Paragraph } from "./block-tool/"

export const tools: Record<string, ToolConstructable | ToolSettings> = {
  paragraph: {
    //@ts-ignore
    class: Paragraph,
    inlineToolbar: true,
  },
  heading: {
    //@ts-ignore
    class: Heading,
    inlineToolbar: ["italic"],
    config: {
      defaultLevel: 2,
    },
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
