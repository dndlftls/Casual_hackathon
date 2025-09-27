"use client";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Clock, Utensils, Plus, Search } from "lucide-react"
import Link from "next/link"

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 백엔드 API에서 그룹 데이터 가져오기
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups')
        if (response.ok) {
          const data = await response.json()
          setGroups(data.groups || [])
        } else {
          console.error('그룹 데이터를 가져오는 중 오류가 발생했습니다')
          setGroups([])
        }
      } catch (error) {
        console.error('그룹 데이터를 가져오는 중 오류가 발생했습니다:', error)
        setGroups([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroups()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">모든 그룹</h2>
          <Link href="/groups/create">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              새 그룹 만들기
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-500">그룹 목록을 불러오는 중...</p>
          </div>
        ) : groups.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow border-orange-100">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-gray-900">{group.menu}</CardTitle>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {group.current_members}/{group.max_members}명
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-600">
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {group.meeting_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {group.location}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {group.tags && group.tags.length > 0 ? group.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    )) : (
                      <Badge variant="outline" className="text-xs">
                        일반
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/groups/${group.id}`} className="flex-1">
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">자세히 보기</Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const searchQuery = encodeURIComponent(group.location);
                        window.open(`https://map.naver.com/v5/search/${searchQuery}`, '_blank');
                      }}
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">현재 모집 중인 그룹이 없습니다.</p>
            <Link href="/groups/create">
              <Button className="mt-4 bg-orange-600 hover:bg-orange-700">새 그룹 만들기</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}