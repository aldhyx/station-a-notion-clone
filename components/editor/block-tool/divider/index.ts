import { TunesMenuConfig } from "@editorjs/editorjs/types/tools"
import "./index.css"
import {
  type BlockTool,
  type ToolboxConfig,
  type BlockToolConstructorOptions,
} from "@editorjs/editorjs"

type DividerData = {
  type?: "star" | "line"
}

export default class DividerBlock implements BlockTool {
  /**
   * Available divider type
   */
  static AVAILABLE: DividerData["type"][] = ["star", "line"]

  /**
   * Divider default type
   */
  static DEFAULT: DividerData["type"] = "star"

  /**
   * Returns true to notify the core that read-only mode is supported
   */
  static get isReadOnlySupported(): boolean {
    return true
  }

  /**
   * Tool's Toolbox settings
   */
  static get toolbox(): ToolboxConfig {
    return {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><line x1="3" x2="21" y1="12" y2="12"/><polyline points="8 8 12 4 16 8"/><polyline points="16 16 12 20 8 16"/></svg>`,
      title: "Divider",
    }
  }

  /**
   * Editor.js API
   */
  public api
  /**
   * Divider css
   */
  private _CSS
  /**
   * Divider element
   */
  private _holderNode
  private _data

  constructor({ data, config, api }: BlockToolConstructorOptions<DividerData>) {
    console.log({ data })
    this._data = this._normalizeData(data)

    this.api = api

    this._CSS = {
      wrapper: "ce-divider",
      star: "ce-divider-star",
      line: "ce-divider-line",
    }

    this._holderNode = this._drawHolderNode()
  }

  /**
   * Normalize input data
   */
  private _normalizeData(data: DividerData) {
    return {
      type: DividerBlock.AVAILABLE.includes(data.type) ? data.type : DividerBlock.DEFAULT,
    }
  }

  /**
   * Create Tool's view
   */
  private _drawHolderNode(): HTMLDivElement {
    const div = document.createElement("DIV") as HTMLDivElement
    div.classList.add(
      this._CSS.wrapper,
      this.api.styles.block,
      this.data.type === "star" ? this._CSS.star : this._CSS.line,
    )

    return div
  }

  /**
   * Toggle divider from tunes menu
   */
  private _toggleDivider(type: DividerData["type"]) {
    this.data = { type }
  }

  render(): HTMLDivElement {
    return this._holderNode
  }

  renderSettings(): TunesMenuConfig {
    const settings = []

    for (let i = 0; i < this.dividerTunes.length; i++) {
      const item = this.dividerTunes[i]

      settings.push({
        icon: item.icon,
        label: this.api.i18n.t(`${item.title}`),
        onActivate: () => this._toggleDivider(item.type),
        closeOnActivate: true,
        isActive: this.data.type === item.type,
      })
    }

    return settings
  }

  save() {
    return this.data
  }

  get dividerTunes(): { type: DividerData["type"]; title: string; icon: string }[] {
    return [
      {
        type: "star",
        title: "Star",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><circle cx="12" cy="12" r="3"/><line x1="3" x2="9" y1="12" y2="12"/><line x1="15" x2="21" y1="12" y2="12"/></svg>',
      },
      {
        type: "line",
        title: "Line",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><path d="M5 12h14"/></svg>',
      },
    ]
  }

  get data(): DividerData {
    return this._data
  }

  set data(data) {
    this._data = this._normalizeData(data)

    if (this._holderNode.parentNode) {
      const newDiv = this._drawHolderNode()

      /**
       * Replace blocks
       */
      this._holderNode.parentNode.replaceChild(newDiv, this._holderNode)

      /**
       * Save new block to private variable
       */
      this._holderNode = newDiv
    }
  }
}
