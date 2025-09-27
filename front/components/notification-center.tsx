"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Users, MessageCircle, UserPlus, Clock, X } from "lucide-react"

interface Notification {
  id: number
  type: "match" | "join" | "message" | "reminder"
  title: string
  message: string
  time: string
  read: boolean
  actionUrl?: string
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "match",
      title: "새로운 매칭!",
      message: "김철수님이 삼겹살 그룹에 관심을 보였습니다.",
      time: "방금 전",
      read: false,
    },
    {
      id: 2,
      type: "join",
      title: "그룹 참여",
      message: "이영희님이 치킨 그룹에 참여했습니다.",
      time: "5분 전",
      read: false,
    },
    {
      id: 3,
      type: "message",
      title: "새 메시지",
      message: "피자 그룹에 새로운 메시지가 있습니다.",
      time: "10분 전",
      read: true,
    },
    {
      id: 4,
      type: "reminder",
      title: "모임 알림",
      message: "1시간 후 강남역에서 삼겹살 모임이 있습니다.",
      time: "30분 전",
      read: false,
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "match":
        return <Users className="h-4 w-4 text-orange-600" />
      case "join":
        return <UserPlus className="h-4 w-4 text-green-600" />
      case "message":
        return <MessageCircle className="h-4 w-4 text-blue-600" />
      case "reminder":
        return <Clock className="h-4 w-4 text-purple-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now(),
        type: "match",
        title: "실시간 매칭!",
        message: "새로운 사람이 당신의 그룹에 관심을 보였습니다.",
        time: "방금 전",
        read: false,
      }

      if (Math.random() > 0.8) {
        // 20% chance of new notification
        setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]) // Keep only 10 notifications
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <Button onClick={() => setIsOpen(!isOpen)} variant="outline" size="sm" className="relative bg-transparent">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 z-50 border-orange-100 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">알림</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button onClick={markAllAsRead} variant="ghost" size="sm" className="text-xs">
                    모두 읽음
                  </Button>
                )}
                <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length > 0 ? (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? "bg-orange-50" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h4>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeNotification(notification.id)
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">{notification.time}</span>
                            {!notification.read && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p>새로운 알림이 없습니다</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
