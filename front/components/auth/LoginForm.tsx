"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // 1. useRouter 훅을 import 합니다.
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// === 실제 애플리케이션에서는 이 정보가 DB에 있어야 합니다. (테스트용) ===
const CORRECT_EMAIL = "test@example.com";
const CORRECT_PASSWORD = "password123";
// =================================================================

export function LoginForm() {
  const router = useRouter() // 2. useRouter 훅을 초기화합니다.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    setLoginError(null); 

    if (email === CORRECT_EMAIL && password === CORRECT_PASSWORD) {
      // 로그인 성공
      console.log("로그인 성공!", { email, password })
      alert(`${email}님 환영합니다.`)
      
      // 3. 로그인 성공 시 홈페이지('/')로 이동시킵니다.
      router.push('/')

    } else {
      // 로그인 실패
      console.log("로그인 실패")
      setLoginError("아이디 또는 비밀번호가 옳지 않습니다.")
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">로그인</CardTitle>
        <CardDescription>
          아이디와 비밀번호를 입력하여 로그인하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">아이디</Label>
            <Input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {loginError && (
            <p className="text-sm font-medium text-destructive">{loginError}</p>
          )}

          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
            로그인하기
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}