import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "@/components/providrs";
import { Header } from "@/components/layout/Header";

const geistSans = GeistSans.variable;
const geistMono = GeistMono.variable;

export const metadata: Metadata = {
  title: "밥친구",
  description: "혼자 먹기 아쉬운 메뉴, 함께 먹어요!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${geistSans} ${geistMono} antialiased`}>
      <body>
        <Script
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || "demo"}`}
          strategy="beforeInteractive"
        />
        <Providers>
          {/* 1. Header를 Providers 바로 아래에 배치합니다. */}
          <Header />
          
          {/* 2. 메인 컨텐츠 영역을 별도의 <main> 태그로 감싸줍니다. */}
          <main>
            {/* 3. Suspense가 children을 직접 감싸도록 구조를 수정합니다. */}
            <Suspense fallback={null}>{children}</Suspense>
          </main>

        </Providers>
      </body>
    </html>
  );
}