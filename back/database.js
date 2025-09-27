const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 데이터베이스 파일 경로
const dbPath = path.join(__dirname, 'babchingu.db');

// 데이터베이스 연결
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('데이터베이스 연결 오류:', err.message);
  } else {
    console.log('SQLite 데이터베이스에 연결되었습니다.');
  }
});

// 사용자 테이블 생성
const createUsersTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.run(sql, (err) => {
    if (err) {
      console.error('사용자 테이블 생성 오류:', err.message);
    } else {
      console.log('사용자 테이블이 생성되었습니다.');
    }
  });
};

// 그룹 테이블 생성
const createGroupsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      menu TEXT NOT NULL,
      location TEXT NOT NULL,
      max_members INTEGER DEFAULT 4,
      current_members INTEGER DEFAULT 1,
      creator_id INTEGER NOT NULL,
      meeting_time DATETIME NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (creator_id) REFERENCES users (id)
    )
  `;
  
  db.run(sql, (err) => {
    if (err) {
      console.error('그룹 테이블 생성 오류:', err.message);
    } else {
      console.log('그룹 테이블이 생성되었습니다.');
    }
  });
};

// 그룹 멤버 테이블 생성
const createGroupMembersTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS group_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'active',
      FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      UNIQUE(group_id, user_id)
    )
  `;
  
  db.run(sql, (err) => {
    if (err) {
      console.error('그룹 멤버 테이블 생성 오류:', err.message);
    } else {
      console.log('그룹 멤버 테이블이 생성되었습니다.');
    }
  });
};

// 그룹 메시지 테이블 생성
const createGroupMessagesTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS group_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `;

  db.run(sql, (err) => {
    if (err) {
      console.error('그룹 메시지 테이블 생성 오류:', err.message);
    } else {
      console.log('그룹 메시지 테이블이 생성되었습니다.');
    }
  });
};

// 데이터베이스 초기화
const initDatabase = () => {
  createUsersTable();
  createGroupsTable();
  createGroupMembersTable();
  createGroupMessagesTable();
};

module.exports = {
  db,
  initDatabase
};
