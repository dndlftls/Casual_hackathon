"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Clock, Utensils, Plus, Search, Zap } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext" // 1. useAuth 훅 import

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"create" | "join">("join")
  const { user } = useAuth(); // 2. useAuth 훅을 호출하여 user 정보 가져오기

  // 임시 그룹 데이터 (향후 실제 데이터로 교체)
  const featuredGroups = [
    { id: 1, menu: "삼겹살", time: "오늘 7:00 PM", location: "강남역", distance: "0.5km", currentMembers: 2, maxMembers: 4, tags: ["고기", "회식"] },
    { id: 2, menu: "치킨", time: "오늘 8:30 PM", location: "홍대입구", distance: "1.2km", currentMembers: 1, maxMembers: 3, tags: ["치킨", "맥주"] },
    { id: 3, menu: "라면", time: "내일 12:00 PM", location: "신촌", distance: "2.1km", currentMembers: 3, maxMembers: 4, tags: ["점심", "간단"] },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">밥친구</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/groups" className="text-gray-600 hover:text-orange-600 transition-colors">
                그룹 찾기
              </Link>
              <Link href="/my-groups" className="text-gray-600 hover:text-orange-600 transition-colors">
                내 그룹
              </Link>
              
              {/* 3. 로그인 상태에 따라 UI를 변경하는 핵심 로직 */}
              {user ? (
                // 로그인 상태일 때
                 <span className="font-semibold text-gray-800">{user.nickname}님</span>
              ) : (
                // 로그아웃 상태일 때
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    로그인
                  </Button>
                </Link>
              )}

            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            혼자 먹기 아쉬운 그 메뉴,
            <br />
            <span className="text-orange-600">함께 먹어요!</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 text-pretty max-w-2xl mx-auto">
            같은 시간, 같은 메뉴를 원하는 근처 사람들과 1-4명 소규모로 빠르게 매칭되어 더 맛있고 즐거운 식사를
            경험하세요.
          </p>

          {/* Action Tabs */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-orange-100">
              <button
                onClick={() => setActiveTab("join")}
                className={`flex-1 py-3 px-6 rounded-md font-medium transition-all ${
                  activeTab === "join" ? "bg-orange-600 text-white shadow-sm" : "text-gray-600 hover:text-orange-600"
                }`}
              >
                <Search className="h-4 w-4 inline mr-2" />
                그룹 찾기
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`flex-1 py-3 px-6 rounded-md font-medium transition-all ${
                  activeTab === "create" ? "bg-orange-600 text-white shadow-sm" : "text-gray-600 hover:text-orange-600"
                }`}
              >
                <Plus className="h-4 w-4 inline mr-2" />
                그룹 만들기
              </button>
            </div>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/quick-match">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                <Zap className="h-4 w-4 mr-2" />
                빠른 매칭
              </Button>
            </Link>
            <Link href={activeTab === "join" ? "/groups" : "/groups/create"}>
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                {activeTab === "join" ? "그룹 찾아보기" : "새 그룹 만들기"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Groups */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">지금 모집 중인 그룹</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {featuredGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow border-orange-100">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-gray-900">{group.menu}</CardTitle>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {group.currentMembers}/{group.maxMembers}명
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-600">
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {group.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {group.location} ({group.distance})
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {group.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">참여하기</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">지도에서 그룹 위치 확인</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              현재 모집 중인 그룹들의 위치를 지도에서 한눈에 확인해보세요
            </p>
          </div>
          {/* NaverMap 컴포넌트가 준비될 때까지 임시 UI */}
          <div className="max-w-6xl mx-auto h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">지도 표시 영역</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">왜 밥친구를 선택해야 할까요?</h3>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {/* Features 내용 생략 */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          {/* Footer 내용 생략 */}
        </div>
      </footer>
    </div>
  )
}