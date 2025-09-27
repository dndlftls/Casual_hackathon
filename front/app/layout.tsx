import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import Script from "next/script"
import { Suspense } from "react"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext";

const geistSans = GeistSans.variable
const geistMono = GeistMono.variable

export const metadata: Metadata = {
  title: "BabFriend",
  description: "Don't Eat Alone Anymore!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${geistSans} ${geistMono} antialiased`}>
      <head>
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>
      </head>
      <body>
        <Script
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || "demo"}`}
          strategy="beforeInteractive"
        />
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
