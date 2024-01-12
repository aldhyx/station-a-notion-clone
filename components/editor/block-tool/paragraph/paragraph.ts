import { type BlockTool, type PasteEvent, type ToolboxConfig } from "@editorjs/editorjs"
import "./paragraph.css"
import { type ParagraphConstructor, type ParagraphData } from "./type"
import Alignment from "../../utility/alignment"

export default class Paragraph implements BlockTool {
  /**
   * Editor.js API
   */
  public api
  /**
   * Read only mode flag from internal EditorJS API
   */
  public readOnly
  /**
   * Paragraph configuration
   */
  private _config
  /**
   * Initial Paragraph data
   */
  private _data
  /**
   * Paragraph element
   */
  private _holderNode
  /**
   * Paragraph css
   */
  private _CSS

  constructor({ data, config, api, readOnly }: ParagraphConstructor) {
    this.api = api
    this.readOnly = readOnly

    this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-paragraph",
    }

    if (!readOnly) {
      this.onKeyUp = this.onKeyUp.bind(this)
    }

    this._config = {
      preserveBlank: !!config?.preserveBlank,
      placeholder: config?.placeholder || "",
    }
    this._data = this._normalizeData(data)
    this._holderNode = this._drawHolderNode()
  }

  /**
   * Normalize input data
   */
  private _normalizeData(data: ParagraphData): ParagraphData {
    if (typeof data === "object") {
      return {
        text: data.text || "",
        alignment: data.alignment || Alignment.DEFAULT,
      }
    }
    return { text: "", alignment: Alignment.DEFAULT }
  }

  /**
   * Get paragraph tag for target level
   */
  private _drawHolderNode(): HTMLParagraphElement {
    /**
     * Create element for current Block's level
     */
    const paragraph = document.createElement("P") as HTMLParagraphElement

    /**
     * Add text to block
     */
    paragraph.innerHTML = this._data.text

    /**
     * Add text alignment
     */
    paragraph.dataset.alignment = this._data.alignment

    /**
     * Add styles class
     */
    paragraph.classList.add(this._CSS.wrapper, this._CSS.block)

    /**
     * Add Placeholder
     */
    paragraph.dataset.placeholder = this.api.i18n.t(this.placeholder)

    if (!this.readOnly) {
      paragraph.contentEditable = "true"
      paragraph.addEventListener("keyup", this.onKeyUp)
    }
    return paragraph
  }

  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditable elements
   */
  onKeyUp(e: KeyboardEvent) {
    if (e.code !== "Backspace" && e.code !== "Delete") return

    if (this._holderNode.textContent === "") {
      this._holderNode.innerHTML = ""
    }
  }

  /**
   * Clean up event listener
   */
  destroy(): void {
    this._holderNode.removeEventListener("keyup", this.onKeyUp)
  }

  /**
   * Return Tool's view
   */
  render(): HTMLParagraphElement {
    return this._holderNode
  }

  /**
   * Returns alignment block tunes config
   */
  renderSettings() {
    return Alignment.SETTINGS.map(item => ({
      icon: item.svg,
      label: this.api.i18n.t(`Align ${item.name}`),
      onActivate: () => this.setAlignment(item.name),
      closeOnActivate: true,
      isActive: this.data.alignment === item.name,
    }))
  }

  setAlignment(alignment: ParagraphData["alignment"]) {
    this.data = {
      text: this.data.text,
      alignment,
    }
  }

  /**
   * Validate paragraph block data:
   * - check for emptiness
   */
  validate(savedData: ParagraphData): boolean {
    if (savedData.text.trim() === "" && !this._config.preserveBlank) {
      return false
    }

    return true
  }

  /**
   * Extract Tool's data from the view
   */
  save(toolsContent: HTMLParagraphElement): ParagraphData {
    return {
      text: toolsContent.innerHTML,
      alignment: this.data.alignment,
    }
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   */
  merge(data: ParagraphData): void {
    const newData = {
      text: `${this.data.text}${data.text}`,
      alignment: this.data.alignment,
    }

    this.data = newData
  }

  /**
   * On paste callback fired from Editor.
   */
  onPaste(event: PasteEvent) {
    const data = {
      //@ts-ignore
      text: event.detail.data.innerHTML,
      alignment: this.data.alignment,
    }

    this.data = data
  }

  /** Get current alignment */
  get currentAlignment() {
    return Alignment.currentAlignment(this._holderNode)
  }

  /**
   * Get current Tools`s data
   */
  get data() {
    this._data.text = this._holderNode.innerHTML
    this._data.alignment = this.currentAlignment

    return this._data
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   */
  set data(data: ParagraphData) {
    this._data = this._normalizeData(data)

    /**
     * If level is set and block in DOM
     * then replace it to a new block
     */
    if (this._holderNode.parentNode) {
      const newParagraph = this._drawHolderNode()

      /**
       * Replace blocks
       */
      this._holderNode.parentNode.replaceChild(newParagraph, this._holderNode)

      /**
       * Save new block to private variable
       */
      this._holderNode = newParagraph
    }
  }

  /**
   * Get placeholder from paragraph config
   */
  get placeholder(): string {
    return this._config.placeholder || `Enter text...`
  }

  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   */
  static get pasteConfig() {
    return {
      tags: ["P"],
    }
  }
  /**
   * Enable Conversion Toolbar. Paragraph can be converted to/from other tools
   */
  static get conversionConfig() {
    return {
      export: "text", // to convert Paragraph to other block, use 'text' property of saved data
      import: "text", // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    }
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true,
      },
      alignment: false,
    }
  }

  /**
   * Returns true to notify the core that read-only mode is supported

   */
  static get isReadOnlySupported() {
    return true
  }

  /**
   * Icon and title for displaying at the Toolbox
   */
  static get toolbox(): ToolboxConfig {
    return {
      title: "Text",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>`,
    }
  }
}
