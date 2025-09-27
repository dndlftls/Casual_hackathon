const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { db, initDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const host = 'localhost';
const JWT_SECRET = process.env.JWT_SECRET || 'babchingu_secret_key_2024';

// CORS 설정 (외부 프론트엔드용)
const corsOptions = {
  origin: true, // 요청 Origin을 그대로 반영 (Credentials 사용 시 자동으로 Origin 에코)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// 데이터베이스 초기화
initDatabase();

// JWT 토큰 검증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '액세스 토큰이 필요합니다.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
    }
    req.user = user;
    next();
  });
};

// 회원가입 API
app.post('/api/auth/register', [
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.'),
  body('nickname').notEmpty().withMessage('닉네임을 입력해주세요.')
], async (req, res) => {
  try {
    // 입력값 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '입력값이 올바르지 않습니다.',
        details: errors.array()
      });
    }

    const { email, password, nickname, age, gender, location } = req.body;

    // 이메일 중복 확인
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: '데이터베이스 오류가 발생했습니다.' });
      }
      
      if (row) {
        return res.status(400).json({ error: '이미 사용 중인 이메일입니다.' });
      }

      try {
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 생성
        db.run(
          'INSERT INTO users (email, password, nickname, age, gender, location) VALUES (?, ?, ?, ?, ?, ?)',
          [email, hashedPassword, nickname, age, gender, location],
          function(err) {
            if (err) {
              return res.status(500).json({ error: '사용자 생성 중 오류가 발생했습니다.' });
            }

            // JWT 토큰 생성
            const token = jwt.sign(
              { id: this.lastID, email, nickname },
              JWT_SECRET,
              { expiresIn: '24h' }
            );

            res.status(201).json({
              message: '회원가입이 완료되었습니다.',
              token,
              user: {
                id: this.lastID,
                email,
                nickname,
                age,
                gender,
                location
              }
            });
          }
        );
      } catch (error) {
        res.status(500).json({ error: '비밀번호 처리 중 오류가 발생했습니다.' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 로그인 API
app.post('/api/auth/login', [
  body('email').isEmail().withMessage('유효한 이메일을 입력해주세요.'),
  body('password').notEmpty().withMessage('비밀번호를 입력해주세요.')
], async (req, res) => {
  try {
    // 입력값 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '입력값이 올바르지 않습니다.',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // 사용자 조회
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: '데이터베이스 오류가 발생했습니다.' });
      }

      if (!user) {
        return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      try {
        // 비밀번호 확인
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
          return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        // JWT 토큰 생성
        const token = jwt.sign(
          { id: user.id, email: user.email, nickname: user.nickname },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          message: '로그인이 완료되었습니다.',
          token,
          user: {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            age: user.age,
            gender: user.gender,
            location: user.location
          }
        });
      } catch (error) {
        res.status(500).json({ error: '비밀번호 확인 중 오류가 발생했습니다.' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 사용자 정보 조회 API
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.get('SELECT id, email, nickname, age, gender, location, created_at FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: '데이터베이스 오류가 발생했습니다.' });
    }

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    res.json({ user });
  });
});

// 사용자 정보 수정 API
app.put('/api/user/profile', authenticateToken, [
  body('nickname').optional().notEmpty().withMessage('닉네임을 입력해주세요.'),
  body('age').optional().isInt({ min: 1, max: 100 }).withMessage('나이는 1-100 사이의 숫자여야 합니다.'),
  body('gender').optional().isIn(['male', 'female', 'other']).withMessage('성별은 male, female, other 중 하나여야 합니다.')
], (req, res) => {
  try {
    // 입력값 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '입력값이 올바르지 않습니다.',
        details: errors.array()
      });
    }

    const userId = req.user.id;
    const { nickname, age, gender, location } = req.body;

    // 업데이트할 필드만 포함하여 동적 쿼리 생성
    const updates = [];
    const values = [];
    
    if (nickname !== undefined) {
      updates.push('nickname = ?');
      values.push(nickname);
    }
    if (age !== undefined) {
      updates.push('age = ?');
      values.push(age);
    }
    if (gender !== undefined) {
      updates.push('gender = ?');
      values.push(gender);
    }
    if (location !== undefined) {
      updates.push('location = ?');
      values.push(location);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: '수정할 정보를 입력해주세요.' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    db.run(sql, values, function(err) {
      if (err) {
        return res.status(500).json({ error: '사용자 정보 수정 중 오류가 발생했습니다.' });
      }

      res.json({ message: '사용자 정보가 수정되었습니다.' });
    });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 토큰 검증 API
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      id: req.user.id,
      email: req.user.email,
      nickname: req.user.nickname
    }
  });
});

// ==================== 그룹 관련 API ====================

// 그룹 생성 API
app.post('/api/groups', authenticateToken, [
  body('title').notEmpty().withMessage('그룹 제목을 입력해주세요.'),
  body('menu').notEmpty().withMessage('메뉴를 입력해주세요.'),
  body('location').notEmpty().withMessage('위치를 입력해주세요.'),
  body('meeting_time').notEmpty().withMessage('만남 시간을 입력해주세요.'),
  body('max_members').optional().isInt({ min: 2, max: 8 }).withMessage('최대 인원은 2-8명 사이여야 합니다.')
], (req, res) => {
  try {
    // 입력값 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '입력값이 올바르지 않습니다.',
        details: errors.array()
      });
    }

    const { title, menu, location, meeting_time, max_members = 4, description } = req.body;
    const creator_id = req.user.id;

    // 그룹 생성
    db.run(
      'INSERT INTO groups (title, menu, location, max_members, creator_id, meeting_time, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, menu, location, max_members, creator_id, meeting_time, description],
      function(err) {
        if (err) {
          return res.status(500).json({ error: '그룹 생성 중 오류가 발생했습니다.' });
        }

        const groupId = this.lastID;

        // 그룹 생성자를 멤버로 추가
        db.run(
          'INSERT INTO group_members (group_id, user_id) VALUES (?, ?)',
          [groupId, creator_id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: '그룹 멤버 추가 중 오류가 발생했습니다.' });
            }

            res.status(201).json({
              message: '그룹이 생성되었습니다.',
              group: {
                id: groupId,
                title,
                menu,
                location,
                max_members,
                current_members: 1,
                creator_id,
                meeting_time,
                description,
                status: 'active'
              }
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 그룹 목록 조회 API (검색 및 필터링)
app.get('/api/groups', (req, res) => {
  try {
    const { search, menu, location, status = 'active', limit = 20, offset = 0 } = req.query;
    
    let sql = `
      SELECT g.*, u.nickname as creator_nickname,
             (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id AND gm.status = 'active') as current_members
      FROM groups g
      JOIN users u ON g.creator_id = u.id
      WHERE g.status = ?
    `;
    
    const params = [status];
    
    // 검색 조건 추가
    if (search) {
      sql += ` AND (g.title LIKE ? OR g.menu LIKE ? OR g.description LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (menu) {
      sql += ` AND g.menu LIKE ?`;
      params.push(`%${menu}%`);
    }
    
    if (location) {
      sql += ` AND g.location LIKE ?`;
      params.push(`%${location}%`);
    }
    
    sql += ` ORDER BY g.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    db.all(sql, params, (err, groups) => {
      if (err) {
        return res.status(500).json({ error: '그룹 목록 조회 중 오류가 발생했습니다.' });
      }

      res.json({ groups });
    });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 특정 그룹 조회 API (id는 숫자만 허용)
app.get('/api/groups/:id(\\d+)', (req, res) => {
  try {
    const groupId = req.params.id;

    db.get(`
      SELECT g.*, u.nickname as creator_nickname,
             (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id AND gm.status = 'active') as current_members
      FROM groups g
      JOIN users u ON g.creator_id = u.id
      WHERE g.id = ?
    `, [groupId], (err, group) => {
      if (err) {
        return res.status(500).json({ error: '그룹 조회 중 오류가 발생했습니다.' });
      }

      if (!group) {
        return res.status(404).json({ error: '그룹을 찾을 수 없습니다.' });
      }

      // 그룹 멤버 목록 조회
      db.all(`
        SELECT u.id, u.nickname, u.age, u.gender, u.location, gm.joined_at
        FROM group_members gm
        JOIN users u ON gm.user_id = u.id
        WHERE gm.group_id = ? AND gm.status = 'active'
        ORDER BY gm.joined_at ASC
      `, [groupId], (err, members) => {
        if (err) {
          return res.status(500).json({ error: '그룹 멤버 조회 중 오류가 발생했습니다.' });
        }

        res.json({ 
          group: {
            ...group,
            members
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 그룹 참여 API (id는 숫자만 허용)
app.post('/api/groups/:id(\\d+)/join', authenticateToken, (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;

    // 그룹 존재 여부 및 상태 확인
    db.get('SELECT * FROM groups WHERE id = ? AND status = "active"', [groupId], (err, group) => {
      if (err) {
        return res.status(500).json({ error: '그룹 조회 중 오류가 발생했습니다.' });
      }

      if (!group) {
        return res.status(404).json({ error: '그룹을 찾을 수 없거나 비활성 상태입니다.' });
      }

      // 이미 참여했는지 확인
      db.get('SELECT * FROM group_members WHERE group_id = ? AND user_id = ?', [groupId, userId], (err, existingMember) => {
        if (err) {
          return res.status(500).json({ error: '멤버 확인 중 오류가 발생했습니다.' });
        }

        if (existingMember) {
          if (existingMember.status === 'active') {
            return res.status(400).json({ error: '이미 참여 중인 그룹입니다.' });
          } else {
            // 비활성 상태라면 다시 활성화
            db.run('UPDATE group_members SET status = "active", joined_at = CURRENT_TIMESTAMP WHERE group_id = ? AND user_id = ?', [groupId, userId], (err) => {
              if (err) {
                return res.status(500).json({ error: '그룹 재참여 중 오류가 발생했습니다.' });
              }
              res.json({ message: '그룹에 다시 참여했습니다.' });
            });
            return;
          }
        }

        // 현재 멤버 수 확인
        db.get('SELECT COUNT(*) as count FROM group_members WHERE group_id = ? AND status = "active"', [groupId], (err, result) => {
          if (err) {
            return res.status(500).json({ error: '멤버 수 확인 중 오류가 발생했습니다.' });
          }

          if (result.count >= group.max_members) {
            return res.status(400).json({ error: '그룹이 가득 찼습니다.' });
          }

          // 그룹 참여
          db.run('INSERT INTO group_members (group_id, user_id) VALUES (?, ?)', [groupId, userId], (err) => {
            if (err) {
              return res.status(500).json({ error: '그룹 참여 중 오류가 발생했습니다.' });
            }

            // 그룹의 현재 멤버 수 업데이트
            db.run('UPDATE groups SET current_members = current_members + 1 WHERE id = ?', [groupId], (err) => {
              if (err) {
                console.error('멤버 수 업데이트 오류:', err);
              }
            });

            res.json({ message: '그룹에 참여했습니다.' });
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 그룹 탈퇴 API (id는 숫자만 허용)
app.post('/api/groups/:id(\\d+)/leave', authenticateToken, (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;

    // 그룹 참여 여부 확인
    db.get('SELECT * FROM group_members WHERE group_id = ? AND user_id = ? AND status = "active"', [groupId, userId], (err, member) => {
      if (err) {
        return res.status(500).json({ error: '멤버 확인 중 오류가 발생했습니다.' });
      }

      if (!member) {
        return res.status(404).json({ error: '참여 중인 그룹이 아닙니다.' });
      }

      // 그룹 탈퇴
      db.run('UPDATE group_members SET status = "inactive" WHERE group_id = ? AND user_id = ?', [groupId, userId], (err) => {
        if (err) {
          return res.status(500).json({ error: '그룹 탈퇴 중 오류가 발생했습니다.' });
        }

        // 그룹의 현재 멤버 수 업데이트
        db.run('UPDATE groups SET current_members = current_members - 1 WHERE id = ?', [groupId], (err) => {
          if (err) {
            console.error('멤버 수 업데이트 오류:', err);
          }
        });

        res.json({ message: '그룹에서 탈퇴했습니다.' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 내가 참여한 그룹 목록 API
app.get('/api/groups/my-groups', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    console.log('내 그룹 목록 조회 - 사용자 ID:', userId);

    db.all(`
      SELECT g.*, u.nickname as creator_nickname,
             (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id AND gm.status = 'active') as current_members
      FROM groups g
      JOIN users u ON g.creator_id = u.id
      JOIN group_members gm ON g.id = gm.group_id
      WHERE gm.user_id = ? AND gm.status = 'active' AND g.status = 'active'
      ORDER BY g.meeting_time ASC
    `, [userId], (err, groups) => {
      if (err) {
        console.error('내 그룹 목록 조회 SQL 오류:', err);
        return res.status(500).json({ error: '내 그룹 목록 조회 중 오류가 발생했습니다.' });
      }

      console.log('내 그룹 목록 조회 결과:', groups ? groups.length : 0, '개');
      if (groups && groups.length > 0) {
        console.log('첫 번째 그룹 ID:', groups[0].id);
      }

      // 그룹이 없어도 빈 배열로 응답
      res.json({ groups: groups || [] });
    });
  } catch (error) {
    console.error('내 그룹 목록 조회 예외:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 내가 생성한 그룹 목록 API
app.get('/api/groups/my-created', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    console.log('내가 생성한 그룹 목록 조회 - 사용자 ID:', userId);

    db.all(`
      SELECT g.*, u.nickname as creator_nickname,
             (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id AND gm.status = 'active') as current_members
      FROM groups g
      JOIN users u ON g.creator_id = u.id
      WHERE g.creator_id = ? AND g.status = 'active'
      ORDER BY g.created_at DESC
    `, [userId], (err, groups) => {
      if (err) {
        console.error('내가 생성한 그룹 목록 조회 SQL 오류:', err);
        return res.status(500).json({ error: '내가 생성한 그룹 목록 조회 중 오류가 발생했습니다.' });
      }

      console.log('내가 생성한 그룹 목록 조회 결과:', groups ? groups.length : 0, '개');
      if (groups && groups.length > 0) {
        console.log('첫 번째 그룹 ID:', groups[0].id);
      }

      // 그룹이 없어도 빈 배열로 응답
      res.json({ groups: groups || [] });
    });
  } catch (error) {
    console.error('내가 생성한 그룹 목록 조회 예외:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 그룹 수정 API (생성자만 가능, id는 숫자만 허용)
app.put('/api/groups/:id(\\d+)', authenticateToken, [
  body('title').optional().notEmpty().withMessage('그룹 제목을 입력해주세요.'),
  body('menu').optional().notEmpty().withMessage('메뉴를 입력해주세요.'),
  body('location').optional().notEmpty().withMessage('위치를 입력해주세요.'),
  body('meeting_time').optional().notEmpty().withMessage('만남 시간을 입력해주세요.'),
  body('max_members').optional().isInt({ min: 2, max: 8 }).withMessage('최대 인원은 2-8명 사이여야 합니다.')
], (req, res) => {
  try {
    // 입력값 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: '입력값이 올바르지 않습니다.',
        details: errors.array()
      });
    }

    const groupId = req.params.id;
    const userId = req.user.id;

    // 그룹 존재 여부 및 생성자 확인
    db.get('SELECT * FROM groups WHERE id = ? AND creator_id = ?', [groupId, userId], (err, group) => {
      if (err) {
        return res.status(500).json({ error: '그룹 조회 중 오류가 발생했습니다.' });
      }

      if (!group) {
        return res.status(404).json({ error: '그룹을 찾을 수 없거나 수정 권한이 없습니다.' });
      }

      const { title, menu, location, meeting_time, max_members, description } = req.body;

      // 업데이트할 필드만 포함하여 동적 쿼리 생성
      const updates = [];
      const values = [];
      
      if (title !== undefined) {
        updates.push('title = ?');
        values.push(title);
      }
      if (menu !== undefined) {
        updates.push('menu = ?');
        values.push(menu);
      }
      if (location !== undefined) {
        updates.push('location = ?');
        values.push(location);
      }
      if (meeting_time !== undefined) {
        updates.push('meeting_time = ?');
        values.push(meeting_time);
      }
      if (max_members !== undefined) {
        updates.push('max_members = ?');
        values.push(max_members);
      }
      if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: '수정할 정보를 입력해주세요.' });
      }

      values.push(groupId);

      const sql = `UPDATE groups SET ${updates.join(', ')} WHERE id = ?`;

      db.run(sql, values, function(err) {
        if (err) {
          return res.status(500).json({ error: '그룹 수정 중 오류가 발생했습니다.' });
        }

        res.json({ message: '그룹 정보가 수정되었습니다.' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 그룹 삭제 API (생성자만 가능, id는 숫자만 허용)
app.delete('/api/groups/:id(\\d+)', authenticateToken, (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;

    // 그룹 존재 여부 및 생성자 확인
    db.get('SELECT * FROM groups WHERE id = ? AND creator_id = ?', [groupId, userId], (err, group) => {
      if (err) {
        return res.status(500).json({ error: '그룹 조회 중 오류가 발생했습니다.' });
      }

      if (!group) {
        return res.status(404).json({ error: '그룹을 찾을 수 없거나 삭제 권한이 없습니다.' });
      }

      // 그룹 상태를 비활성으로 변경 (소프트 삭제)
      db.run('UPDATE groups SET status = "inactive" WHERE id = ?', [groupId], (err) => {
        if (err) {
          return res.status(500).json({ error: '그룹 삭제 중 오류가 발생했습니다.' });
        }

        res.json({ message: '그룹이 삭제되었습니다.' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`밥친구 백엔드 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`API 엔드포인트: http://localhost:${PORT}/api`);
});

// 에러 핸들링
process.on('uncaughtException', (err) => {
  console.error('처리되지 않은 예외:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('처리되지 않은 Promise 거부:', reason);
});
