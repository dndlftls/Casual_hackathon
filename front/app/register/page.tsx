import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    // 로그인 페이지와 동일하게, 폼을 화면 중앙에 배치합니다.
    <main className="flex items-center justify-center min-h-screen py-12">
      <RegisterForm />
    </main>
  );
}