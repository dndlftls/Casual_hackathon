"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Utensils, Plus, X, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import LocationSearchModal from "@/components/location-search-modal"
import { groupsStore } from "@/lib/groups-store"

export default function CreateGroupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    menu: "",
    date: "",
    time: "",
    location: "",
    maxMembers: "2",
    description: "",
    tags: [] as string[],
    lat: 0,
    lng: 0,
  })
  const [newTag, setNewTag] = useState("")
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const popularMenus = ["삼겹살", "치킨", "피자", "라면", "초밥", "햄버거", "파스타", "중국집"]
  const popularTags = ["회식", "점심", "저녁", "간단", "고급", "맥주", "고기", "일식", "중식", "양식"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    
    try {
      // 그룹 데이터 준비
      const groupData = {
        menu: formData.menu,
        time: `${formData.date} ${formData.time}`,
        location: formData.location,
        distance: "0.5km", // 실제로는 현재 위치와의 거리 계산
        maxMembers: Number.parseInt(formData.maxMembers),
        tags: formData.tags,
        description: formData.description,
        createdBy: "현재 사용자", // 실제로는 로그인한 사용자 정보
        mealType: formData.tags.includes("점심") ? "점심" : "저녁",
        priceRange: "1-3만원", // 실제로는 메뉴에 따라 계산
        lat: formData.lat,
        lng: formData.lng,
      }
      
      // 그룹 생성
      const newGroup = groupsStore.addGroup(groupData)
      
      console.log("그룹이 성공적으로 생성되었습니다:", newGroup)
      
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 성공 메시지 표시
      alert(`"${newGroup.menu}" 그룹이 성공적으로 생성되었습니다!`)
      
      // 성공 시 그룹 목록으로 이동
      router.push("/groups")
    } catch (error) {
      console.error("그룹 생성 중 오류가 발생했습니다:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
    }
    setNewTag("")
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setFormData((prev) => ({
      ...prev,
      location: location.address,
      lat: location.lat,
      lng: location.lng,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">새 그룹 만들기</h2>
          <p className="text-gray-600">함께 식사할 사람들을 모집해보세요</p>
        </div>

        <Card className="border-orange-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              그룹 정보
            </CardTitle>
            <CardDescription>그룹에 대한 기본 정보를 입력해주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Menu Selection */}
              <div className="space-y-2">
                <Label htmlFor="menu">메뉴 *</Label>
                <Input
                  id="menu"
                  placeholder="어떤 메뉴를 드실 예정인가요?"
                  value={formData.menu}
                  onChange={(e) => setFormData((prev) => ({ ...prev, menu: e.target.value }))}
                  required
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {popularMenus.map((menu) => (
                    <Button
                      key={menu}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData((prev) => ({ ...prev, menu }))}
                      className="text-xs"
                    >
                      {menu}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">날짜 *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">시간 *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">만날 장소 *</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="예: 강남역 2번 출구"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    required
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="bg-transparent"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    장소 선택
                  </Button>
                </div>
                {formData.location && (
                  <div className="text-sm text-gray-600">
                    선택된 위치: {formData.location}
                  </div>
                )}
              </div>

              {/* Max Members */}
              <div className="space-y-2">
                <Label htmlFor="maxMembers">최대 인원 *</Label>
                <Select
                  value={formData.maxMembers}
                  onValueChange={(value: string) => setFormData((prev) => ({ ...prev, maxMembers: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2명</SelectItem>
                    <SelectItem value="3">3명</SelectItem>
                    <SelectItem value="4">4명</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  placeholder="그룹에 대한 간단한 설명을 적어주세요"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>태그</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="태그 추가"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag(newTag))}
                  />
                  <Button type="button" onClick={() => addTag(newTag)} variant="outline">
                    추가
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {popularTags.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addTag(tag)}
                      className="text-xs"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-orange-100 text-orange-700">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-orange-900">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  disabled={isCreating || !formData.location}
                >
                  {isCreating ? "그룹 생성 중..." : "그룹 만들기"}
                </Button>
                <Link href="/groups" className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    취소
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Location Search Modal */}
      <LocationSearchModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelect={handleLocationSelect}
        currentLocation={formData.location}
      />
    </div>
  )
}
