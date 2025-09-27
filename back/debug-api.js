const axios = require('axios');

async function debugAPI() {
  try {
    console.log('🔍 API 디버깅 시작\n');

    // 1. 사용자2 로그인
    console.log('1. 사용자2 로그인...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'user2@example.com',
      password: 'password123'
    });
    console.log('✅ 로그인 성공');
    console.log('토큰:', loginResponse.data.token.substring(0, 20) + '...');
    console.log('사용자 ID:', loginResponse.data.user.id);
    
    const token = loginResponse.data.token;
    const userId = loginResponse.data.user.id;

    console.log('\n' + '='.repeat(50) + '\n');

    // 2. 내 그룹 목록 조회
    console.log('2. 내 그룹 목록 조회...');
    try {
      const myGroupsResponse = await axios.get('http://localhost:3001/api/groups/my-groups', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ 내 그룹 목록 조회 성공');
      console.log('그룹 수:', myGroupsResponse.data.groups.length);
      if (myGroupsResponse.data.groups.length > 0) {
        console.log('첫 번째 그룹:', myGroupsResponse.data.groups[0]);
      }
    } catch (error) {
      console.log('❌ 내 그룹 목록 조회 실패');
      console.log('상태 코드:', error.response ? error.response.status : 'N/A');
      console.log('에러 메시지:', error.response && error.response.data ? error.response.data.error : error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 3. 사용자1 로그인 (그룹 생성자)
    console.log('3. 사용자1 로그인 (그룹 생성자)...');
    const loginResponse2 = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'user1@example.com',
      password: 'password123'
    });
    console.log('✅ 로그인 성공');
    console.log('토큰:', loginResponse2.data.token.substring(0, 20) + '...');
    console.log('사용자 ID:', loginResponse2.data.user.id);
    
    const token2 = loginResponse2.data.token;
    const userId2 = loginResponse2.data.user.id;

    console.log('\n' + '='.repeat(50) + '\n');

    // 4. 내가 생성한 그룹 목록 조회
    console.log('4. 내가 생성한 그룹 목록 조회...');
    try {
      const myCreatedResponse = await axios.get('http://localhost:3001/api/groups/my-created', {
        headers: { Authorization: `Bearer ${token2}` }
      });
      console.log('✅ 내가 생성한 그룹 목록 조회 성공');
      console.log('그룹 수:', myCreatedResponse.data.groups.length);
      if (myCreatedResponse.data.groups.length > 0) {
        console.log('첫 번째 그룹:', myCreatedResponse.data.groups[0]);
      }
    } catch (error) {
      console.log('❌ 내가 생성한 그룹 목록 조회 실패');
      console.log('상태 코드:', error.response ? error.response.status : 'N/A');
      console.log('에러 메시지:', error.response && error.response.data ? error.response.data.error : error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 5. 데이터베이스 직접 확인
    console.log('5. 데이터베이스 직접 확인...');
    const { exec } = require('child_process');
    
    exec('sqlite3 babchingu.db "SELECT gm.group_id, gm.user_id, gm.status FROM group_members WHERE user_id = 3 AND status = \'active\'"', (err, stdout, stderr) => {
      if (err) {
        console.log('❌ 데이터베이스 조회 실패:', err);
        return;
      }
      console.log('사용자3이 참여한 그룹:', stdout.trim());
    });

    exec('sqlite3 babchingu.db "SELECT id, creator_id, status FROM groups WHERE creator_id = 2 AND status = \'active\'"', (err, stdout, stderr) => {
      if (err) {
        console.log('❌ 데이터베이스 조회 실패:', err);
        return;
      }
      console.log('사용자2가 생성한 그룹:', stdout.trim());
    });

  } catch (error) {
    console.error('❌ 디버깅 중 오류 발생:', error.message);
  }
}

debugAPI();
