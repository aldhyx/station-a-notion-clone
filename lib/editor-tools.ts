import Header from "@editorjs/header"
import Alert from "editorjs-alert"
import Marker from "@editorjs/marker"
import Underline from "@editorjs/underline"

export const editorTools = {
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      placeholder: "Type a header",
      levels: [1, 2, 3],
      defaultLevel: 1,
    },
    shortcut: "CMD+SHIFT+H",
  },
  alert: {
    class: Alert,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+A",
    config: {
      defaultType: "warning",
      messagePlaceholder: "Type an alert",
    },
  },
  Marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M",
  },
  underline: {
    class: Underline,
    shortcut: "CMD+SHIFT+U",
  },
}
