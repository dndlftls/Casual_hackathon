"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MapPin, Users, Clock, Utensils, MessageCircle, UserPlus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import NaverMap from "@/components/naver-map"
import { groupsStore, MealGroup, Member } from "@/lib/groups-store"

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [hasJoined, setHasJoined] = useState(false)

  // 실제 그룹 데이터 가져오기
  const groupId = Number.parseInt(params.id as string)
  const groupData = groupsStore.getGroupById(groupId)
  
  // 그룹이 없으면 기본값 사용
  const group: MealGroup = groupData || {
    id: groupId,
    menu: "삼겹살",
    time: "오늘 7:00 PM",
    location: "강남역 2번 출구 앞",
    distance: "0.5km",
    currentMembers: 2,
    maxMembers: 4,
    tags: ["고기", "회식", "저녁"],
    description: "퇴근 후 삼겹살 한 판 어떠세요? 맛있는 집 알고 있어서 같이 가실 분들 모집합니다!",
    createdBy: "김철수",
    createdAt: "2024-01-15",
    members: [
      { id: 1, name: "김철수", joinedAt: "2024-01-15" },
      { id: 2, name: "이영희", joinedAt: "2024-01-16" },
    ],
    lat: 37.498095,
    lng: 127.02761,
    mealType: "저녁",
    priceRange: "2-3만원",
  }

  const handleJoinGroup = () => {
    if (group.currentMembers < group.maxMembers) {
      setHasJoined(true)
      // Here you would typically make an API call to join the group
    }
  }

  const handleLeaveGroup = () => {
    setHasJoined(false)
    // Here you would typically make an API call to leave the group
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link href="/groups" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6">
          <ArrowLeft className="h-4 w-4" />
          그룹 목록으로 돌아가기
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Group Info */}
            <Card className="border-orange-100">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-gray-900 mb-2">{group.menu}</CardTitle>
                    <div className="flex items-center gap-4 text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {group.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {group.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {group.currentMembers}/{group.maxMembers}명
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {group.distance}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{group.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  {group.createdBy}님이 {group.createdAt}에 만든 그룹
                </div>
              </CardContent>
            </Card>

            {/* Members */}
            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  참여 멤버 ({group.currentMembers}/{group.maxMembers})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(group.members || []).map((member, index) => (
                    <div key={member.id}>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-orange-100 text-orange-700">{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.name}</span>
                            {index === 0 && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                그룹장
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{member.joinedAt}에 참여</div>
                        </div>
                      </div>
                      {index < (group.members || []).length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}

                  {/* Empty slots */}
                  {Array.from({ length: group.maxMembers - group.currentMembers }).map((_, index) => (
                    <div key={`empty-${index}`}>
                      <Separator />
                      <div className="flex items-center gap-3 pt-3">
                        <Avatar>
                          <AvatarFallback className="bg-gray-100 text-gray-400">
                            <UserPlus className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-gray-400">빈 자리</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join/Leave Button */}
            <Card className="border-orange-100">
              <CardContent className="pt-6">
                {!hasJoined ? (
                  <Button
                    onClick={handleJoinGroup}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={group.currentMembers >= group.maxMembers}
                  >
                    {group.currentMembers >= group.maxMembers ? "인원 마감" : "그룹 참여하기"}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center text-green-600 font-medium">참여 완료!</div>
                    <Button onClick={handleLeaveGroup} variant="outline" className="w-full bg-transparent">
                      그룹 나가기
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  그룹 채팅
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  {hasJoined ? (
                    <div>
                      <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p>그룹 채팅이 곧 시작됩니다</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm">그룹에 참여하면</p>
                      <p className="text-sm">채팅을 이용할 수 있습니다</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  위치 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">{group.location}</div>
                  <div className="text-sm text-gray-600">내 위치에서 {group.distance}</div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3 bg-transparent"
                    onClick={() => {
                      // 네이버 지도에서 해당 위치 검색
                      const searchQuery = encodeURIComponent(group.location);
                      window.open(`https://map.naver.com/v5/search/${searchQuery}`, '_blank');
                    }}
                  >
                    지도에서 보기
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}
