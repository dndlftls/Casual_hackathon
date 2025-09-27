# 밥친구 백엔드 API

## 🚀 빠른 시작

### 1. 백엔드 서버 실행
```bash
cd /root/Casual_hackathon/back
npm install
npm start
```

### 2. 프론트엔드 서버 실행
```bash
cd /root/Casual_hackathon/front
npm install
npm run dev
```

### 3. 서비스 접속
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://babfriend.kro.kr:3001/api

## 📋 구현된 기능

### ✅ 사용자 인증
- [x] 회원가입 (이메일, 비밀번호, 닉네임, 선택적 정보)
- [x] 로그인 (이메일/비밀번호)
- [x] JWT 토큰 기반 인증
- [x] 사용자 정보 조회/수정
- [x] 로그아웃

### ✅ 데이터베이스
- [x] SQLite 데이터베이스
- [x] 사용자 테이블 (users)
- [x] 그룹 테이블 (groups) - 향후 확장용

### ✅ API 엔드포인트
- [x] `POST /api/auth/register` - 회원가입
- [x] `POST /api/auth/login` - 로그인
- [x] `GET /api/auth/verify` - 토큰 검증
- [x] `GET /api/user/profile` - 사용자 정보 조회
- [x] `PUT /api/user/profile` - 사용자 정보 수정

### ✅ 프론트엔드 통합
- [x] API 클라이언트 (`lib/api.js`)
- [x] 로그인/회원가입 모달
- [x] 인증 상태 관리
- [x] 자동 토큰 저장/복원

## 🛠 기술 스택

### 백엔드
- **Node.js** + **Express.js**
- **SQLite3** (데이터베이스)
- **JWT** (인증)
- **bcryptjs** (비밀번호 해싱)
- **express-validator** (입력값 검증)
- **CORS** (크로스 오리진)

### 프론트엔드
- **Next.js 14** (React)
- **TypeScript**
- **Tailwind CSS**
- **Radix UI** (컴포넌트)
- **Lucide React** (아이콘)

## 📁 프로젝트 구조

```
Casual_hackathon/
├── back/                    # 백엔드
│   ├── server.js           # 메인 서버 파일
│   ├── database.js         # 데이터베이스 설정
│   ├── test-api.js         # API 테스트 스크립트
│   ├── package.json        # 의존성
│   └── API_DOCUMENTATION.md # API 문서
├── front/                   # 프론트엔드
│   ├── app/                # Next.js 앱 라우터
│   ├── components/         # React 컴포넌트
│   │   ├── auth/           # 인증 관련 컴포넌트
│   │   └── ui/             # UI 컴포넌트
│   ├── lib/                # 유틸리티
│   │   └── api.js          # API 클라이언트
│   └── package.json        # 의존성
└── README.MD               # 서비스 설명
```

## 🔧 개발 환경 설정

### 백엔드 의존성
```json
{
  "express": "^4.17.3",
  "cors": "^2.8.5",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^8.5.1",
  "sqlite3": "^4.2.0",
  "dotenv": "^8.6.0",
  "express-validator": "^6.15.0"
}
```

### 프론트엔드 의존성
- Next.js 14, React 18, TypeScript
- Tailwind CSS, Radix UI
- React Hook Form, Zod (검증)

## 🧪 테스트

### API 테스트 실행
```bash
cd /root/Casual_hackathon/back
node test-api.js
```

### 예상 테스트 결과
```
🚀 밥친구 API 테스트 시작

1. 회원가입 테스트...
✅ 회원가입 성공: 회원가입이 완료되었습니다.

2. 로그인 테스트...
✅ 로그인 성공: 로그인이 완료되었습니다.

3. 토큰 검증 테스트...
✅ 토큰 검증 성공

4. 사용자 정보 조회 테스트...
✅ 사용자 정보 조회 성공

5. 사용자 정보 수정 테스트...
✅ 사용자 정보 수정 성공

🎉 API 테스트 완료!
```

## 🔐 보안 기능

- **비밀번호 해싱**: bcryptjs로 안전한 비밀번호 저장
- **JWT 토큰**: 24시간 유효한 인증 토큰
- **입력값 검증**: express-validator로 서버사이드 검증
- **CORS 설정**: 허용된 도메인만 접근 가능
- **에러 핸들링**: 안전한 에러 응답

## 📱 사용자 경험

### 로그인 플로우
1. 사용자가 "로그인" 버튼 클릭
2. 로그인/회원가입 모달 표시
3. 이메일/비밀번호 입력 또는 회원가입
4. 성공 시 자동으로 토큰 저장 및 사용자 정보 표시
5. 헤더에 사용자 닉네임과 로그아웃 버튼 표시

### 상태 관리
- 로컬 스토리지에 JWT 토큰 자동 저장
- 페이지 새로고침 시 자동 로그인 상태 복원
- 토큰 만료 시 자동 로그아웃

## 🚀 다음 단계

### 향후 구현 예정 기능
- [ ] 그룹 생성/참여 API
- [ ] 실시간 알림 (WebSocket)
- [ ] 위치 기반 매칭
- [ ] 이미지 업로드
- [ ] 채팅 기능
- [ ] 관리자 페이지

### 확장 가능한 구조
- 모듈화된 API 라우터
- 미들웨어 기반 인증
- 확장 가능한 데이터베이스 스키마
- 컴포넌트 기반 프론트엔드

## 📞 지원

문제가 발생하거나 질문이 있으시면:
1. API 문서 확인: `/back/API_DOCUMENTATION.md`
2. 테스트 스크립트 실행: `node test-api.js`
3. 서버 로그 확인: 콘솔 출력 확인

---

**밥친구** - 혼자 먹기 아쉬운 그 메뉴, 함께 먹어요! 🍽️
