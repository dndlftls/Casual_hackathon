"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { MapPin, Users, Clock, Utensils, MessageCircle, UserPlus, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import NaverMap from "@/components/naver-map"

interface ChatMessage {
  id: number
  group_id: number
  user_id: number
  nickname: string
  message: string
  created_at: string
}

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [hasJoined, setHasJoined] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [group, setGroup] = useState<any>(null)
  const [groupLoading, setGroupLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const groupId = Number.parseInt(params.id as string)

  // 백엔드 API에서 그룹 데이터 가져오기
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setGroupLoading(true)
        const response = await fetch(`/api/groups/${groupId}`)
        if (response.ok) {
          const data = await response.json()
          setGroup(data.group)
        } else {
          console.error('그룹 데이터를 가져오는 중 오류가 발생했습니다')
          setGroup(null)
        }
      } catch (error) {
        console.error('그룹 데이터를 가져오는 중 오류가 발생했습니다:', error)
        setGroup(null)
      } finally {
        setGroupLoading(false)
      }
    }

    fetchGroup()
  }, [groupId])

  // 채팅 메시지 가져오기
  const fetchMessages = async () => {
    if (!hasJoined) return
    
    try {
      setIsLoading(true)
      const response = await fetch(`/api/groups/${groupId}/messages?limit=50&offset=0`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('babchingu_token') || ''}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('메시지 가져오기 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 메시지 전송
  const sendMessage = async () => {
    if (!newMessage.trim() || !hasJoined) return

    try {
      const response = await fetch(`/api/groups/${groupId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('babchingu_token') || ''}`
        },
        body: JSON.stringify({ message: newMessage })
      })

      if (response.ok) {
        setNewMessage("")
        fetchMessages() // 메시지 목록 새로고침
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error)
    }
  }

  // 메시지 목록 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (hasJoined) {
      fetchMessages()
    }
  }, [hasJoined, groupId])

  const handleJoinGroup = () => {
    if (group && group.current_members < group.max_members) {
      setHasJoined(true)
      // Here you would typically make an API call to join the group
    }
  }

  const handleLeaveGroup = () => {
    setHasJoined(false)
    setMessages([])
    // Here you would typically make an API call to leave the group
  }

  // 로딩 중이면 로딩 표시
  if (groupLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-500">그룹 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 그룹이 없으면 에러 메시지 표시
  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">그룹을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-6">요청하신 그룹이 존재하지 않거나 삭제되었습니다.</p>
          <Link href="/groups">
            <Button className="bg-orange-600 hover:bg-orange-700">
              그룹 목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
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
                        {group.meeting_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {group.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {group.current_members}/{group.max_members}명
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {group.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{group.description || "설명이 없습니다."}</p>
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
                <div className="text-sm text-gray-500">
                  {group.creator_nickname}님이 {group.created_at}에 만든 그룹
                </div>
              </CardContent>
            </Card>

            {/* Members */}
            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  참여 멤버 ({group.current_members}/{group.max_members})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.members && group.members.length > 0 ? group.members.map((member: any, index: number) => (
                    <div key={member.id}>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-orange-100 text-orange-700">{member.nickname[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{member.nickname}</span>
                            {index === 0 && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                                그룹장
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{member.joined_at}에 참여</div>
                        </div>
                      </div>
                      {index < group.members.length - 1 && <Separator className="mt-3" />}
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 py-4">
                      <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm">아직 참여한 멤버가 없습니다</p>
                    </div>
                  )}

                  {/* Empty slots */}
                  {Array.from({ length: group.max_members - group.current_members }).map((_, index) => (
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
            {/* Chat */}
            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  그룹 채팅
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasJoined ? (
                  <div className="space-y-4">
                    {/* 메시지 목록 */}
                    <div className="h-64 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                      {isLoading ? (
                        <div className="text-center text-gray-500 py-4">메시지를 불러오는 중...</div>
                      ) : messages.length > 0 ? (
                        <div className="space-y-3">
                          {messages.map((message) => (
                            <div key={message.id} className="flex items-start gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-orange-100 text-orange-700">
                                  {message.nickname[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-medium text-gray-700">{message.nickname}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(message.created_at).toLocaleTimeString('ko-KR', { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-800 bg-white p-2 rounded-lg shadow-sm">
                                  {message.message}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm">아직 메시지가 없습니다</p>
                          <p className="text-xs">첫 번째 메시지를 보내보세요!</p>
                        </div>
                      )}
                    </div>

                    {/* 메시지 입력 */}
                    <div className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            sendMessage()
                          }
                        }}
                        className="flex-1"
                      />
                      <Button 
                        onClick={sendMessage} 
                        size="sm" 
                        className="bg-orange-600 hover:bg-orange-700"
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* 그룹 나가기 버튼 */}
                    <Button onClick={handleLeaveGroup} variant="outline" className="w-full bg-transparent">
                      그룹 나가기
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center text-gray-500 py-8">
                      <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm">그룹에 참여하면</p>
                      <p className="text-sm">채팅을 이용할 수 있습니다</p>
                    </div>
                    
                    {/* 그룹 참여하기 버튼 */}
                    <Button
                      onClick={handleJoinGroup}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      disabled={group.current_members >= group.max_members}
                    >
                      {group.current_members >= group.max_members ? "인원 마감" : "그룹 참여하기"}
                    </Button>
                  </div>
                )}
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
