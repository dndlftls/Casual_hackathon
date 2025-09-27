"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Utensils, Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import QuickMatch from "@/components/quick-match"

export default function QuickMatchPage() {
  const router = useRouter()
  const [step, setStep] = useState<"preferences" | "matching">("preferences")
  const [preferences, setPreferences] = useState({
    menu: "",
    location: "",
    time: "",
    maxMembers: 2,
  })

  const handleStartMatching = (e: React.FormEvent) => {
    e.preventDefault()
    if (preferences.menu && preferences.location && preferences.time) {
      setStep("matching")
    }
  }

  const handleMatchFound = (match: any) => {
    // In a real app, this would create a group and redirect
    setTimeout(() => {
      router.push("/groups")
    }, 2000)
  }

  const handleCancel = () => {
    setStep("preferences")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Utensils className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">밥친구</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/groups" className="text-gray-600 hover:text-orange-600 transition-colors">
                그룹 찾기
              </Link>
              <Link href="/my-groups" className="text-gray-600 hover:text-orange-600 transition-colors">
                내 그룹
              </Link>
              <Button variant="outline" size="sm">
                로그인
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link href="/groups" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6">
          <ArrowLeft className="h-4 w-4" />
          그룹 찾기로 돌아가기
        </Link>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Zap className="h-8 w-8 text-orange-600" />
            빠른 매칭
          </h2>
          <p className="text-gray-600">간단한 정보만 입력하면 즉시 매칭을 시작합니다</p>
        </div>

        {step === "preferences" ? (
          <Card className="border-orange-100">
            <CardHeader>
              <CardTitle>매칭 조건 설정</CardTitle>
              <CardDescription>원하는 식사 조건을 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStartMatching} className="space-y-6">
                {/* Menu */}
                <div className="space-y-2">
                  <Label htmlFor="menu">메뉴 *</Label>
                  <Input
                    id="menu"
                    placeholder="예: 삼겹살, 치킨, 피자..."
                    value={preferences.menu}
                    onChange={(e) => setPreferences((prev) => ({ ...prev, menu: e.target.value }))}
                    required
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["삼겹살", "치킨", "피자", "라면", "초밥", "햄버거"].map((menu) => (
                      <Button
                        key={menu}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPreferences((prev) => ({ ...prev, menu }))}
                        className="text-xs bg-transparent"
                      >
                        {menu}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">위치 *</Label>
                  <Input
                    id="location"
                    placeholder="예: 강남역, 홍대입구..."
                    value={preferences.location}
                    onChange={(e) => setPreferences((prev) => ({ ...prev, location: e.target.value }))}
                    required
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["강남역", "홍대입구", "신촌", "건대입구", "압구정", "이태원"].map((location) => (
                      <Button
                        key={location}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPreferences((prev) => ({ ...prev, location }))}
                        className="text-xs bg-transparent"
                      >
                        {location}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <Label htmlFor="time">시간 *</Label>
                  <Select
                    value={preferences.time}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, time: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="언제 만나실 예정인가요?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="지금 바로">지금 바로</SelectItem>
                      <SelectItem value="30분 후">30분 후</SelectItem>
                      <SelectItem value="1시간 후">1시간 후</SelectItem>
                      <SelectItem value="2시간 후">2시간 후</SelectItem>
                      <SelectItem value="오늘 점심">오늘 점심</SelectItem>
                      <SelectItem value="오늘 저녁">오늘 저녁</SelectItem>
                      <SelectItem value="내일 점심">내일 점심</SelectItem>
                      <SelectItem value="내일 저녁">내일 저녁</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Max Members */}
                <div className="space-y-2">
                  <Label htmlFor="maxMembers">희망 인원</Label>
                  <Select
                    value={preferences.maxMembers.toString()}
                    onValueChange={(value) =>
                      setPreferences((prev) => ({ ...prev, maxMembers: Number.parseInt(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2명 (1:1)</SelectItem>
                      <SelectItem value="3">3명 (소규모)</SelectItem>
                      <SelectItem value="4">4명 (그룹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6">
                  <Zap className="h-5 w-5 mr-2" />
                  빠른 매칭 시작하기
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <QuickMatch preferences={preferences} onMatchFound={handleMatchFound} onCancel={handleCancel} />
        )}
      </div>
    </div>
  )
}
