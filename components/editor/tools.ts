import { ToolConstructable, ToolSettings } from "@editorjs/editorjs"
import { Heading } from "./block-tool/"
// @ts-ignore
import NestedList from "@editorjs/nested-list"
// @ts-ignore
import Marker from "@editorjs/marker"
// @ts-ignore
import InlineCode from "@editorjs/inline-code"
export const tools: Record<string, ToolConstructable | ToolSettings> = {
  heading: {
    //@ts-ignore
    class: Heading,
    inlineToolbar: ["italic"],
  },
  list: {
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
