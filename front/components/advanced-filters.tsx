"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, X } from "lucide-react"

interface FilterOptions {
  distance: number[]
  timeRange: string
  priceRange: string
  groupSize: string
  mealType: string[]
  tags: string[]
}

interface AdvancedFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onReset: () => void
}

export default function AdvancedFilters({ filters, onFiltersChange, onReset }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const mealTypes = [
    { id: "korean", label: "한식" },
    { id: "chinese", label: "중식" },
    { id: "japanese", label: "일식" },
    { id: "western", label: "양식" },
    { id: "fast-food", label: "패스트푸드" },
    { id: "cafe", label: "카페" },
  ]

  const popularTags = [
    "회식",
    "점심",
    "저녁",
    "간단",
    "고급",
    "맥주",
    "고기",
    "채식",
    "매운맛",
    "달콤",
    "건강",
    "분위기",
  ]

  const updateFilters = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const toggleMealType = (mealType: string) => {
    const newMealTypes = filters.mealType.includes(mealType)
      ? filters.mealType.filter((type) => type !== mealType)
      : [...filters.mealType, mealType]
    updateFilters("mealType", newMealTypes)
  }

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag) ? filters.tags.filter((t) => t !== tag) : [...filters.tags, tag]
    updateFilters("tags", newTags)
  }

  const hasActiveFilters =
    filters.distance[0] !== 5 ||
    filters.timeRange !== "all" ||
    filters.priceRange !== "all" ||
    filters.groupSize !== "all" ||
    filters.mealType.length > 0 ||
    filters.tags.length > 0

  return (
    <Card className="border-orange-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            고급 필터
            {hasActiveFilters && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 ml-2">
                적용됨
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button onClick={onReset} variant="ghost" size="sm" className="text-gray-500">
                <X className="h-4 w-4 mr-1" />
                초기화
              </Button>
            )}
            <Button onClick={() => setIsExpanded(!isExpanded)} variant="ghost" size="sm" className="text-orange-600">
              {isExpanded ? "접기" : "펼치기"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Distance Range */}
          <div className="space-y-3">
            <Label>거리 범위: {filters.distance[0]}km 이내</Label>
            <Slider
              value={filters.distance}
              onValueChange={(value) => updateFilters("distance", value)}
              max={10}
              min={0.5}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.5km</span>
              <span>10km</span>
            </div>
          </div>

          {/* Time Range */}
          <div className="space-y-2">
            <Label>시간대</Label>
            <Select value={filters.timeRange} onValueChange={(value) => updateFilters("timeRange", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 시간</SelectItem>
                <SelectItem value="morning">아침 (6-11시)</SelectItem>
                <SelectItem value="lunch">점심 (11-15시)</SelectItem>
                <SelectItem value="afternoon">오후 (15-18시)</SelectItem>
                <SelectItem value="dinner">저녁 (18-22시)</SelectItem>
                <SelectItem value="late">늦은 시간 (22시 이후)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label>가격대</Label>
            <Select value={filters.priceRange} onValueChange={(value) => updateFilters("priceRange", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 가격</SelectItem>
                <SelectItem value="budget">저렴 (1만원 이하)</SelectItem>
                <SelectItem value="moderate">보통 (1-3만원)</SelectItem>
                <SelectItem value="expensive">고급 (3만원 이상)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Group Size */}
          <div className="space-y-2">
            <Label>그룹 크기</Label>
            <Select value={filters.groupSize} onValueChange={(value) => updateFilters("groupSize", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 크기</SelectItem>
                <SelectItem value="small">소규모 (2명)</SelectItem>
                <SelectItem value="medium">중간 (3명)</SelectItem>
                <SelectItem value="large">대규모 (4명)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Meal Types */}
          <div className="space-y-3">
            <Label>음식 종류</Label>
            <div className="grid grid-cols-2 gap-2">
              {mealTypes.map((mealType) => (
                <div key={mealType.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={mealType.id}
                    checked={filters.mealType.includes(mealType.id)}
                    onCheckedChange={() => toggleMealType(mealType.id)}
                  />
                  <Label htmlFor={mealType.id} className="text-sm font-normal">
                    {mealType.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>태그</Label>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Button
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className={
                    filters.tags.includes(tag)
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-transparent text-gray-600 hover:text-orange-600"
                  }
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <Label>적용된 필터</Label>
              <div className="flex flex-wrap gap-2">
                {filters.distance[0] !== 5 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {filters.distance[0]}km 이내
                  </Badge>
                )}
                {filters.timeRange !== "all" && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {filters.timeRange}
                  </Badge>
                )}
                {filters.priceRange !== "all" && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {filters.priceRange}
                  </Badge>
                )}
                {filters.groupSize !== "all" && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    {filters.groupSize}
                  </Badge>
                )}
                {filters.mealType.map((type) => (
                  <Badge key={type} variant="secondary" className="bg-orange-100 text-orange-700">
                    {mealTypes.find((mt) => mt.id === type)?.label}
                  </Badge>
                ))}
                {filters.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-orange-100 text-orange-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
