// 밥친구 API 클라이언트
const API_BASE_URL = 'http://localhost:3001/api';

class BabchinguAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  // 토큰 설정
  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('babchingu_token', token);
    }
  }

  // 토큰 가져오기
  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('babchingu_token');
    }
    return null;
  }

  // 토큰 제거
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('babchingu_token');
    }
  }

  // HTTP 요청 헬퍼
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API 요청 중 오류가 발생했습니다.');
      }

      return data;
    } catch (error) {
      console.error('API 요청 오류:', error);
      throw error;
    }
  }

  // 회원가입
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // 로그인
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  // 로그아웃
  logout() {
    this.clearToken();
  }

  // 토큰 검증
  async verifyToken() {
    return this.request('/auth/verify');
  }

  // 사용자 정보 조회
  async getUserProfile() {
    return this.request('/user/profile');
  }

  // 사용자 정보 수정
  async updateUserProfile(userData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // 로그인 상태 확인
  async checkAuthStatus() {
    try {
      const token = this.getToken();
      if (!token) {
        return { isAuthenticated: false };
      }

      const response = await this.verifyToken();
      return {
        isAuthenticated: true,
        user: response.user,
      };
    } catch (error) {
      this.clearToken();
      return { isAuthenticated: false };
    }
  }
}

// 싱글톤 인스턴스 생성
const api = new BabchinguAPI();

export default api;
