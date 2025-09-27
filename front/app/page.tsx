"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Clock, Utensils, Plus, Search, Zap } from "lucide-react"
import Link from "next/link"
import NotificationCenter from "@/components/notification-center"
import NaverMap from "@/components/naver-map"
import { groupsStore } from "@/lib/groups-store"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"create" | "join">("join")

  // 실제 그룹 데이터 가져오기
  const featuredGroups = groupsStore.getAllGroups()

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
              <NotificationCenter />
              <Button variant="outline" size="sm">
                로그인
              </Button>
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
          <div className="max-w-6xl mx-auto">
            <NaverMap 
              groups={featuredGroups} 
              center={{ lat: 37.5665, lng: 126.978 }} 
              zoom={11} 
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">왜 밥친구를 선택해야 할까요?</h3>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">빠른 매칭</h4>
              <p className="text-gray-600">AI 기반 실시간 매칭으로 몇 초 만에 최적의 파트너를 찾아드려요.</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">위치 기반 매칭</h4>
              <p className="text-gray-600">내 주변 가까운 거리의 사람들과 매칭되어 편리하게 만날 수 있어요.</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">소규모 그룹</h4>
              <p className="text-gray-600">1-4명의 소규모 그룹으로 부담 없이 새로운 사람들과 만날 수 있어요.</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-900">실시간 알림</h4>
              <p className="text-gray-600">새로운 매칭과 그룹 활동을 실시간으로 알려드려 놓치지 않아요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Utensils className="h-6 w-6 text-orange-400" />
            <h5 className="text-xl font-bold">밥친구</h5>
          </div>
          <p className="text-gray-400 mb-6">혼자 먹기 아쉬운 그 메뉴, 함께 먹어요!</p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <Link href="#" className="hover:text-orange-400 transition-colors">
              이용약관
            </Link>
            <Link href="#" className="hover:text-orange-400 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="#" className="hover:text-orange-400 transition-colors">
              고객센터
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
