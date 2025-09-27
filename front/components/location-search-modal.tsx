"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface LocationSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void
  currentLocation?: string
}

export default function LocationSearchModal({ 
  isOpen, 
  onClose, 
  onLocationSelect, 
  currentLocation 
}: LocationSearchModalProps) {
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
          onLocationSelect({
            address: "현재 위치",
            lat: latitude,
            lng: longitude,
          })
          setIsGettingLocation(false)
          onClose()
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
    onClose()
  }


  const openNaverMap = () => {
    const query = encodeURIComponent(searchQuery || "서울");
    window.open(`https://map.naver.com/v5/search/${query}`, '_blank');
  }

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("")
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            만날 장소 선택
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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


          {/* Naver Map Button */}
          <div className="space-y-2">
            <Button 
              onClick={openNaverMap} 
              variant="outline" 
              className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <MapPin className="h-4 w-4 mr-2" />
              네이버 지도에서 검색하기
            </Button>
            <p className="text-sm text-gray-500 text-center">
              네이버 지도에서 원하는 장소를 찾은 후, 아래에서 직접 입력하거나 인기 지역을 선택하세요
            </p>
          </div>

          {/* Manual Location Input */}
          <div className="space-y-2">
            <Label htmlFor="manual-location">직접 입력</Label>
            <div className="flex gap-2">
              <Input
                id="manual-location"
                placeholder="네이버 지도에서 찾은 장소명을 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                onClick={() => {
                  if (searchQuery.trim()) {
                    // 임시로 강남역 좌표를 사용 (실제로는 네이버 지도 API로 좌표를 가져와야 함)
                    onLocationSelect({
                      address: searchQuery.trim(),
                      lat: 37.498095,
                      lng: 127.02761,
                    })
                    onClose()
                  }
                }}
                variant="outline"
                disabled={!searchQuery.trim()}
              >
                선택
              </Button>
            </div>
          </div>


          {/* Popular Locations */}
          <div className="space-y-2">
            <Label>인기 지역</Label>
            <div className="grid grid-cols-2 gap-2">
              {popularLocations.map((location) => (
                <Card 
                  key={location.name} 
                  className="cursor-pointer hover:bg-orange-50 border-orange-100"
                  onClick={() => handleLocationSelect(location)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-600" />
                      <div>
                        <div className="font-medium text-sm">{location.name}</div>
                        <div className="text-xs text-gray-600">{location.address}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
