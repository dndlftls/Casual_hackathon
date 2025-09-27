"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Clock } from "lucide-react"
import Link from "next/link"

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

interface NaverMapProps {
  groups: MealGroup[]
  center?: { lat: number; lng: number }
  zoom?: number
}

declare global {
  interface Window {
    naver: any
  }
}

export default function NaverMap({ groups, center = { lat: 37.5665, lng: 126.978 }, zoom = 12 }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [selectedGroup, setSelectedGroup] = useState<MealGroup | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const checkNaverMaps = () => {
      if (window.naver && window.naver.maps) {
        setIsLoaded(true)
        return true
      }
      return false
    }

    if (checkNaverMaps()) {
      initializeMap()
    } else {
      const interval = setInterval(() => {
        if (checkNaverMaps()) {
          clearInterval(interval)
          initializeMap()
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (map && isLoaded) {
      updateMarkers()
    }
  }, [groups, map, isLoaded])

  const initializeMap = () => {
    if (!mapRef.current || !window.naver) return

    const mapOptions = {
      center: new window.naver.maps.LatLng(center.lat, center.lng),
      zoom: zoom,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: window.naver.maps.MapTypeControlStyle.BUTTON,
        position: window.naver.maps.Position.TOP_RIGHT,
      },
      zoomControl: true,
      zoomControlOptions: {
        style: window.naver.maps.ZoomControlStyle.SMALL,
        position: window.naver.maps.Position.TOP_LEFT,
      },
    }

    const naverMap = new window.naver.maps.Map(mapRef.current, mapOptions)
    setMap(naverMap)
  }

  const updateMarkers = () => {
    if (!map || !window.naver) return

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))
    setMarkers([])

    // Create new markers
    const newMarkers = groups.map((group) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(group.lat, group.lng),
        map: map,
        title: group.menu,
        icon: {
          content: `
            <div class="bg-orange-600 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg border-2 border-white">
              ${group.menu}
            </div>
          `,
          anchor: new window.naver.maps.Point(0, 0),
        },
      })

      // Add click event to marker
      window.naver.maps.Event.addListener(marker, "click", () => {
        setSelectedGroup(group)
        map.setCenter(new window.naver.maps.LatLng(group.lat, group.lng))
        map.setZoom(15)
      })

      return marker
    })

    setMarkers(newMarkers)

    // Adjust map bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.naver.maps.LatLngBounds()
      groups.forEach((group) => {
        bounds.extend(new window.naver.maps.LatLng(group.lat, group.lng))
      })
      map.fitBounds(bounds, { padding: 50 })
    }
  }

  const handleMarkerClick = (group: MealGroup) => {
    setSelectedGroup(group)
    if (map) {
      map.setCenter(new window.naver.maps.LatLng(group.lat, group.lng))
      map.setZoom(15)
    }
  }

  if (!isLoaded) {
    return (
      <Card className="border-orange-100 h-96">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p>지도를 불러오는 중...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative">
      <Card className="border-orange-100 h-96 overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />
      </Card>

      {/* Selected Group Info Panel */}
      {selectedGroup && (
        <Card className="absolute top-4 left-4 w-80 z-10 shadow-lg border-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{selectedGroup.menu}</h3>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {selectedGroup.currentMembers}/{selectedGroup.maxMembers}명
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {selectedGroup.time}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {selectedGroup.location} ({selectedGroup.distance})
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                by {selectedGroup.createdBy}
              </div>
            </div>

            {selectedGroup.description && <p className="text-sm text-gray-600 mb-3">{selectedGroup.description}</p>}

            <div className="flex flex-wrap gap-1 mb-4">
              {selectedGroup.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Link href={`/groups/${selectedGroup.id}`} className="flex-1">
                <Button className="w-full bg-orange-600 hover:bg-orange-700" size="sm">
                  자세히 보기
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => setSelectedGroup(null)}>
                닫기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Group List Panel */}
      <Card className="absolute top-4 right-4 w-64 max-h-80 overflow-y-auto z-10 shadow-lg border-orange-100">
        <CardContent className="p-3">
          <h4 className="font-medium text-gray-900 mb-3">그룹 목록 ({groups.length})</h4>
          <div className="space-y-2">
            {groups.map((group) => (
              <div
                key={group.id}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedGroup?.id === group.id
                    ? "bg-orange-100 border border-orange-200"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => handleMarkerClick(group)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{group.menu}</span>
                  <Badge variant="outline" className="text-xs">
                    {group.currentMembers}/{group.maxMembers}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600">
                  <div>{group.location}</div>
                  <div>{group.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
