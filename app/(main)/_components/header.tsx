"use client"

import ToggleSidebarButton from "./toggle-sidebar-button"
import SettingsHeader from "../settings/_components/header"
import DocHeader from "../doc/_components/header"
import DocDetailHeader from "../doc/[uuid]/_components/header"

const Header = function Header({ maximizeHandler }: { maximizeHandler: () => void }) {
  return (
    <header className="flex h-12 items-center justify-start px-3">
      <ToggleSidebarButton onClick={maximizeHandler} />

      <SettingsHeader />
      <DocHeader />
      <DocDetailHeader />
    </header>
  )
}

export default Header
