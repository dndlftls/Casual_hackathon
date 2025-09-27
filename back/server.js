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

// 미들웨어 설정
app.use(cors({
  origin: 'https://casual-hackathon.vercel.app', // Next.js 프론트엔드 주소
  credentials: true
}));
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
