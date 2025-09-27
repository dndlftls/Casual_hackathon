"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Clock, Plus, Search, Zap } from "lucide-react";
import Link from "next/link";
// 홈페이지 자체에서는 더 이상 useAuth를 직접 호출할 필요가 없습니다. (헤더가 담당)

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"create" | "join">("join");

  const featuredGroups = [
      { id: 1, menu: "삼겹살", time: "오늘 7:00 PM", location: "강남역", distance: "0.5km", currentMembers: 2, maxMembers: 4, tags: ["고기", "회식"] },
      { id: 2, menu: "치킨", time: "오늘 8:30 PM", location: "홍대입구", distance: "1.2km", currentMembers: 1, maxMembers: 3, tags: ["치킨", "맥주"] },
      { id: 3, menu: "라면", time: "내일 12:00 PM", location: "신촌", distance: "2.1km", currentMembers: 3, maxMembers: 4, tags: ["점심", "간단"] },
  ];

  // 기존 코드에서 <header>...</header> 부분만 완전히 삭제합니다.
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            혼자 먹기 아쉬운 그 메뉴,
            <br />
            <span className="text-orange-600">함께 먹어요!</span>
          </h2>
          {/* ... 이하 홈페이지의 나머지 내용은 그대로 유지 ... */}
        </div>
      </section>

      {/* ... Featured Groups, Map, Features, Footer 등 ... */}
    </div>
  );
}