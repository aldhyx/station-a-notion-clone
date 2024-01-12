export type Align = "left" | "right" | "center" | "justify"

export default class Alignment {
  /**
   * Get allowed alignments
   */
  static get AVAILABLE(): Record<Align, Align> {
    return {
      left: "left",
      center: "center",
      right: "right",
      justify: "justify",
    }
  }
  /**
   * Get default alignments
   */
  static get DEFAULT() {
    return this.AVAILABLE.left as "left"
  }

  static get SETTINGS(): { name: Align; svg: string }[] {
    return [
      {
        name: "left",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>`,
      },
      {
        name: "center",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><line x1="21" x2="3" y1="6" y2="6"/><line x1="17" x2="7" y1="12" y2="12"/><line x1="19" x2="5" y1="18" y2="18"/></svg>`,
      },
      {
        name: "right",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="9" y1="12" y2="12"/><line x1="21" x2="7" y1="18" y2="18"/></svg>`,
      },
      {
        name: "justify",
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="lc"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>`,
      },
    ]
  }

  /**
   * Get current alignment from dom node at data-alignment attr
   */
  static currentAlignment(node: HTMLElement) {
    const dataAlignment = node?.dataset.alignment as Align | undefined

    let current
    if (dataAlignment) current = Alignment.AVAILABLE[dataAlignment]

    return current || Alignment.DEFAULT
  }
}
