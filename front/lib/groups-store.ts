// 간단한 그룹 데이터 저장소 (실제로는 백엔드 API를 사용해야 함)

interface Member {
  id: number
  name: string
  joinedAt: string
}

interface MealGroup {
  id: number
  menu: string
  time: string
  location: string
  distance: string
  currentMembers: number
  maxMembers: number
  tags: string[]
  description?: string
  createdBy: string
  mealType: string
  priceRange: string
  lat: number
  lng: number
  createdAt: string
  members?: Member[]
}

// 메모리 기반 저장소 (실제로는 데이터베이스 사용)
let groups: MealGroup[] = [
  {
    id: 1,
    menu: "삼겹살",
    time: "오늘 7:00 PM",
    location: "강남역 2번 출구 앞",
    distance: "0.5km",
    currentMembers: 2,
    maxMembers: 4,
    tags: ["고기", "회식", "저녁"],
    description: "퇴근 후 삼겹살 한 판 어떠세요? 맛있는 집 알고 있어서 같이 가실 분들 모집합니다!",
    lat: 37.498095,
    lng: 127.02761,
    createdBy: "김철수",
    mealType: "저녁",
    priceRange: "2-3만원",
    createdAt: "2024-01-15",
    members: [
      { id: 1, name: "김철수", joinedAt: "2024-01-15" },
      { id: 2, name: "이영희", joinedAt: "2024-01-16" },
    ],
  },
  {
    id: 2,
    menu: "치킨",
    time: "오늘 8:30 PM",
    location: "홍대입구역 9번 출구",
    distance: "1.2km",
    currentMembers: 1,
    maxMembers: 3,
    tags: ["치킨", "맥주", "저녁"],
    description: "치킨과 맥주 한 잔 어떠세요?",
    lat: 37.557527,
    lng: 126.925394,
    createdBy: "이영희",
    mealType: "저녁",
    priceRange: "1-2만원",
    createdAt: "2024-01-16",
    members: [
      { id: 2, name: "이영희", joinedAt: "2024-01-16" },
    ],
  },
  {
    id: 3,
    menu: "라면",
    time: "내일 12:00 PM",
    location: "신촌역 2번 출구",
    distance: "2.1km",
    currentMembers: 3,
    maxMembers: 4,
    tags: ["점심", "간단", "라면"],
    description: "점심시간에 간단하게 라면 한 그릇 어떠세요?",
    lat: 37.555946,
    lng: 126.936893,
    createdBy: "박민수",
    mealType: "점심",
    priceRange: "5천원-1만원",
    createdAt: "2024-01-17",
    members: [
      { id: 3, name: "박민수", joinedAt: "2024-01-17" },
      { id: 4, name: "최지영", joinedAt: "2024-01-17" },
      { id: 5, name: "정현우", joinedAt: "2024-01-17" },
    ],
  },
]

export const groupsStore = {
  // 모든 그룹 가져오기
  getAllGroups: (): MealGroup[] => {
    return [...groups]
  },

  // 새 그룹 추가
  addGroup: (groupData: Omit<MealGroup, 'id' | 'currentMembers' | 'createdAt'>): MealGroup => {
    const newGroup: MealGroup = {
      ...groupData,
      id: Date.now(),
      currentMembers: 1,
      createdAt: new Date().toISOString().split('T')[0],
    }
    groups.push(newGroup)
    return newGroup
  },

  // ID로 그룹 찾기
  getGroupById: (id: number): MealGroup | undefined => {
    return groups.find(group => group.id === id)
  },

  // 그룹 업데이트
  updateGroup: (id: number, updates: Partial<MealGroup>): MealGroup | null => {
    const index = groups.findIndex(group => group.id === id)
    if (index !== -1) {
      groups[index] = { ...groups[index], ...updates }
      return groups[index]
    }
    return null
  },

  // 그룹 삭제
  deleteGroup: (id: number): boolean => {
    const index = groups.findIndex(group => group.id === id)
    if (index !== -1) {
      groups.splice(index, 1)
      return true
    }
    return false
  }
}

export type { MealGroup, Member }
