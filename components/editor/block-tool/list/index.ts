import { TunesMenuConfig } from "@editorjs/editorjs/types/tools"
import "./index.css"

import {
  type PasteConfig,
  type BlockTool,
  type ToolboxConfig,
  type HTMLPasteEvent,
  type ConversionConfig,
  type SanitizerConfig,
  type BlockToolConstructorOptions,
} from "@editorjs/editorjs"

type ListData = {
  /**
   * Saved data list style, could be ordered | unordered
   */
  style: string
  items: string[]
}

export type ListConfig = {
  /**
   * Default list style, could be ordered | unordered
   */
  defaultStyle?: string
}

export default class ListBlock implements BlockTool {
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

  constructor({
    api,
    data,
    readOnly,
    block,
    config,
  }: BlockToolConstructorOptions<ListData, ListConfig>) {
    this.api = api
    this.readOnly = readOnly

    this._CSS = {
      block: this.api.styles.block,
      wrapper: "cdx-list",
      item: "cdx-list__item",
    }

    this._config = {
      defaultStyle: this._normalizeListStyle(config?.defaultStyle),
    }

    this._data = this._normalizeData(data)
    this._holderNode = this._drawHolderNode()
  }

  render(): HTMLOListElement | HTMLUListElement {
    return this._holderNode
  }

  renderSettings(): HTMLElement | TunesMenuConfig {
    return this.listStyles.map(({ icon, label, style }) => ({
      icon,
      label: this.api.i18n.t(`${label}`),
      onActivate: () => {
        this.data = { style, items: this.data.items }
      },
      closeOnActivate: true,
      isActive: this.data.style === style,
    }))
  }

  save(block: HTMLElement) {
    return this.data
  }

  onPaste(event: HTMLPasteEvent) {
    const list = event.detail.data as HTMLUListElement | HTMLOListElement | HTMLLIElement

    this.data = this.pasteHandler(list)
  }

  /**
   * Handle UL, OL and LI tags paste and returns List data
   */
  pasteHandler(element: HTMLUListElement | HTMLOListElement | HTMLLIElement): ListData {
    const { tagName: tag } = element
    let style = "unordered"

    switch (tag) {
      case "OL":
        style = "ordered"
        break
      case "UL":
      case "LI":
        style = "unordered"
    }

    const data: ListData = {
      style,
      items: [],
    }

    if (tag === "LI") {
      data.items.push(element.innerHTML)
    } else {
      const items = Array.from(element.querySelectorAll("LI"))
      data.items = items.map(li => li.innerHTML).filter(item => !!item.trim())
    }

    return data
  }

  /**
   * Get current Tools`s data
   */
  get data(): ListData {
    this._data.items = []

    const items = this._holderNode.querySelectorAll(`.${this._CSS.item}`)
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      this._data.items.push(item.innerHTML)
    }

    return this._data
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   */
  set data(data) {
    this._data = this._normalizeData(data)

    /**
     * If level is set and block in DOM
     * then replace it to a new block
     */
    if (this._holderNode.parentNode) {
      const newList = this._drawHolderNode()

      /**
       * Replace blocks
       */
      this._holderNode.parentNode.replaceChild(newList, this._holderNode)

      /**
       * Save new block to private variable
       */
      this._holderNode = newList
    }
  }

  /**
   * Available list style for block tunes
   */
  get listStyles() {
    return [
      {
        style: "unordered",
        label: "Bullet list",
        icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>`,
      },
      {
        style: "ordered",
        label: "Number list",
        icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`,
      },
    ]
  }

  private _drawHolderNode(): HTMLOListElement | HTMLUListElement {
    const wrapper = this._makeMainTag()

    if (this._data.items.length) {
      for (let i = 0; i < this._data.items.length; i++) {
        wrapper.appendChild(this._makeListTag(this._data.items[i]))
      }
    } else {
      wrapper.appendChild(this._makeListTag())
    }

    if (!this.readOnly) {
      wrapper.addEventListener("keydown", e => {
        const event = e as KeyboardEvent

        if (event.key === "Backspace") this._backspaceEventHandler(event)
        if (event.key === "Enter") this._enterEventHandler(event)
      })
    }

    return wrapper
  }

  /**
   * Get current element by caret position
   */
  private get _currentItem(): Element | null {
    let currentNode = window.getSelection()?.anchorNode

    if (
      currentNode &&
      currentNode.nodeType !== Node.ELEMENT_NODE &&
      currentNode.parentNode
    ) {
      currentNode = currentNode.parentNode
    }

    return currentNode instanceof Element
      ? currentNode.closest(`.${this._CSS.item}`)
      : null
  }

  private _enterEventHandler(event: KeyboardEvent) {
    const items = this._holderNode.querySelectorAll(`.${this._CSS.item}`)
    const currentItem = this._currentItem
    const lastItem = items[items.length - 1]

    if (items.length < 2 || currentItem === null) return

    const lastItemText = lastItem.textContent?.trim()
    /**  Prevent Default li generation if item is empty */
    if (currentItem === lastItem && !lastItemText?.length) {
      /** Insert New Block and set caret */
      currentItem.remove()
      this.api.blocks.insert()
      this.api.caret.setToBlock(this.api.blocks.getCurrentBlockIndex())
      event.preventDefault()
      event.stopPropagation()
    }
  }

  private _backspaceEventHandler(event: KeyboardEvent) {
    const items = this._holderNode.querySelectorAll(`.${this._CSS.item}`)
    const selection = window.getSelection()
    const currentItem = this._currentItem

    if (items.length < 2 || currentItem === null || selection === null) return

    const currentItemText = currentItem.textContent?.trim()

    /**
     * If empty text content and cursor position at beginning & press backspace, remove current element
     * Before:
     * - test 1
     * -|
     *
     * After
     * - test 1|
     */
    if (!currentItemText && selection.anchorOffset === 0) {
      event.preventDefault()
      currentItem.remove()
      return
    }

    /**
     * If has text content and cursor position at beginning & press backspace, remove current element
     * Also grab & merge current text content with previous sibling text content
     * Before:
     * - test 1
     * -| test 2
     *
     * After
     * - test 1 |test 2
     */
    if (currentItemText && selection.anchorOffset === 0) {
      const prevSibling = currentItem.previousElementSibling
      if (prevSibling === null) return

      /** This is used only to place cursor, will remove later */
      const cursor = document.createElement("span")
      cursor.hidden = true

      /** Merge sibling text content with fake cursor & current text content */
      prevSibling.append(cursor, currentItemText)

      /** Adjust caret position after merged */
      const range = new Range()
      range.selectNodeContents(prevSibling)
      range.collapse(true)
      range.setStart(cursor, 0)

      selection.removeAllRanges()
      selection.addRange(range)

      event.preventDefault()
      currentItem.remove()
      cursor.remove()
      return
    }
  }

  private _makeMainTag(): HTMLOListElement | HTMLUListElement {
    const listStyle = this._data.style === ListBlock.DEFAULT_LIST_STYLE ? "ul" : "ol"

    const wrapper = document.createElement(listStyle)
    wrapper.classList.add(this._CSS.block, this._CSS.wrapper)
    if (!this.readOnly) wrapper.contentEditable = "true"

    return wrapper
  }

  private _makeListTag(innerHTML?: string): HTMLLIElement {
    const list = document.createElement("li")
    list.classList.add(this._CSS.item)
    if (innerHTML) list.innerHTML = innerHTML

    return list
  }

  private _normalizeData(data: ListData): ListData {
    if (typeof data === "object") {
      return {
        style: this._normalizeListStyle(data.style),
        items: Array.isArray(data.items) ? [...data.items] : [],
      }
    }

    return {
      style: ListBlock.DEFAULT_LIST_STYLE,
      items: [],
    }
  }

  private _normalizeListStyle(style?: string): string {
    if (style && ListBlock.AVAILABLE_LIST_STYLES.includes(style)) return style

    return ListBlock.DEFAULT_LIST_STYLE
  }

  /**
   * Available list style
   */
  static AVAILABLE_LIST_STYLES = ["unordered", "ordered"]
  /**
   * Default list style
   */
  static DEFAULT_LIST_STYLE = "unordered"

  /**
   * Sanitizer rules description
   */
  static get sanitize() {
    return {
      style: false,
      items: {
        br: true,
      },
    }
  }

  /**
   * Returns true to notify the core that read-only mode is supported
   */
  static get isReadOnlySupported(): boolean {
    return true
  }

  /**
   * Tool's Toolbox settings
   */
  static get toolbox(): ToolboxConfig[] {
    return [
      {
        title: "Bullet list",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>`,
        data: {
          style: "unordered",
        },
      },
      {
        title: "Number list",
        icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`,
        data: {
          style: "ordered",
        },
      },
    ]
  }

  /**
   * Allow to use native Enter behaviour
   */
  static get enableLineBreaks() {
    return true
  }

  /**
   * Allow List Tool to be converted to/from other block
   */
  static get conversionConfig() {
    return {
      /**
       * To create exported string from list, concatenate items by dot-symbol
       */
      export: (data: ListData): string => {
        return data.items.join(". ")
      },
      /**
       * To create a list from other block's string, just put it at the first item
       */
      import: (string: string): ListData => {
        return {
          items: [string],
          style: "unordered",
        }
      },
    }
  }

  /**
   * List Tool on paste configuration
   */
  static get pasteConfig() {
    return {
      tags: ["OL", "UL", "LI"],
    }
  }
}
