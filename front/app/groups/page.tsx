"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Utensils, Plus, Search, Map } from "lucide-react"
import Link from "next/link"
import LocationPicker from "@/components/location-picker"
import AdvancedFilters from "@/components/advanced-filters"

interface MealGroup {
  id: number
  menu: string
  time: string
  location: string
  distance: string
  currentMembers: number
  maxMembers: number
  tags: string[]
  description?: string
  createdBy: string
  mealType: string
  priceRange: string
  lat: number
  lng: number
}

interface FilterOptions {
  distance: number[]
  timeRange: string
  priceRange: string
  groupSize: string
  mealType: string[]
  tags: string[]
}

export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMenu, setSelectedMenu] = useState("all")
  const [selectedDistance, setSelectedDistance] = useState("all")
  const [selectedMembers, setSelectedMembers] = useState("all")
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [userLocation, setUserLocation] = useState<string>("")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
    distance: [5],
    timeRange: "all",
    priceRange: "all",
    groupSize: "all",
    mealType: [],
    tags: [],
  })

  const [groups] = useState<MealGroup[]>([
    {
      id: 1,
      menu: "삼겹살",
      time: "오늘 7:00 PM",
      location: "강남역",
      distance: "0.5km",
      currentMembers: 2,
      maxMembers: 4,
      tags: ["고기", "회식"],
      description: "퇴근 후 삼겹살 한 판 어떠세요?",
      createdBy: "김철수",
      mealType: "korean",
      priceRange: "moderate",
      lat: 37.498095,
      lng: 127.02761,
    },
    {
      id: 2,
      menu: "치킨",
      time: "오늘 8:30 PM",
      location: "홍대입구",
      distance: "1.2km",
      currentMembers: 1,
      maxMembers: 3,
      tags: ["치킨", "맥주"],
      description: "치킨과 맥주로 하루 마무리!",
      createdBy: "이영희",
      mealType: "korean",
      priceRange: "budget",
      lat: 37.557527,
      lng: 126.925394,
    },
    {
      id: 3,
      menu: "라면",
      time: "내일 12:00 PM",
      location: "신촌",
      distance: "2.1km",
      currentMembers: 3,
      maxMembers: 4,
      tags: ["점심", "간단"],
      description: "점심시간 간단하게 라면 한 그릇",
      createdBy: "박민수",
      mealType: "korean",
      priceRange: "budget",
      lat: 37.555946,
      lng: 126.936893,
    },
    {
      id: 4,
      menu: "피자",
      time: "내일 6:00 PM",
      location: "건대입구",
      distance: "1.8km",
      currentMembers: 1,
      maxMembers: 4,
      tags: ["피자", "저녁"],
      description: "큰 피자 나눠먹을 사람들 모집!",
      createdBy: "정수진",
      mealType: "western",
      priceRange: "moderate",
      lat: 37.540467,
      lng: 127.069561,
    },
    {
      id: 5,
      menu: "초밥",
      time: "모레 7:30 PM",
      location: "압구정",
      distance: "3.2km",
      currentMembers: 2,
      maxMembers: 4,
      tags: ["일식", "고급"],
      description: "맛있는 초밥집 발견했어요",
      createdBy: "최동현",
      mealType: "japanese",
      priceRange: "expensive",
      lat: 37.527446,
      lng: 127.028521,
    },
  ])

  const filteredGroups = groups.filter((group) => {
    // Basic filters
    const matchesSearch =
      group.menu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMenu = selectedMenu === "all" || group.menu === selectedMenu
    const matchesDistance =
      selectedDistance === "all" ||
      (selectedDistance === "1km" && Number.parseFloat(group.distance) <= 1) ||
      (selectedDistance === "2km" && Number.parseFloat(group.distance) <= 2) ||
      (selectedDistance === "3km" && Number.parseFloat(group.distance) <= 3)
    const matchesMembers =
      selectedMembers === "all" ||
      (selectedMembers === "1-2" && group.maxMembers <= 2) ||
      (selectedMembers === "3-4" && group.maxMembers >= 3)

    // Advanced filters
    const matchesAdvancedDistance = Number.parseFloat(group.distance) <= advancedFilters.distance[0]
    const matchesPriceRange = advancedFilters.priceRange === "all" || group.priceRange === advancedFilters.priceRange
    const matchesGroupSize =
      advancedFilters.groupSize === "all" ||
      (advancedFilters.groupSize === "small" && group.maxMembers === 2) ||
      (advancedFilters.groupSize === "medium" && group.maxMembers === 3) ||
      (advancedFilters.groupSize === "large" && group.maxMembers === 4)
    const matchesMealType = advancedFilters.mealType.length === 0 || advancedFilters.mealType.includes(group.mealType)
    const matchesTags =
      advancedFilters.tags.length === 0 || advancedFilters.tags.some((tag) => group.tags.includes(tag))

    return (
      matchesSearch &&
      matchesMenu &&
      matchesDistance &&
      matchesMembers &&
      matchesAdvancedDistance &&
      matchesPriceRange &&
      matchesGroupSize &&
      matchesMealType &&
      matchesTags
    )
  })

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setUserLocation(location.address)
    setShowLocationPicker(false)
    // Here you would recalculate distances based on the new location
  }

  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      distance: [5],
      timeRange: "all",
      priceRange: "all",
      groupSize: "all",
      mealType: [],
      tags: [],
    })
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
              <Link href="/groups" className="text-orange-600 font-medium">
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

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">그룹 찾기</h2>
            <p className="text-gray-600">원하는 메뉴와 시간에 맞는 그룹을 찾아보세요</p>
            {userLocation && <p className="text-sm text-orange-600 mt-1">📍 {userLocation} 기준으로 검색 중</p>}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-orange-100">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-orange-600 hover:bg-orange-700" : ""}
              >
                목록
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("map")}
                className={viewMode === "map" ? "bg-orange-600 hover:bg-orange-700" : ""}
              >
                <Map className="h-4 w-4 mr-1" />
                지도
              </Button>
            </div>
            <Link href="/groups/create">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />새 그룹 만들기
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Location Picker */}
            <div className="space-y-4">
              <Button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                variant="outline"
                className="w-full bg-transparent"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {userLocation || "위치 설정"}
              </Button>
              {showLocationPicker && (
                <LocationPicker onLocationSelect={handleLocationSelect} currentLocation={userLocation} />
              )}
            </div>

            {/* Basic Search and Filters */}
            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  기본 검색
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="메뉴나 지역 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedMenu} onValueChange={setSelectedMenu}>
                  <SelectTrigger>
                    <SelectValue placeholder="메뉴 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 메뉴</SelectItem>
                    <SelectItem value="삼겹살">삼겹살</SelectItem>
                    <SelectItem value="치킨">치킨</SelectItem>
                    <SelectItem value="라면">라면</SelectItem>
                    <SelectItem value="피자">피자</SelectItem>
                    <SelectItem value="초밥">초밥</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedDistance} onValueChange={setSelectedDistance}>
                  <SelectTrigger>
                    <SelectValue placeholder="거리" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 거리</SelectItem>
                    <SelectItem value="1km">1km 이내</SelectItem>
                    <SelectItem value="2km">2km 이내</SelectItem>
                    <SelectItem value="3km">3km 이내</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedMembers} onValueChange={setSelectedMembers}>
                  <SelectTrigger>
                    <SelectValue placeholder="인원" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 인원</SelectItem>
                    <SelectItem value="1-2">1-2명</SelectItem>
                    <SelectItem value="3-4">3-4명</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Advanced Filters */}
            <AdvancedFilters
              filters={advancedFilters}
              onFiltersChange={setAdvancedFilters}
              onReset={resetAdvancedFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">총 {filteredGroups.length}개의 그룹을 찾았습니다</div>
              <Select defaultValue="distance">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">거리순</SelectItem>
                  <SelectItem value="time">시간순</SelectItem>
                  <SelectItem value="members">인원순</SelectItem>
                  <SelectItem value="recent">최신순</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Groups Grid/Map */}
            {viewMode === "list" ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredGroups.map((group) => (
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
                      {group.description && <p className="text-sm text-gray-600 mb-3">{group.description}</p>}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {group.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">by {group.createdBy}</span>
                        <Link href={`/groups/${group.id}`}>
                          <Button className="bg-orange-600 hover:bg-orange-700">자세히 보기</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-orange-100 h-96">
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Map className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">지도 뷰</p>
                    <p className="text-sm">지도에서 그룹 위치를 확인할 수 있습니다</p>
                    <p className="text-xs text-gray-400 mt-2">(실제 구현에서는 Google Maps 등을 사용)</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {filteredGroups.length === 0 && (
              <div className="text-center py-12">
                <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-500 mb-6">다른 검색 조건을 시도해보세요</p>
                <Link href="/groups/create">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />새 그룹 만들기
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
