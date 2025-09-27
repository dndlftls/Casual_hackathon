# 밥친구 백엔드 API 문서

## 개요
밥친구 서비스의 백엔드 API입니다. 사용자 인증 및 관리 기능을 제공합니다.

## 기본 정보
- **Base URL**: `http://localhost:3001/api`
- **Content-Type**: `application/json`
- **인증 방식**: JWT Bearer Token

## API 엔드포인트

## 🔐 인증 관련 API

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

## 🍽️ 그룹 관련 API

### 1. 그룹 생성
**POST** `/groups`

새로운 그룹을 생성합니다.

#### 권한 요구사항
- **인증**: 필수 (JWT 토큰 필요)
- **접근 제한**: 로그인한 사용자만 가능
- **제약 조건**: 
  - 최대 인원: 2-8명
  - 만남 시간: 미래 시간이어야 함
  - 그룹 제목, 메뉴, 위치, 만남 시간은 필수

#### 헤더
```
Authorization: Bearer <token>
```

#### 요청 본문
```json
{
  "title": "삼겹살 먹으러 가요!",
  "menu": "삼겹살",
  "location": "강남역",
  "meeting_time": "2024-01-15 19:00:00",
  "max_members": 4,
  "description": "맛있는 삼겹살 함께 먹어요!"
}
```

#### 필수 필드
- `title`: 그룹 제목
- `menu`: 메뉴
- `location`: 위치
- `meeting_time`: 만남 시간 (YYYY-MM-DD HH:MM:SS 형식)

#### 선택 필드
- `max_members`: 최대 인원 (2-8명, 기본값: 4)
- `description`: 그룹 설명

#### 응답
```json
{
  "message": "그룹이 생성되었습니다.",
  "group": {
    "id": 1,
    "title": "삼겹살 먹으러 가요!",
    "menu": "삼겹살",
    "location": "강남역",
    "max_members": 4,
    "current_members": 1,
    "creator_id": 2,
    "meeting_time": "2024-01-15 19:00:00",
    "description": "맛있는 삼겹살 함께 먹어요!",
    "status": "active"
  }
}
```

### 2. 그룹 목록 조회
**GET** `/groups`

그룹 목록을 조회합니다. 검색 및 필터링 기능을 제공합니다.

#### 권한 요구사항
- **인증**: 불필요 (공개 API)
- **접근 제한**: 없음 (모든 사용자가 조회 가능)

#### 쿼리 파라미터
- `search`: 검색어 (제목, 메뉴, 설명에서 검색)
- `menu`: 메뉴 필터
- `location`: 위치 필터
- `status`: 상태 필터 (기본값: active)
- `limit`: 페이지 크기 (기본값: 20)
- `offset`: 페이지 오프셋 (기본값: 0)

#### 응답
```json
{
  "groups": [
    {
      "id": 1,
      "title": "삼겹살 먹으러 가요!",
      "menu": "삼겹살",
      "location": "강남역",
      "max_members": 4,
      "current_members": 2,
      "creator_id": 2,
      "meeting_time": "2024-01-15 19:00:00",
      "description": "맛있는 삼겹살 함께 먹어요!",
      "status": "active",
      "created_at": "2024-01-01 12:00:00",
      "creator_nickname": "사용자1"
    }
  ]
}
```

### 3. 특정 그룹 조회
**GET** `/groups/:id`

특정 그룹의 상세 정보와 멤버 목록을 조회합니다.

#### 권한 요구사항
- **인증**: 불필요 (공개 API)
- **접근 제한**: 없음 (모든 사용자가 조회 가능)
- **제약 조건**: 
  - 존재하는 그룹 ID여야 함
  - 비활성 그룹도 조회 가능 (상태 정보 포함)

#### 응답
```json
{
  "group": {
    "id": 1,
    "title": "삼겹살 먹으러 가요!",
    "menu": "삼겹살",
    "location": "강남역",
    "max_members": 4,
    "current_members": 2,
    "creator_id": 2,
    "meeting_time": "2024-01-15 19:00:00",
    "description": "맛있는 삼겹살 함께 먹어요!",
    "status": "active",
    "created_at": "2024-01-01 12:00:00",
    "creator_nickname": "사용자1",
    "members": [
      {
        "id": 2,
        "nickname": "사용자1",
        "age": 25,
        "gender": "male",
        "location": "서울시 강남구",
        "joined_at": "2024-01-01 12:00:00"
      },
      {
        "id": 3,
        "nickname": "사용자2",
        "age": 28,
        "gender": "female",
        "location": "서울시 서초구",
        "joined_at": "2024-01-01 12:05:00"
      }
    ]
  }
}
```

### 4. 그룹 참여
**POST** `/groups/:id/join`

특정 그룹에 참여합니다.

#### 권한 요구사항
- **인증**: 필수 (JWT 토큰 필요)
- **접근 제한**: 로그인한 사용자만 가능
- **제약 조건**: 
  - 그룹이 활성 상태여야 함
  - 그룹이 가득 차지 않았어야 함 (현재 인원 < 최대 인원)
  - 이미 참여한 그룹이 아니어야 함
  - 그룹 생성자는 자동으로 참여됨

#### 헤더
```
Authorization: Bearer <token>
```

#### 응답
```json
{
  "message": "그룹에 참여했습니다."
}
```

### 5. 그룹 탈퇴
**POST** `/groups/:id/leave`

특정 그룹에서 탈퇴합니다.

#### 권한 요구사항
- **인증**: 필수 (JWT 토큰 필요)
- **접근 제한**: 로그인한 사용자만 가능
- **제약 조건**: 
  - 참여 중인 그룹이어야 함
  - 그룹 생성자는 탈퇴 불가 (그룹 삭제만 가능)

#### 헤더
```
Authorization: Bearer <token>
```

#### 응답
```json
{
  "message": "그룹에서 탈퇴했습니다."
}
```

### 6. 내가 참여한 그룹 목록
**GET** `/groups/my-groups`

현재 사용자가 참여한 그룹 목록을 조회합니다.

#### 권한 요구사항
- **인증**: 필수 (JWT 토큰 필요)
- **접근 제한**: 본인만 조회 가능
- **제약 조건**: 
  - 활성 상태의 그룹만 조회
  - 참여 중인 그룹만 조회
  - 만남 시간 순으로 정렬

#### 헤더
```
Authorization: Bearer <token>
```

#### 응답
```json
{
  "groups": [
    {
      "id": 1,
      "title": "삼겹살 먹으러 가요!",
      "menu": "삼겹살",
      "location": "강남역",
      "max_members": 4,
      "current_members": 2,
      "creator_id": 2,
      "meeting_time": "2024-01-15 19:00:00",
      "description": "맛있는 삼겹살 함께 먹어요!",
      "status": "active",
      "created_at": "2024-01-01 12:00:00",
      "creator_nickname": "사용자1"
    }
  ]
}
```

### 7. 내가 생성한 그룹 목록
**GET** `/groups/my-created`

현재 사용자가 생성한 그룹 목록을 조회합니다.

#### 권한 요구사항
- **인증**: 필수 (JWT 토큰 필요)
- **접근 제한**: 본인만 조회 가능
- **제약 조건**: 
  - 활성 상태의 그룹만 조회
  - 생성한 그룹만 조회
  - 생성일시 순으로 정렬

#### 헤더
```
Authorization: Bearer <token>
```

#### 응답
```json
{
  "groups": [
    {
      "id": 1,
      "title": "삼겹살 먹으러 가요!",
      "menu": "삼겹살",
      "location": "강남역",
      "max_members": 4,
      "current_members": 2,
      "creator_id": 2,
      "meeting_time": "2024-01-15 19:00:00",
      "description": "맛있는 삼겹살 함께 먹어요!",
      "status": "active",
      "created_at": "2024-01-01 12:00:00",
      "creator_nickname": "사용자1"
    }
  ]
}
```

### 8. 그룹 수정
**PUT** `/groups/:id`

그룹 정보를 수정합니다.

#### 권한 요구사항
- **인증**: 필수 (JWT 토큰 필요)
- **접근 제한**: 그룹 생성자만 가능
- **제약 조건**: 
  - 그룹이 활성 상태여야 함
  - 최대 인원은 현재 참여 인원보다 작을 수 없음
  - 만남 시간은 미래 시간이어야 함
  - 수정할 필드가 하나 이상 있어야 함

#### 헤더
```
Authorization: Bearer <token>
```

#### 요청 본문
```json
{
  "title": "수정된 그룹 제목",
  "menu": "수정된 메뉴",
  "location": "수정된 위치",
  "meeting_time": "2024-01-16 20:00:00",
  "max_members": 6,
  "description": "수정된 설명입니다."
}
```

#### 응답
```json
{
  "message": "그룹 정보가 수정되었습니다."
}
```

### 9. 그룹 삭제
**DELETE** `/groups/:id`

그룹을 삭제합니다.

#### 권한 요구사항
- **인증**: 필수 (JWT 토큰 필요)
- **접근 제한**: 그룹 생성자만 가능
- **제약 조건**: 
  - 그룹이 존재해야 함
  - 소프트 삭제 (상태를 'inactive'로 변경)
  - 삭제된 그룹은 조회되지 않음

#### 헤더
```
Authorization: Bearer <token>
```

#### 응답
```json
{
  "message": "그룹이 삭제되었습니다."
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

// 그룹 생성
const createGroup = async (groupData, token) => {
  const response = await fetch('http://localhost:3001/api/groups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(groupData)
  });
  return await response.json();
};

// 그룹 목록 조회
const getGroups = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`http://localhost:3001/api/groups?${queryParams}`);
  return await response.json();
};

// 그룹 참여
const joinGroup = async (groupId, token) => {
  const response = await fetch(`http://localhost:3001/api/groups/${groupId}/join`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};

// 내가 참여한 그룹 목록
const getMyGroups = async (token) => {
  const response = await fetch('http://localhost:3001/api/groups/my-groups', {
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

# 그룹 생성
curl -X POST http://localhost:3001/api/groups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "삼겹살 먹으러 가요!",
    "menu": "삼겹살",
    "location": "강남역",
    "meeting_time": "2024-01-15 19:00:00",
    "max_members": 4,
    "description": "맛있는 삼겹살 함께 먹어요!"
  }'

# 그룹 목록 조회
curl -X GET "http://localhost:3001/api/groups?search=삼겹살&location=강남"

# 그룹 참여
curl -X POST http://localhost:3001/api/groups/1/join \
  -H "Authorization: Bearer <token>"

# 내가 참여한 그룹 목록
curl -X GET http://localhost:3001/api/groups/my-groups \
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

### groups 테이블
| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 그룹 ID |
| title | TEXT | NOT NULL | 그룹 제목 |
| menu | TEXT | NOT NULL | 메뉴 |
| location | TEXT | NOT NULL | 위치 |
| max_members | INTEGER | DEFAULT 4 | 최대 인원 |
| current_members | INTEGER | DEFAULT 1 | 현재 인원 |
| creator_id | INTEGER | NOT NULL, FOREIGN KEY | 생성자 ID |
| meeting_time | DATETIME | NOT NULL | 만남 시간 |
| description | TEXT | | 그룹 설명 |
| status | TEXT | DEFAULT 'active' | 그룹 상태 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 생성일시 |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 수정일시 |

### group_members 테이블
| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 멤버 ID |
| group_id | INTEGER | NOT NULL, FOREIGN KEY | 그룹 ID |
| user_id | INTEGER | NOT NULL, FOREIGN KEY | 사용자 ID |
| joined_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 참여일시 |
| status | TEXT | DEFAULT 'active' | 멤버 상태 |

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
