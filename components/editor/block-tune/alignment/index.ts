import "./index.css"

import {
  type API,
  type ToolConfig,
  type BlockTune,
  type BlockAPI,
} from "@editorjs/editorjs"
import { type BlockTuneData } from "@editorjs/editorjs/types/block-tunes/block-tune-data"

type BlockTuneConstructorOptions<Config extends object = any> = {
  api: API
  config?: ToolConfig<Config>
  block: BlockAPI
  data?: BlockTuneData
}

export default class AlignmentTune implements BlockTune {
  /**
   * Specifies Tool as Block Tune
   */
  static get isTune() {
    return true
  }

  /**
   * Get default alignment settings
   */
  static get SETTINGS(): { title: string; icon: string }[] {
    return [
      {
        title: "left",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>`,
      },
      {
        title: "center",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><line x1="21" x2="3" y1="6" y2="6"/><line x1="17" x2="7" y1="12" y2="12"/><line x1="19" x2="5" y1="18" y2="18"/></svg>`,
      },
      {
        title: "right",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="9" y1="12" y2="12"/><line x1="21" x2="7" y1="18" y2="18"/></svg>`,
      },
      {
        title: "justify",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>`,
      },
    ]
  }

  /**
   * Get available alignment
   */
  static get AVAILABLE_ALIGNMENT(): string[] {
    return ["left", "center", "right", "justify"]
  }

  /**
   * Get default alignment
   */
  static get DEFAULT_ALIGNMENT() {
    return "left"
  }

  /**
   * Editor.js API
   */
  public api
  /**
   * Block API object of Block tune is related to
   */
  public block
  /**
   * Tune's saved data
   */
  private _alignment: string
  /**
   * Block holder node
   */
  private _blockContent: HTMLDivElement
  private _wrapper: HTMLDivElement
  private _CSS

  constructor({ api, block, data }: BlockTuneConstructorOptions) {
    this.api = api
    this.block = block

    this._alignment = this._normalizeData(data)
    this._CSS = {
      wrapper: "cdx-horizontal__wrapper",
      button: "cdx-horizontal-button",
      buttonActive: "cdx-horizontal-button--active",
    }
    this._blockContent = this._createDiv()
    this._wrapper = this._createDiv()
  }

  /**
   * Create div element
   */
  private _createDiv() {
    return document.createElement("div")
  }
  /**
   * Normalize input data, return default alignment
   */
  private _normalizeData(data?: string) {
    if (data) return this.verifyAlignment(data) ? data : AlignmentTune.DEFAULT_ALIGNMENT

    return AlignmentTune.DEFAULT_ALIGNMENT
  }

  /**
   * Render button click handler
   */
  private _setAlignment(alignment: string) {
    this.alignment = alignment
    this._blockContent.dataset.alignment = this.alignment
    this.block.dispatchChange()
  }

  /**
   * Getter alignment internal data
   */
  get alignment() {
    return this._alignment
  }

  /**
   * Setter alignment internal data
   */
  set alignment(alignment) {
    console.log({ alignment }, "setter")
    this._alignment = this._normalizeData(alignment)
  }

  /**
   * Verify alignment whether is available or not
   */
  verifyAlignment(alignment: string): boolean {
    return AlignmentTune.AVAILABLE_ALIGNMENT.includes(alignment)
  }

  wrap(blockContent: HTMLDivElement): HTMLDivElement {
    blockContent.dataset.alignment = this.alignment

    this._blockContent = blockContent
    return this._blockContent
  }

  save() {
    return this.alignment
  }

  private createAlignmentButton(): HTMLButtonElement[] {
    const buttonNodes = []

    for (let i = 0; i < AlignmentTune.SETTINGS.length; i++) {
      const item = AlignmentTune.SETTINGS[i]

      const btn = document.createElement("button")

      btn.classList.add(this._CSS.button)
      btn.setAttribute("data-alignment", item.title)
      btn.classList.toggle(this._CSS.buttonActive, item.title === this.alignment)
      btn.innerHTML = item.icon

      this.api.tooltip.onHover(btn, `Align ${item.title}`, {
        placement: "top",
        hidingDelay: 100,
      })

      buttonNodes.push(btn)
    }

    return buttonNodes
  }

  render(): HTMLDivElement {
    const wrapper = document.createElement("div")
    this._wrapper = wrapper

    wrapper.classList.add(this._CSS.wrapper)
    wrapper.append(...this.createAlignmentButton())

    wrapper.addEventListener("click", event => {
      if (!event.target) return

      /**
       * Check if the clicked element or its ancestor is a button
       */
      const button = (event.target as Element).closest("button")

      if (button) {
        wrapper.childNodes.forEach(item => {
          if (
            item instanceof HTMLElement &&
            item.classList.contains("cdx-horizontal-button--active")
          ) {
            item.classList.remove("cdx-horizontal-button--active")
          }
        })
        button.classList.add(this._CSS.buttonActive)

        const alignmentValue = button.getAttribute("data-alignment") as string
        this._setAlignment(alignmentValue)
        this.api.tooltip.hide()
      }
    })

    return this._wrapper
  }
}
