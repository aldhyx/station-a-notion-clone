import "./index.css"

import {
  type InlineToolConstructorOptions,
  type InlineTool,
  type SanitizerConfig,
} from "@editorjs/editorjs"

export class CodeInlineTool implements InlineTool {
  /**
   * Specifies Tool as Inline Toolbar Tool
   */
  static isInline = true

  /**
   * Title for hover-tooltip
   */
  static title = "Inline code"

  /**
   * Set a shortcut
   */
  static get shortcut() {
    return "CMD+E"
  }

  /**
   * Sanitizer Rule
   * Leave <strong> tags
   */
  static get sanitize(): SanitizerConfig {
    return {
      code: {
        class: "cdx-code",
      },
    }
  }

  /**
   * Editor api
   */
  public api
  /**
   * Wrap tag
   */
  public tag = "CODE"

  /**
   * Elements
   */
  private _nodes: { button?: HTMLButtonElement } = {
    button: undefined,
  }

  constructor({ api }: InlineToolConstructorOptions) {
    this.api = api
  }

  /**
   * Get display tool icon
   */
  private get _toolIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
  }

  render(): HTMLElement {
    this._nodes.button = document.createElement("button") as HTMLButtonElement

    this._nodes.button.type = "button"
    this._nodes.button.classList.add(this.api.styles.inlineToolButton)
    this._nodes.button.innerHTML = this._toolIcon

    return this._nodes.button
  }

  checkState(): boolean {
    const termTag = Boolean(this.api.selection.findParentTag(this.tag))

    this._nodes.button?.classList.toggle(this.api.styles.inlineToolButtonActive, termTag)

    return termTag
  }

  surround(range: Range): void {
    if (!range) return

    const wrapper = this.api.selection.findParentTag(this.tag)

    /**
     * If start or end of selection is in the highlighted block
     */
    if (wrapper) {
      this.unwrap(wrapper)
    } else {
      this.wrap(range)
    }
  }

  /**
   * Wrap selection with term-tag
   */
  wrap(range: Range) {
    const tag = document.createElement(this.tag)
    tag.classList.add("cdx-code")

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(span);
     */
    tag.appendChild(range.extractContents())
    range.insertNode(tag)

    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(tag)
  }

  /**
   * Unwrap term-tag
   */
  unwrap(wrapper: HTMLElement) {
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(wrapper)

    const selection = window.getSelection()
    if (!selection) return

    const range = selection.getRangeAt(0)
    const unwrappedContent = range.extractContents()
    /**
     * Remove empty term-tag
     */
    wrapper.parentNode?.removeChild(wrapper)

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent)

    /**
     * Restore selection
     */
    selection.removeAllRanges()
    selection.addRange(range)
  }
}
