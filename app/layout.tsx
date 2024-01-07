import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"
import { constructMetadata } from "@/lib/metadata"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata = constructMetadata()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-primary`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
