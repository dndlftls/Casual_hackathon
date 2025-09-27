const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// 테스트용 사용자 데이터
const testUsers = [
  {
    email: 'user1@example.com',
    password: 'password123',
    nickname: '사용자1',
    age: 25,
    gender: 'male',
    location: '서울시 강남구'
  },
  {
    email: 'user2@example.com',
    password: 'password123',
    nickname: '사용자2',
    age: 28,
    gender: 'female',
    location: '서울시 서초구'
  }
];


let userTokens = [];

async function testGroupsAPI() {
    try{
        // 1. 사용자 등록 및 로그인
        console.log('1. 사용자 등록 및 로그인...');
        for (let i = 0; i < testUsers.length; i++) {
            try {
                const user = testUsers[i];
                const registerResponse = await axios.post(`${BASE_URL}/auth/register`, user);
                console.log(`✅ 사용자${i+1} 회원가입 성공: ${user.nickname}`);
                userTokens.push(registerResponse.data.token);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error && error.response.data.error.includes('이미 사용 중')) {
                // 이미 가입된 사용자라면 로그인
                const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
                    email: testUsers[i].email,
                    password: testUsers[i].password
                });
                console.log(`✅ 사용자${i+1} 로그인 성공: ${testUsers[i].nickname}`);
                userTokens.push(loginResponse.data.token);
                } else {
                console.log(`❌ 사용자${i+1} 등록/로그인 실패:`, (error.response && error.response.data && error.response.data.error) || error.message);
                }
            }
        }
        console.log('\n' + '='.repeat(50) + '\n');

        // 2. 그룹 생성 테스트
        console.log('2. 그룹 생성 테스트...');
        try {
          const groupData = {
            title: '율천회관 먹어요!',
            menu: '율천회관',
            location: '성균관대역',
            meeting_time: '2025-09-28 19:00:00',
            max_members: 4,
            description: '맛있는 육회덮밥 함께 먹어요!'
          };
    
          const createResponse = await axios.post(`${BASE_URL}/groups`, groupData, {
            headers: { Authorization: `Bearer ${userTokens[0]}` }
          });
          console.log('✅ 그룹 생성 성공:', createResponse.data.message);
          console.log('그룹 정보:', createResponse.data.group);
          const groupId = createResponse.data.group.id;
        } catch (error) {
          console.log('❌ 그룹 생성 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
        }
    
        try {
            const groupData = {
              title: '성대족발 같이 드실분!!',
              menu: '성대족발',
              location: '성균관대역',
              meeting_time: '2025-09-28 19:00:00',
              max_members: 4,
              description: '성대 족발 혼자먹기에는 많아서 같이 드실분 구해여'
            };
      
            const createResponse = await axios.post(`${BASE_URL}/groups`, groupData, {
              headers: { Authorization: `Bearer ${userTokens[0]}` }
            });
            console.log('✅ 그룹 생성 성공:', createResponse.data.message);
            console.log('그룹 정보:', createResponse.data.group);
            const groupId = createResponse.data.group.id;
        } catch (error) {
            console.log('❌ 그룹 생성 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
        }
        console.log('\n' + '='.repeat(50) + '\n');

        // 4. 그룹 참여 테스트
        console.log('4. 그룹 참여 테스트...');
        try {
        const listResponse = await axios.get(`${BASE_URL}/groups`);
        if (listResponse.data.groups.length > 0) {
            const groupId = listResponse.data.groups[0].id;
            
            const joinResponse = await axios.post(`${BASE_URL}/groups/${groupId}/join`, {}, {
            headers: { Authorization: `Bearer ${userTokens[1]}` }
            });
            console.log('✅ 그룹 참여 성공:', joinResponse.data.message);
        }
        } catch (error) {
        console.log('❌ 그룹 참여 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
        }

    }catch(error){
        console.log('❌ 테스트 중 오류 발생:', error.message);
    }
}

testGroupsAPI();