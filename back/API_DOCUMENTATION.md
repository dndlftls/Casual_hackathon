# 밥친구 백엔드 API 문서

## 개요
밥친구 서비스의 백엔드 API입니다. 사용자 인증 및 관리 기능을 제공합니다.

## 기본 정보
- **Base URL**: `http://localhost:3001/api`
- **Content-Type**: `application/json`
- **인증 방식**: JWT Bearer Token

## API 엔드포인트

### 1. 회원가입
**POST** `/auth/register`

새로운 사용자를 등록합니다.

#### 요청 본문
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "사용자닉네임",
  "age": 25,
  "gender": "male",
  "location": "서울시 강남구"
}
```

#### 필수 필드
- `email`: 이메일 주소 (유효한 이메일 형식)
- `password`: 비밀번호 (최소 6자 이상)
- `nickname`: 닉네임

#### 선택 필드
- `age`: 나이 (1-100)
- `gender`: 성별 ("male", "female", "other")
- `location`: 위치

#### 응답
```json
{
  "message": "회원가입이 완료되었습니다.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "사용자닉네임",
    "age": 25,
    "gender": "male",
    "location": "서울시 강남구"
  }
}
```

### 2. 로그인
**POST** `/auth/login`

사용자 로그인을 처리합니다.

#### 요청 본문
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 응답
```json
{
  "message": "로그인이 완료되었습니다.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "사용자닉네임",
    "age": 25,
    "gender": "male",
    "location": "서울시 강남구"
  }
}
```

### 3. 토큰 검증
**GET** `/auth/verify`

JWT 토큰의 유효성을 검증합니다.

#### 헤더
```
Authorization: Bearer <token>
```

#### 응답
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "사용자닉네임"
  }
}
```

### 4. 사용자 정보 조회
**GET** `/user/profile`

현재 로그인한 사용자의 정보를 조회합니다.

#### 헤더
```
Authorization: Bearer <token>
```

#### 응답
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "사용자닉네임",
    "age": 25,
    "gender": "male",
    "location": "서울시 강남구",
    "created_at": "2024-01-01 12:00:00"
  }
}
```

### 5. 사용자 정보 수정
**PUT** `/user/profile`

현재 로그인한 사용자의 정보를 수정합니다.

#### 헤더
```
Authorization: Bearer <token>
```

#### 요청 본문
```json
{
  "nickname": "새로운닉네임",
  "age": 26,
  "gender": "female",
  "location": "서울시 서초구"
}
```

#### 응답
```json
{
  "message": "사용자 정보가 수정되었습니다."
}
```

## 에러 응답

### 400 Bad Request
```json
{
  "error": "입력값이 올바르지 않습니다.",
  "details": [
    {
      "msg": "유효한 이메일을 입력해주세요.",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "이메일 또는 비밀번호가 올바르지 않습니다."
}
```

### 403 Forbidden
```json
{
  "error": "유효하지 않은 토큰입니다."
}
```

### 500 Internal Server Error
```json
{
  "error": "서버 오류가 발생했습니다."
}
```

## 사용 예시

### JavaScript (fetch)
```javascript
// 회원가입
const registerUser = async (userData) => {
  const response = await fetch('http://localhost:3001/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  return await response.json();
};

// 로그인
const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  return await response.json();
};

// 사용자 정보 조회
const getUserProfile = async (token) => {
  const response = await fetch('http://localhost:3001/api/user/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

### cURL 예시
```bash
# 회원가입
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nickname": "테스트유저",
    "age": 25,
    "gender": "male",
    "location": "서울시 강남구"
  }'

# 로그인
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 사용자 정보 조회
curl -X GET http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer <token>"
```

## 데이터베이스 스키마

### users 테이블
| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 사용자 ID |
| email | TEXT | UNIQUE, NOT NULL | 이메일 |
| password | TEXT | NOT NULL | 해시된 비밀번호 |
| nickname | TEXT | NOT NULL | 닉네임 |
| age | INTEGER | | 나이 |
| gender | TEXT | | 성별 |
| location | TEXT | | 위치 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 생성일시 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 수정일시 |

## 보안 고려사항

1. **비밀번호 해싱**: bcryptjs를 사용하여 비밀번호를 해싱합니다.
2. **JWT 토큰**: 24시간 유효한 JWT 토큰을 사용합니다.
3. **입력값 검증**: express-validator를 사용하여 입력값을 검증합니다.
4. **CORS 설정**: 프론트엔드 도메인만 허용하도록 설정되어 있습니다.

## 개발 환경 설정

1. 의존성 설치:
```bash
npm install
```

2. 서버 실행:
```bash
npm start
# 또는 개발 모드
npm run dev
```

3. API 테스트:
```bash
node test-api.js
```
