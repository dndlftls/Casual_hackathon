"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LoginRequired() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
      <p className="text-gray-600 mb-6">이 페이지에 접근하려면 먼저 로그인해주세요.</p>
      <Link href="/login">
        <Button className="bg-orange-600 hover:bg-orange-700">로그인 하러가기</Button>
      </Link>
    </div>
  )
}


