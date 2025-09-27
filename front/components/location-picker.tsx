"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation, Search } from "lucide-react"

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void
  currentLocation?: string
}

export default function LocationPicker({ onLocationSelect, currentLocation }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const popularLocations = [
    { name: "강남역", address: "서울 강남구 강남대로 지하 396", lat: 37.498095, lng: 127.02761 },
    { name: "홍대입구", address: "서울 마포구 양화로 지하 188", lat: 37.557527, lng: 126.925394 },
    { name: "신촌역", address: "서울 서대문구 신촌로 지하 90", lat: 37.555946, lng: 126.936893 },
    { name: "건대입구", address: "서울 광진구 능동로 지하 110", lat: 37.540467, lng: 127.069561 },
    { name: "압구정", address: "서울 강남구 압구정로 지하 165", lat: 37.527446, lng: 127.028521 },
    { name: "이태원", address: "서울 용산구 이태원로 지하 195", lat: 37.534567, lng: 126.994734 },
  ]

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // In a real app, you would reverse geocode to get the address
          onLocationSelect({
            address: "현재 위치",
            lat: latitude,
            lng: longitude,
          })
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsGettingLocation(false)
        },
      )
    } else {
      setIsGettingLocation(false)
    }
  }

  const handleLocationSelect = (location: { name: string; address: string; lat: number; lng: number }) => {
    onLocationSelect({
      address: location.name,
      lat: location.lat,
      lng: location.lng,
    })
  }

  return (
    <Card className="border-orange-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          위치 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Location Button */}
        <Button
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          variant="outline"
          className="w-full bg-transparent"
        >
          <Navigation className="h-4 w-4 mr-2" />
          {isGettingLocation ? "위치 확인 중..." : "현재 위치 사용"}
        </Button>

        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="location-search">주소 검색</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="location-search"
              placeholder="주소나 지역명을 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Popular Locations */}
        <div className="space-y-2">
          <Label>인기 지역</Label>
          <div className="grid grid-cols-2 gap-2">
            {popularLocations.map((location) => (
              <Button
                key={location.name}
                variant="outline"
                size="sm"
                onClick={() => handleLocationSelect(location)}
                className="text-xs bg-transparent"
              >
                {location.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Selection */}
        {currentLocation && (
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-orange-600" />
              <span className="text-orange-700">선택된 위치: {currentLocation}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
