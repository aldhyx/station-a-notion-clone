import { PropsWithChildren } from "react"

import FullScreenLoading from "@/components/full-screen-loading"
import dynamic from "next/dynamic"

const LayoutWrapper = dynamic(() => import("./_components/layout-wrapper"), {
  ssr: false,
  loading: () => <FullScreenLoading />,
})

export default function MainLayout({ children }: PropsWithChildren) {
  return <LayoutWrapper>{children}</LayoutWrapper>
}
