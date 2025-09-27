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
  try {
    console.log('🚀 밥친구 그룹 API 테스트 시작\n');

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

    // 추가 사용자 생성 (권한 테스트용)
    try {
      const user3 = {
        email: 'user3@example.com',
        password: 'password123',
        nickname: '사용자3',
        age: 30,
        gender: 'male',
        location: '서울시 마포구'
      };
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, user3);
      console.log(`✅ 사용자3 회원가입 성공: ${user3.nickname}`);
      userTokens.push(registerResponse.data.token);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error && error.response.data.error.includes('이미 사용 중')) {
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: 'user3@example.com',
          password: 'password123'
        });
        console.log(`✅ 사용자3 로그인 성공: 사용자3`);
        userTokens.push(loginResponse.data.token);
      }
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 2. 그룹 생성 테스트
    console.log('2. 그룹 생성 테스트...');
    try {
      const groupData = {
        title: '삼겹살 먹으러 가요!',
        menu: '율천회관',
        location: '강남역',
        meeting_time: '2024-01-15 19:00:00',
        max_members: 4,
        description: '맛있는 삼겹살 함께 먹어요!'
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

    // 3. 그룹 목록 조회 테스트
    console.log('3. 그룹 목록 조회 테스트...');
    try {
      const listResponse = await axios.get(`${BASE_URL}/groups`);
      console.log('✅ 그룹 목록 조회 성공');
      console.log(`총 ${listResponse.data.groups.length}개의 그룹이 있습니다.`);
      if (listResponse.data.groups.length > 0) {
        console.log('첫 번째 그룹:', listResponse.data.groups[0]);
        const groupId = listResponse.data.groups[0].id;
      }
    } catch (error) {
      console.log('❌ 그룹 목록 조회 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
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

    console.log('\n' + '='.repeat(50) + '\n');

    // 5. 특정 그룹 조회 테스트
    console.log('5. 특정 그룹 조회 테스트...');
    try {
      const listResponse = await axios.get(`${BASE_URL}/groups`);
      if (listResponse.data.groups.length > 0) {
        const groupId = listResponse.data.groups[0].id;
        
        const detailResponse = await axios.get(`${BASE_URL}/groups/${groupId}`);
        console.log('✅ 그룹 상세 조회 성공');
        console.log('그룹 정보:', detailResponse.data.group);
        console.log('멤버 수:', detailResponse.data.group.members.length);
      }
    } catch (error) {
      console.log('❌ 그룹 상세 조회 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 6. 내가 참여한 그룹 목록 테스트
    console.log('6. 내가 참여한 그룹 목록 테스트...');
    try {
      const myGroupsResponse = await axios.get(`${BASE_URL}/groups/my-groups`, {
        headers: { Authorization: `Bearer ${userTokens[1]}` } // 사용자2 (참여한 사용자)
      });
      console.log('✅ 내 그룹 목록 조회 성공');
      console.log(`참여한 그룹 수: ${myGroupsResponse.data.groups.length}`);
    } catch (error) {
      console.log('❌ 내 그룹 목록 조회 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 7. 내가 생성한 그룹 목록 테스트
    console.log('7. 내가 생성한 그룹 목록 테스트...');
    try {
      const myCreatedResponse = await axios.get(`${BASE_URL}/groups/my-created`, {
        headers: { Authorization: `Bearer ${userTokens[0]}` } // 사용자1 (그룹 생성자)
      });
      console.log('✅ 내가 생성한 그룹 목록 조회 성공');
      console.log(`생성한 그룹 수: ${myCreatedResponse.data.groups.length}`);
    } catch (error) {
      console.log('❌ 내가 생성한 그룹 목록 조회 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 8. 그룹 수정 테스트
    console.log('8. 그룹 수정 테스트...');
    try {
      const myCreatedResponse = await axios.get(`${BASE_URL}/groups/my-created`, {
        headers: { Authorization: `Bearer ${userTokens[0]}` } // 사용자1 (그룹 생성자)
      });
      console.log('내가 생성한 그룹 수:', myCreatedResponse.data.groups.length);
      if (myCreatedResponse.data.groups.length > 0) {
        const groupId = myCreatedResponse.data.groups[0].id;
        console.log('수정할 그룹 ID:', groupId);
        
        const updateData = {
          title: '수정이가 누구야',
          description: '수정이가 누구냐고'
        };
        
        const updateResponse = await axios.put(`${BASE_URL}/groups/${groupId}`, updateData, {
          headers: { Authorization: `Bearer ${userTokens[0]}` } // 사용자1 (그룹 생성자)
        });
        console.log('✅ 그룹 수정 성공:', updateResponse.data.message);
      } else {
        console.log('⚠️  수정할 그룹이 없습니다.');
      }
    } catch (error) {
      console.log('❌ 그룹 수정 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 9. 그룹 탈퇴 테스트
    console.log('9. 그룹 탈퇴 테스트...');
    try {
      const myGroupsResponse = await axios.get(`${BASE_URL}/groups/my-groups`, {
        headers: { Authorization: `Bearer ${userTokens[1]}` } // 사용자2 (참여한 사용자)
      });
      console.log('내가 참여한 그룹 수:', myGroupsResponse.data.groups.length);
      if (myGroupsResponse.data.groups.length > 0) {
        const groupId = myGroupsResponse.data.groups[0].id;
        console.log('탈퇴할 그룹 ID:', groupId);
        
        const leaveResponse = await axios.post(`${BASE_URL}/groups/${groupId}/leave`, {}, {
          headers: { Authorization: `Bearer ${userTokens[1]}` } // 사용자2 (참여한 사용자)
        });
        console.log('✅ 그룹 탈퇴 성공:', leaveResponse.data.message);
      } else {
        console.log('⚠️  탈퇴할 그룹이 없습니다.');
      }
    } catch (error) {
      console.log('❌ 그룹 탈퇴 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 10. 권한 테스트 - 인증 없이 그룹 생성 시도
    console.log('10. 권한 테스트 - 인증 없이 그룹 생성 시도...');
    try {
      const unauthorizedResponse = await axios.post(`${BASE_URL}/groups`, {
        title: '권한 없는 그룹',
        menu: '치킨',
        location: '홍대',
        meeting_time: '2024-01-20 20:00:00'
      });
      console.log('❌ 권한 테스트 실패: 인증 없이 그룹 생성이 성공했습니다.');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ 권한 테스트 성공: 인증 없이 그룹 생성이 차단되었습니다.');
      } else {
        console.log('⚠️  권한 테스트 예상과 다른 오류:', (error.response && error.response.data && error.response.data.error) || error.message);
      }
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 11. 권한 테스트 - 다른 사용자의 그룹 수정 시도
    console.log('11. 권한 테스트 - 다른 사용자의 그룹 수정 시도...');
    try {
      const listResponse = await axios.get(`${BASE_URL}/groups`);
      if (listResponse.data.groups.length > 0) {
        const groupId = listResponse.data.groups[0].id;
        
        const unauthorizedUpdateResponse = await axios.put(`${BASE_URL}/groups/${groupId}`, {
          title: '무단 수정 시도'
        }, {
          headers: { Authorization: `Bearer ${userTokens[2]}` } // 사용자3의 토큰
        });
        console.log('❌ 권한 테스트 실패: 다른 사용자의 그룹 수정이 성공했습니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ 권한 테스트 성공: 다른 사용자의 그룹 수정이 차단되었습니다.');
      } else {
        console.log('⚠️  권한 테스트 예상과 다른 오류:', (error.response && error.response.data && error.response.data.error) || error.message);
      }
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 12. 권한 테스트 - 중복 참여 시도 (가입 상태 보장 후 즉시 재시도)
    console.log('12. 권한 테스트 - 중복 참여 시도...');
    try {
      const listResponse = await axios.get(`${BASE_URL}/groups`);
      if (listResponse.data.groups.length > 0) {
        const groupId = listResponse.data.groups[0].id;

        // 현재 사용자2가 해당 그룹에 참여 중인지 확인
        const myGroupsBefore = await axios.get(`${BASE_URL}/groups/my-groups`, {
          headers: { Authorization: `Bearer ${userTokens[1]}` }
        });
        const isMember = (myGroupsBefore.data.groups || []).some(g => g.id === groupId);

        // 참여 중이 아니면 먼저 참여시켜 가입 상태를 만든다
        if (!isMember) {
          try {
            await axios.post(`${BASE_URL}/groups/${groupId}/join`, {}, {
              headers: { Authorization: `Bearer ${userTokens[1]}` }
            });
            console.log('중복 테스트를 위해 사전 참여 완료');
          } catch (e) {
            // 이미 참여 상태면 무시(400)하고 진행
          }
        }

        // 즉시 동일 그룹에 재참여 시도 -> 400 이어야 함
        await axios.post(`${BASE_URL}/groups/${groupId}/join`, {}, {
          headers: { Authorization: `Bearer ${userTokens[1]}` }
        });
        console.log('❌ 권한 테스트 실패: 중복 참여가 성공했습니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ 권한 테스트 성공: 중복 참여가 차단되었습니다.');
      } else {
        console.log('⚠️  권한 테스트 예상과 다른 오류:', (error.response && error.response.data && error.response.data.error) || error.message);
      }
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 13. 권한 테스트 - 참여하지 않은 그룹 탈퇴 시도
    console.log('13. 권한 테스트 - 참여하지 않은 그룹 탈퇴 시도...');
    try {
      const listResponse = await axios.get(`${BASE_URL}/groups`);
      if (listResponse.data.groups.length > 0) {
        const groupId = listResponse.data.groups[0].id;
        
        // 사용자3이 참여하지 않은 그룹에서 탈퇴 시도
        const unauthorizedLeaveResponse = await axios.post(`${BASE_URL}/groups/${groupId}/leave`, {}, {
          headers: { Authorization: `Bearer ${userTokens[2]}` }
        });
        console.log('❌ 권한 테스트 실패: 참여하지 않은 그룹 탈퇴가 성공했습니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ 권한 테스트 성공: 참여하지 않은 그룹 탈퇴가 차단되었습니다.');
      } else {
        console.log('⚠️  권한 테스트 예상과 다른 오류:', (error.response && error.response.data && error.response.data.error) || error.message);
      }
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 14. 공개 API 테스트 - 인증 없이 그룹 목록 조회
    console.log('14. 공개 API 테스트 - 인증 없이 그룹 목록 조회...');
    try {
      const publicResponse = await axios.get(`${BASE_URL}/groups`);
      console.log('✅ 공개 API 테스트 성공: 인증 없이 그룹 목록 조회 가능');
      console.log(`조회된 그룹 수: ${publicResponse.data.groups.length}`);
    } catch (error) {
      console.log('❌ 공개 API 테스트 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 15. 검색 및 필터링 테스트
    console.log('15. 검색 및 필터링 테스트...');
    try {
      // 메뉴별 검색
      const menuSearchResponse = await axios.get(`${BASE_URL}/groups?menu=${encodeURIComponent('삼겹살')}`);
      console.log('✅ 메뉴별 검색 성공:', menuSearchResponse.data.groups.length, '개 그룹');
      
      // 위치별 검색
      const locationSearchResponse = await axios.get(`${BASE_URL}/groups?location=${encodeURIComponent('강남')}`);
      console.log('✅ 위치별 검색 성공:', locationSearchResponse.data.groups.length, '개 그룹');
      
      // 제목 검색
      const titleSearchResponse = await axios.get(`${BASE_URL}/groups?search=${encodeURIComponent('삼겹살')}`);
      console.log('✅ 제목 검색 성공:', titleSearchResponse.data.groups.length, '개 그룹');
    } catch (error) {
      console.log('❌ 검색 테스트 실패:', (error.response && error.response.data && error.response.data.error) || error.message);
    }

    console.log('\n🎉 그룹 API 테스트 완료!');

  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error.message);
  }
}

// axios 설치 확인
try {
  require('axios');
  testGroupsAPI();
} catch (error) {
  console.log('axios가 설치되지 않았습니다. 설치 중...');
  const { exec } = require('child_process');
  exec('npm install axios', (err, stdout, stderr) => {
    if (err) {
      console.error('axios 설치 실패:', err);
      return;
    }
    console.log('axios 설치 완료. 테스트를 다시 실행합니다.');
    testGroupsAPI();
  });
}
