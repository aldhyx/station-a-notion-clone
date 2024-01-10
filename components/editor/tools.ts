import { ToolConstructable, ToolSettings } from "@editorjs/editorjs"
import { Heading } from "./block-tool/"

export const tools: Record<string, ToolConstructable | ToolSettings> = {
  heading: {
    //@ts-ignore
    class: Heading,
    inlineToolbar: ["italic"],
  },
}
