"use client"; // 이 컴포넌트는 클라이언트 컴포넌트입니다.

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  // 헤더 스스로 useAuth를 호출하여 user 정보를 가져옵니다.
  const { user } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Utensils className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">밥친구</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/groups" className="text-gray-600 hover:text-orange-600 transition-colors">
              그룹 찾기
            </Link>
            <Link href="/my-groups" className="text-gray-600 hover:text-orange-600 transition-colors">
              내 그룹
            </Link>
            
            {user ? (
              // 로그인 상태일 때
              <span className="font-semibold text-gray-800">{user.nickname}님</span>
            ) : (
              // 로그아웃 상태일 때
              <Link href="/login">
                <Button variant="outline" size="sm">
                  로그인
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}