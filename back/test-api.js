const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// 테스트 데이터
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  nickname: '테스트유저',
  age: 25,
  gender: 'male',
  location: '서울시 강남구'
};

async function testAPI() {
  try {
    console.log('🚀 밥친구 API 테스트 시작\n');

    // 1. 회원가입 테스트
    console.log('1. 회원가입 테스트...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ 회원가입 성공:', registerResponse.data.message);
      console.log('토큰:', registerResponse.data.token.substring(0, 20) + '...');
      console.log('사용자 정보:', registerResponse.data.user);
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data && error.response.data.error && error.response.data.error.includes('이미 사용 중')) {
        console.log('⚠️  이미 가입된 사용자입니다. 로그인을 시도합니다.');
      } else {
        console.log('❌ 회원가입 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
      }
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 2. 로그인 테스트
    console.log('2. 로그인 테스트...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ 로그인 성공:', loginResponse.data.message);
      const token = loginResponse.data.token;
      console.log('토큰:', token.substring(0, 20) + '...');
      console.log('사용자 정보:', loginResponse.data.user);

      console.log('\n' + '='.repeat(50) + '\n');

      // 3. 토큰 검증 테스트
      console.log('3. 토큰 검증 테스트...');
      try {
        const verifyResponse = await axios.get(`${BASE_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ 토큰 검증 성공:', verifyResponse.data);
      } catch (error) {
        console.log('❌ 토큰 검증 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
      }

      console.log('\n' + '='.repeat(50) + '\n');

      // 4. 사용자 정보 조회 테스트
      console.log('4. 사용자 정보 조회 테스트...');
      try {
        const profileResponse = await axios.get(`${BASE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ 사용자 정보 조회 성공:');
        console.log(JSON.stringify(profileResponse.data.user, null, 2));
      } catch (error) {
        console.log('❌ 사용자 정보 조회 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
      }

      console.log('\n' + '='.repeat(50) + '\n');

      // 5. 사용자 정보 수정 테스트
      console.log('5. 사용자 정보 수정 테스트...');
      try {
        const updateResponse = await axios.put(`${BASE_URL}/user/profile`, {
          nickname: '수정된닉네임',
          age: 26,
          location: '서울시 서초구'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ 사용자 정보 수정 성공:', updateResponse.data.message);
      } catch (error) {
        console.log('❌ 사용자 정보 수정 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
      }

    } catch (error) {
      console.log('❌ 로그인 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
    }

    console.log('\n🎉 API 테스트 완료!');

  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error.message);
  }
}

// axios 설치 확인
try {
  require('axios');
  testAPI();
} catch (error) {
  console.log('axios가 설치되지 않았습니다. 설치 중...');
  const { exec } = require('child_process');
  exec('npm install axios', (err, stdout, stderr) => {
    if (err) {
      console.error('axios 설치 실패:', err);
      return;
    }
    console.log('axios 설치 완료. 테스트를 다시 실행합니다.');
    testAPI();
  });
}
