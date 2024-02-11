import "./editor.css"

import EditorJS, {
  type API,
  type BlockMutationEvent,
  type EditorConfig,
  type OutputData,
} from "@editorjs/editorjs"
import React, { createRef, type PropsWithChildren } from "react"
import { tools } from "../tools"

type Props = PropsWithChildren &
  Omit<EditorConfig, "onChange" | "initialBlock" | "holderId" | "onReady"> & {
    onChangeHandler?(api: API, event: BlockMutationEvent | BlockMutationEvent[]): void
    onSaveHandler?(output?: OutputData): void
    onReadyHandler(editor: EditorJS | null): void
  }

export class EditorCore extends React.PureComponent<Props> {
  private editor: EditorJS | null = null
  private node = createRef<HTMLDivElement>()

  async removeEditor(): Promise<boolean> {
    if (this.editor) {
      try {
        await this.editor.isReady

        this.editor.destroy()
        this.editor = null
        return true
      } catch (error) {
        return false
      }
    }

    return false
  }

  getHolderNode(): HTMLDivElement {
    if (this.node.current) return this.node.current
    throw new Error("No node to append EditorJS, please provide holder!")
  }

  onChange(api: API, event: BlockMutationEvent | BlockMutationEvent[]): void {
    const { onChangeHandler, onSaveHandler } = this.props

    if (onChangeHandler && typeof onChangeHandler === "function") {
      onChangeHandler(api, event)
    }

    if (onSaveHandler && typeof onSaveHandler === "function") {
      this.dispatchData(onSaveHandler)
    }
  }

  async dispatchData(cb: (data?: OutputData) => void): Promise<void> {
    try {
      const output = await this.editor?.save()
      cb(output)
    } catch (error) {
      console.log("Failed dispatch save data", error)
    }
  }

  initEditor(): void {
    const { holder, ...config } = this.props
    const holderNode = holder ?? this.getHolderNode()

    this.editor = new EditorJS({
      holder: holderNode,
      onChange: (api, event) => this.onChange(api, event),
      tools: tools,
      onReady: () => this.props.onReadyHandler(this.editor),
      ...config,
    })
  }

  componentDidMount(): void {
    this.initEditor()
  }

  componentWillUnmount(): void {
    this.removeEditor()
  }

  async componentDidUpdate(prevProps: Readonly<Props>): Promise<void> {
    if (prevProps.readOnly !== this.props.readOnly) {
      const removed = await this.removeEditor()
      if (removed) this.initEditor()
    }
  }

  render(): React.ReactNode {
    if (!this.props.children) return <div ref={this.node} />
    return this.props.children
  }
}
