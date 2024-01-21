import {
  type InlineToolConstructorOptions,
  type InlineTool,
  type SanitizerConfig,
} from "@editorjs/editorjs"

export class UnderlineInlineTool implements InlineTool {
  /**
   * Specifies Tool as Inline Toolbar Tool
   */
  static isInline = true

  /**
   * Title for hover-tooltip
   */
  static title = "Underline"

  /**
   * Set a shortcut
   */
  static get shortcut() {
    return "CMD+U"
  }

  /**
   * Sanitizer Rule
   * Leave <u> tags
   */
  static get sanitize(): SanitizerConfig {
    return { u: {} }
  }

  /**
   * Editor api
   */
  public api
  /**
   * Wrap tag
   */
  public tag = "U"

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
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></svg>`
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
