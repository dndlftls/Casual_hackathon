"use client";

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Users, Clock, Utensils, Plus, Calendar, Settings } from "lucide-react"
import Link from "next/link"
import LoginRequired from "@/components/auth/LoginRequired"

interface MyGroup {
  id: number
  menu: string
  time: string
  location: string
  currentMembers: number
  maxMembers: number
  status: "upcoming" | "completed" | "created"
  role: "member" | "creator"
}

export default function MyGroupsPage() {
  const [tokenChecked, setTokenChecked] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [myJoined, setMyJoined] = useState<any[]>([])
  const [myCreated, setMyCreated] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    setToken(t)
    setTokenChecked(true)
    if (!t) return
    ;(async () => {
      try {
        setIsLoading(true)
        setError(null)
        const headers = { 'Authorization': `Bearer ${t}` }
        const [joinedRes, createdRes] = await Promise.all([
          fetch('/api/groups/my-groups', { headers }),
          fetch('/api/groups/my-created', { headers }),
        ])
        if (!joinedRes.ok || !createdRes.ok) {
          const j = await joinedRes.json().catch(() => ({}))
          const c = await createdRes.json().catch(() => ({}))
          throw new Error(j.error || c.error || '그룹 조회 중 오류가 발생했습니다.')
        }
        const joined = await joinedRes.json()
        const created = await createdRes.json()
        setMyJoined(joined.groups || [])
        setMyCreated(created.groups || [])
      } catch (e:any) {
        setError(e.message || '오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  if (tokenChecked && !token) {
    return <LoginRequired />
  }

  const normalize = (g:any, role:'member'|'creator') => ({
    id: g.id,
    menu: g.menu,
    time: g.meeting_time,
    location: g.location,
    currentMembers: g.current_members,
    maxMembers: g.max_members,
    status: 'upcoming' as const,
    role,
  })

  const upcomingGroups: MyGroup[] = [
    ...(myJoined || []).map((g:any) => normalize(g,'member')),
    ...(myCreated || []).map((g:any) => normalize(g,'creator')),
  ]
  const createdGroups: MyGroup[] = (myCreated || []).map((g:any) => normalize(g,'creator'))
  const completedGroups: MyGroup[] = []

  const GroupCard = ({ group }: { group: MyGroup }) => (
    <Card className="hover:shadow-lg transition-shadow border-orange-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-900">{group.menu}</CardTitle>
          <div className="flex items-center gap-2">
            {group.role === "creator" && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                그룹장
              </Badge>
            )}
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {group.currentMembers}/{group.maxMembers}명
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-600">
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {group.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {group.location}
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {group.status === "upcoming" && <Badge className="bg-green-100 text-green-700">예정</Badge>}
            {group.status === "completed" && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                완료
              </Badge>
            )}
            {group.status === "created" && <Badge className="bg-orange-100 text-orange-700">모집중</Badge>}
          </div>
          <div className="flex gap-2">
            <Link href={`/groups/${group.id}`}>
              <Button variant="outline" size="sm">
                자세히 보기
              </Button>
            </Link>
            {group.role === "creator" && group.status !== "completed" && (
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      {/* 헤더가 삭제되고, 페이지 컨텐츠만 남습니다. */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">내 그룹</h2>
            <p className="text-gray-600">참여하고 있는 그룹과 내가 만든 그룹을 관리하세요</p>
          </div>
          <Link href="/groups/create">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />새 그룹 만들기
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-orange-100">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              예정된 모임 ({upcomingGroups.length})
            </TabsTrigger>
            <TabsTrigger value="created" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              내가 만든 그룹 ({createdGroups.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              완료된 모임 ({completedGroups.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">불러오는 중...</div>
            ) : upcomingGroups.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingGroups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">예정된 모임이 없습니다</h3>
                <p className="text-gray-500 mb-6">새로운 그룹을 찾아보거나 직접 만들어보세요</p>
                <div className="flex gap-4 justify-center">
                  <Link href="/groups">
                    <Button variant="outline">그룹 찾기</Button>
                  </Link>
                  <Link href="/groups/create">
                    <Button className="bg-orange-600 hover:bg-orange-700">그룹 만들기</Button>
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="created" className="space-y-4">
            {createdGroups.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdGroups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">만든 그룹이 없습니다</h3>
                <p className="text-gray-500 mb-6">첫 번째 그룹을 만들어 사람들을 모집해보세요</p>
                <Link href="/groups/create">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    그룹 만들기
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedGroups.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedGroups.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">완료된 모임이 없습니다</h3>
                <p className="text-gray-500">아직 참여한 모임이 없어요</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
