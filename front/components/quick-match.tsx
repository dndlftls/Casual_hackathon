"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Zap, Users, MapPin, Clock, CheckCircle, X } from "lucide-react"

interface QuickMatchProps {
  preferences: {
    menu: string
    location: string
    time: string
    maxMembers: number
  }
  onMatchFound: (match: any) => void
  onCancel: () => void
}

interface MatchCandidate {
  id: number
  name: string
  menu: string
  location: string
  time: string
  distance: string
  compatibility: number
  avatar?: string
}

export default function QuickMatch({ preferences, onMatchFound, onCancel }: QuickMatchProps) {
  const [isSearching, setIsSearching] = useState(true)
  const [progress, setProgress] = useState(0)
  const [matches, setMatches] = useState<MatchCandidate[]>([])
  const [currentStep, setCurrentStep] = useState("searching")

  // Mock matching candidates
  const mockCandidates: MatchCandidate[] = [
    {
      id: 1,
      name: "김철수",
      menu: preferences.menu,
      location: "강남역",
      time: preferences.time,
      distance: "0.3km",
      compatibility: 95,
    },
    {
      id: 2,
      name: "이영희",
      menu: preferences.menu,
      location: "역삼역",
      time: preferences.time,
      distance: "0.8km",
      compatibility: 87,
    },
    {
      id: 3,
      name: "박민수",
      menu: preferences.menu,
      location: "선릉역",
      time: preferences.time,
      distance: "1.2km",
      compatibility: 82,
    },
  ]

  useEffect(() => {
    const searchTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsSearching(false)
          setCurrentStep("matches")
          setMatches(mockCandidates.slice(0, Math.floor(Math.random() * 3) + 1))
          clearInterval(searchTimer)
          return 100
        }
        return prev + 10
      })
    }, 200)

    return () => clearInterval(searchTimer)
  }, [])

  const handleAcceptMatch = (match: MatchCandidate) => {
    setCurrentStep("matched")
    onMatchFound(match)
  }

  const handleDeclineMatch = (matchId: number) => {
    setMatches((prev) => prev.filter((match) => match.id !== matchId))
    if (matches.length <= 1) {
      setCurrentStep("no-matches")
    }
  }

  if (currentStep === "searching") {
    return (
      <Card className="border-orange-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            빠른 매칭 중...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="animate-pulse bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-gray-600 mb-4">{preferences.menu}을(를) 함께 드실 분을 찾고 있습니다...</p>
            <Progress value={progress} className="w-full mb-2" />
            <p className="text-sm text-gray-500">{progress}% 완료</p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{preferences.location} 근처에서 검색</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{preferences.time}에 만날 사람 찾는 중</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>최대 {preferences.maxMembers}명 그룹</span>
            </div>
          </div>

          <Button onClick={onCancel} variant="outline" className="w-full bg-transparent">
            매칭 취소
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === "matches") {
    return (
      <Card className="border-orange-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            매칭 결과 ({matches.length}명)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center mb-4">
            조건에 맞는 사람들을 찾았습니다! 함께 식사하고 싶은 분을 선택해주세요.
          </p>

          {matches.map((match) => (
            <Card key={match.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-orange-100 text-orange-700">{match.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{match.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {match.location} ({match.distance})
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {match.compatibility}% 일치
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Clock className="h-3 w-3" />
                  <span>
                    {match.time}에 {match.menu} 예정
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAcceptMatch(match)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                    size="sm"
                  >
                    함께 식사하기
                  </Button>
                  <Button
                    onClick={() => handleDeclineMatch(match.id)}
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button onClick={onCancel} variant="outline" className="w-full bg-transparent">
            다시 검색하기
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === "matched") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">매칭 성공!</h3>
          <p className="text-green-700 mb-4">곧 그룹 채팅방으로 이동합니다.</p>
          <Button className="bg-green-600 hover:bg-green-700">채팅방 입장</Button>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === "no-matches") {
    return (
      <Card className="border-orange-100">
        <CardContent className="p-6 text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">매칭된 사람이 없습니다</h3>
          <p className="text-gray-500 mb-4">조건을 조정하거나 직접 그룹을 만들어보세요.</p>
          <div className="flex gap-2">
            <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
              다시 시도
            </Button>
            <Button className="flex-1 bg-orange-600 hover:bg-orange-700">그룹 만들기</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
