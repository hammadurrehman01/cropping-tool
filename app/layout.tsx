import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Background Cropper - Artwork Hub",
  description: "Professional image cropping tool for Steam and Discord designs",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: 'Motiva Sans', sans-serif;
}
        `}</style>
      </head>
      <body className="dark">{children}</body>
    </html>
  )
}