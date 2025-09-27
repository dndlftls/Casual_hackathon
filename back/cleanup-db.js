const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'babchingu.db');
const isWipeAllRequested = process.argv.includes('--all');
const isConfirmed = process.env.CONFIRM === 'true' || process.argv.includes('--yes');

function logResult(actionLabel, err, changes) {
  if (err) {
    console.error(`${actionLabel} 실패:`, err.message);
  } else {
    console.log(`${actionLabel} 완료: ${changes} rows`);
  }
}

function deleteWith(db, sql, params, label) {
  return new Promise((resolve) => {
    db.run(sql, params, function onRun(err) {
      logResult(label, err, this && this.changes ? this.changes : 0);
      resolve();
    });
  });
}

async function cleanup() {
  const db = new sqlite3.Database(dbPath);

  await new Promise((resolve) => db.serialize(resolve));

  console.log('=== 테스트 데이터 정리 시작 ===');
  console.log(`DB: ${dbPath}`);

  if (isWipeAllRequested) {
    if (!isConfirmed) {
      console.log('전체 삭제는 보호 장치가 필요합니다. 실행 예시: CONFIRM=true node cleanup-db.js --all');
      db.close();
      return;
    }
    console.log('[주의] 전체 데이터 삭제 모드 (--all)');
    await deleteWith(db, 'DELETE FROM group_members', [], 'group_members 전체 삭제');
    await deleteWith(db, 'DELETE FROM groups', [], 'groups 전체 삭제');
    await deleteWith(db, 'DELETE FROM users', [], 'users 전체 삭제');
  } else {
    // 테스트에서 사용하는 고정 사용자/그룹 정리
    const testEmails = ['user1@example.com', 'user2@example.com', 'user3@example.com'];

    // 1) 테스트 사용자들이 만든/참여한 멤버십 정리
    await deleteWith(
      db,
      `DELETE FROM group_members
       WHERE user_id IN (SELECT id FROM users WHERE email IN (${testEmails.map(() => '?').join(',')}))
          OR group_id IN (
            SELECT id FROM groups WHERE creator_id IN (
              SELECT id FROM users WHERE email IN (${testEmails.map(() => '?').join(',')})
            )
          )`,
      [...testEmails, ...testEmails],
      'group_members 테스트 데이터 삭제'
    );

    // 2) 테스트 사용자가 생성한 그룹 정리 (타이틀로 보조 정리도 함께)
    await deleteWith(
      db,
      `DELETE FROM groups
       WHERE creator_id IN (SELECT id FROM users WHERE email IN (${testEmails.map(() => '?').join(',')}))
          OR title = ?`,
      [...testEmails, '삼겹살 먹으러 가요!'],
      'groups 테스트 데이터 삭제'
    );

    // 3) 테스트 사용자 정리
    await deleteWith(
      db,
      `DELETE FROM users WHERE email IN (${testEmails.map(() => '?').join(',')})`,
      testEmails,
      'users 테스트 데이터 삭제'
    );
  }

  console.log('=== 테스트 데이터 정리 완료 ===');
  db.close();
}

cleanup().catch((err) => {
  console.error('정리 작업 중 오류:', err);
  process.exit(1);
});


