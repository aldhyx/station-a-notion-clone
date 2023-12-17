import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Station App",
  description: "",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-zinc-800`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
