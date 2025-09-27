"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios" // 1. axios를 import 합니다.
import Link from "next/link";
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
import { useAuth } from "@/context/AuthContext";

// 백엔드 API의 기본 URL을 정의합니다.
const API_URL = "/api";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    setLoginError(null);
    setIsLoading(true); // 로딩 시작

    try {
      // 2. 백엔드 로그인 API에 POST 요청을 보냅니다.
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      // 3. API 응답이 성공적인 경우
      console.log("로그인 성공!", response.data);
      const { user, token } = response.data;
      
      // 4. 전역 상태를 업데이트하고 홈페이지로 이동합니다.
      login(user, token); 
      router.push('/');

    } catch (error) {
      // 5. API 응답이 실패한 경우
      console.error("로그인 실패:", error);
      if (axios.isAxiosError(error) && error.response) {
        // 백엔드에서 보낸 에러 메시지를 표시합니다.
        setLoginError(error.response.data.error || "로그인에 실패했습니다.");
      } else {
        setLoginError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

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
            <Label htmlFor="email">아이디 (이메일)</Label>
            <Input
              id="email"
              type="email" // type을 email로 변경하여 기본 유효성 검사 활용
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading} // 로딩 중에는 입력 비활성화
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading} // 로딩 중에는 입력 비활성화
            />
          </div>
          
          {loginError && (
            <p className="text-sm font-medium text-destructive">{loginError}</p>
          )}

          <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인하기"}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          계정이 없으신가요?{" "}
          <Link href="/register" className="underline font-semibold hover:text-orange-600">
            회원가입
          </Link>
        </div>
        
      </CardContent>
    </Card>
  );
}