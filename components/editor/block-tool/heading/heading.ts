import "./heading.css"

import {
  PasteConfig,
  type BlockTool,
  type ToolboxConfig,
  PasteEvent,
} from "@editorjs/editorjs"
import { type HeadingConstructor, type HeadingLevel, type HeadingData } from "./type"
import Alignment from "../../utility/alignment"

export default class HeadingBlock implements BlockTool {
  /**
   * Editor.js API
   */
  public api
  /**
   * Read only mode flag from internal EditorJS API
   */
  public readOnly
  /**
   * Heading configuration
   */
  private _config
  /**
   * Initial heading data
   */
  private _data
  /**
   * Heading element
   */
  private _holderNode
  /**
   * Heading css
   */
  private _CSS

  constructor({ data, config, api, readOnly }: HeadingConstructor) {
    this.api = api
    this.readOnly = readOnly

    this._CSS = {
      wrapper: "ce-heading",
    }

    this._config = config || {}
    this._data = this._normalizeData(data)
    this._holderNode = this._drawHolderNode()
  }

  /**
   * Normalize input data
   */
  private _normalizeData(data: HeadingData): HeadingData {
    if (typeof data === "object") {
      return {
        text: data.text || "",
        level: Number(data.level) || this.defaultLevel.level,
        alignment: data.alignment || Alignment.DEFAULT,
      }
    }

    return {
      text: "",
      level: this.defaultLevel.level,
      alignment: Alignment.DEFAULT,
    }
  }

  /**
   * Get heading tag for target level
   * By default returns second-leveled header
   */
  private _drawHolderNode(): HTMLHeadingElement {
    /**
     * Create element for current Block's level
     */
    const heading = document.createElement(this.currentLevel.tag) as HTMLHeadingElement

    /**
     * Add text to block
     */
    heading.innerHTML = this._data.text

    /**
     * Add styles class
     */
    heading.classList.add(this._CSS.wrapper)

    /**
     * Add text alignment
     */
    heading.dataset.alignment = this._data.alignment

    /**
     * Make tag editable
     */
    if (!this.readOnly) {
      heading.contentEditable = "true"
    }

    /**
     * Add Placeholder
     */
    heading.dataset.placeholder = this.api.i18n.t(this.placeholder)

    return heading
  }

  /**
   * Return Tool's view
   */
  render(): HTMLHeadingElement {
    return this._holderNode
  }

  /**
   * Returns header block tunes config
   */
  renderSettings() {
    const settings = []
    // create level setting
    for (let i = 0; i < this.levels.length; i++) {
      const item = this.levels[i]
      settings.push({
        icon: item.svg,
        label: this.api.i18n.t(`Heading ${item.level}`),
        onActivate: () => this.setLevel(item.level),
        closeOnActivate: true,
        isActive: this.data.level === item.level,
      })
    }

    // create alignment setting
    for (let i = 0; i < Alignment.SETTINGS.length; i++) {
      const item = Alignment.SETTINGS[i]
      settings.push({
        icon: item.svg,
        label: this.api.i18n.t(`Align ${item.name}`),
        onActivate: () => this.setAlignment(item.name),
        closeOnActivate: true,
        isActive: this.data.alignment === item.name,
      })
    }

    return settings
  }

  /**
   * Callback for Block's settings buttons
   */
  setAlignment(alignment: HeadingData["alignment"]) {
    this.data = {
      level: this.data.level,
      text: this.data.text,
      alignment,
    }
  }

  /**
   * Callback for Block's settings buttons
   */
  setLevel(level: HeadingLevel["level"]): void {
    this.data = {
      level: level,
      text: this.data.text,
      alignment: this.data.alignment,
    }
  }

  /**
   * Validate Text block data:
   * - check for emptiness
   */
  validate(blockData: HeadingData): boolean {
    return blockData.text.trim() !== ""
  }

  /**
   * Extract Tool's data from the view
   */
  save(toolsContent: HTMLHeadingElement): HeadingData {
    return {
      text: toolsContent.innerHTML,
      level: this.data.level,
      alignment: this.data.alignment,
    }
  }

  /**
   * Method that specified how to merge two similar blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   */
  merge(data: HeadingData): void {
    const newData = {
      text: `${this.data.text}${data.text}`,
      level: this.data.level,
      alignment: this.data.alignment,
    }

    this.data = newData
  }

  /**
   * Handle H1-H3 tags on paste to substitute it with header Tool
   */
  onPaste(event: PasteEvent) {
    //@ts-ignore
    const content = event.detail.data
    let level = this.defaultLevel.level

    switch (content.tagName) {
      case "H1":
        level = 1
        break
      case "H2":
        level = 2
        break
      case "H3":
        level = 3
        break
    }

    this.data = {
      level,
      text: content.innerHTML,
      alignment: this.data.alignment,
    }
  }

  /**
   * Get current alignment
   */
  get currentAlignment() {
    return Alignment.currentAlignment(this._holderNode)
  }

  /**
   * Get current Tools`s data
   */
  get data(): HeadingData {
    this._data.text = this._holderNode.innerHTML
    this._data.level = this.currentLevel.level
    this._data.alignment = this.currentAlignment

    return this._data
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   */
  set data(data: HeadingData) {
    this._data = this._normalizeData(data)

    /**
     * If level is set and block in DOM
     * then replace it to a new block
     */
    if (data.level && this._holderNode.parentNode) {
      const newHeading = this._drawHolderNode()

      /**
       * Replace blocks
       */
      this._holderNode.parentNode.replaceChild(newHeading, this._holderNode)

      /**
       * Save new block to private variable
       */
      this._holderNode = newHeading
    }
  }

  /**
   * Get placeholder from heading config
   */
  get placeholder(): string {
    return this._config.placeholder || `Enter heading ${this.currentLevel.level}...`
  }

  /**
   * Get current level
   */
  get currentLevel(): HeadingLevel {
    const level = this.levels.find(item => item.level === this._data.level)
    return level ? level : this.defaultLevel
  }

  /**
   * Get default level from header config, default h1
   */
  get defaultLevel(): HeadingLevel {
    /** User can specify own default level value */
    const defaultLevel = this._config.defaultLevel

    if (defaultLevel) {
      const userSpecified = this.levels.find(item => item.level === defaultLevel)
      if (userSpecified) return userSpecified

      console.warn(
        "🙃 Heading BlockTool: the default level specified was not found in available levels",
      )
    }

    /** If not available return H2 as default level */
    return this.levels[0]
  }

  /**
   * Available header levels
   */
  get levels(): HeadingLevel[] {
    return [
      {
        tag: "H1",
        level: 1,
        svg: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="m17 12 3-2v8"/></svg>`,
      },
      {
        level: 2,
        tag: "H2",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></svg>`,
      },
      {
        level: 3,
        tag: "H3",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"/></svg>`,
      },
    ]
  }

  /**
   * Used by Editor.js paste handling API.
   * Provides configuration to handle H1-H3 tags.
   */
  static get pasteConfig(): PasteConfig {
    return {
      tags: ["H1", "H2", "H3"],
    }
  }

  /**
   * Allow Header to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      export: "text", // use 'text' property for other blocks
      import: "text", // fill 'text' property from other block's export string
    }
  }

  /**
   * Sanitizer Rules
   */
  static get sanitize() {
    return {
      level: false,
      text: {},
    }
  }

  /**
   * Returns true to notify core that read-only is supported
   */
  static get isReadOnlySupported() {
    return true
  }

  /**
   * Get Tool toolbox settings
   */
  static get toolbox(): ToolboxConfig {
    return {
      title: "Heading",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><path d="M6 12h12"/><path d="M6 20V4"/><path d="M18 20V4"/></svg>`,
    }
  }
}
