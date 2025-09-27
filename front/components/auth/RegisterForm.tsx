"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/context/AuthContext"

const API_URL = "http://babfriend.kro.kr:3001/api";

// API 문서에 기반한 Zod 유효성 검사 스키마
const formSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z.string().min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." }),
  nickname: z.string().min(2, { message: "닉네임은 최소 2자 이상이어야 합니다." }),
  // 선택 항목들
  age: z.coerce.number().int().min(1).max(100).optional(), // HTML input은 문자열이므로 숫자로 변환
  gender: z.enum(['male', 'female', 'other']).optional(),
  location: z.string().optional(),
});

export function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      nickname: "",
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setServerError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, values);

      console.log("회원가입 성공!", response.data);
      const { user, token } = response.data;
      
      // 회원가입 성공 시 바로 로그인 처리
      login(user, token);
      router.push('/'); // 홈페이지로 이동
      
    } catch (error) {
      console.error("회원가입 실패:", error);
      if (axios.isAxiosError(error) && error.response) {
        setServerError(error.response.data.error || "회원가입에 실패했습니다.");
      } else {
        setServerError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">회원가입</CardTitle>
        <CardDescription>
          밥친구와 함께할 계정을 만들어보세요!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* 필수 항목 */}
            <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>이메일</FormLabel> <FormControl><Input placeholder="email@example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="password" render={({ field }) => ( <FormItem> <FormLabel>비밀번호</FormLabel> <FormControl><Input type="password" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            <FormField control={form.control} name="nickname" render={({ field }) => ( <FormItem> <FormLabel>닉네임</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
            
            {/* 선택 항목 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="age" render={({ field }) => ( <FormItem> <FormLabel>나이 (선택)</FormLabel> <FormControl><Input type="number" {...field} onChange={event => field.onChange(+event.target.value)} /></FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="gender" render={({ field }) => ( <FormItem> <FormLabel>성별 (선택)</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="선택..." /></SelectTrigger></FormControl> <SelectContent> <SelectItem value="male">남성</SelectItem> <SelectItem value="female">여성</SelectItem> <SelectItem value="other">기타</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )} />
            </div>
            <FormField control={form.control} name="location" render={({ field }) => ( <FormItem> <FormLabel>지역 (선택)</FormLabel> <FormControl><Input placeholder="예: 서울시 강남구" {...field} /></FormControl> <FormMessage /> </FormItem> )} />

            {serverError && (
              <p className="text-sm font-medium text-destructive">{serverError}</p>
            )}
            
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
              {isLoading ? "가입하는 중..." : "가입하기"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}