import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/redux/provider"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import TopLoadingBar from "@/components/layout/TopLoadinBar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fashion Fuel",
  description: "Style should be effortless, ethical, and empowering",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <TopLoadingBar >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
        </TopLoadingBar>
      </body>
    </html>
  )
}
