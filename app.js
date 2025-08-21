// app.js
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const { Pool } = require('pg');

const app = express();

// ===== EJS / 미들웨어 =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Render(프록시) 환경에서 세션/쿠키 동작 보장
app.set('trust proxy', 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // 배포 시 HTTPS에서만 쿠키
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

// EJS 전역 사용자 정보
app.use((req, res, next) => {
  res.locals.user_id = '';
  res.locals.name = '';
  if (req.session.member) {
    res.locals.user_id = req.session.member.user_id;
    res.locals.name = req.session.member.name;
  }
  next();
});

// ===== PostgreSQL Pool =====
// Render PostgreSQL는 SSL이 필요한 경우가 많아 기본 포함
const pool = new Pool({
  host: process.env.DB_HOST,      // ex) mydb-postgres.render.com
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.DB_SSL?.toLowerCase() === 'false'
      ? false
      : { rejectUnauthorized: false }, // 필요 없으면 DB_SSL=false 로 끄기
});

// ===== 유틸 =====
function isLoggedIn(req, res, next) {
  if (req.session.member) return next();
  return res.send(
    "<script>alert('로그인이 필요합니다.'); location.href='/login';</script>"
  );
}

// ===== 라우팅 =====
app.get('/', async (req, res) => {
  // 메인
  res.render('index'); // ./views/index.ejs
});

// 로그인 페이지
app.get('/login', (req, res) => {
  res.render('login'); // ./views/login.ejs
});

// 로그인 처리 (평문 비번 예시: 실제 운영은 bcrypt 권장)
app.post('/loginProc', async (req, res) => {
  const { user_id, pw } = req.body;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM member WHERE user_id = $1 AND pw = $2',
      [user_id, pw]
    );

    if (rows.length > 0) {
      req.session.member = rows[0];
      return res.send(
        "<script>alert('로그인 되었습니다.'); location.href='/';</script>"
      );
    }
    return res.send(
      "<script>alert('아이디 또는 비밀번호가 틀렸습니다.'); location.href='/index';</script>"
    );
  } catch (err) {
    console.error('loginProc error:', err);
    return res
      .status(500)
      .send("<script>alert('오류가 발생했습니다.'); location.href='/index';</script>");
  }
});

// 로그아웃
app.get('/logout', (req, res) => {
  req.session.member = null;
  res.send("<script>alert('로그아웃 되었습니다.'); location.href='/';</script>");
});

// 문의 등록
app.post('/contactProc', async (req, res) => {
  const { name, phone, email, memo } = req.body;
  try {
    await pool.query(
      'INSERT INTO contact (name, phone, email, memo, regdate) VALUES ($1, $2, $3, $4, NOW())',
      [name, phone, email, memo]
    );
    res.send(
      "<script>alert('문의사항이 등록되었습니다.'); location.href='/';</script>"
    );
  } catch (err) {
    console.error('contactProc error:', err);
    res
      .status(500)
      .send("<script>alert('오류가 발생했습니다.'); location.href='/';</script>");
  }
});

// 문의 목록 (로그인 필요)
app.get('/contactList', isLoggedIn, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM contact ORDER BY idx DESC'
    );
    res.render('contactList', { contacts: rows });
  } catch (err) {
    console.error('contactList error:', err);
    res.status(500).send('DB 조회 중 오류 발생');
  }
});

// 문의 삭제
app.get('/contactDelete', isLoggedIn, async (req, res) => {
  const idx = req.query.idx;
  try {
    await pool.query('DELETE FROM contact WHERE idx = $1', [idx]);
    res.send(
      "<script>alert('삭제되었습니다.'); location.href='/contactList';</script>"
    );
  } catch (err) {
    console.error('contactDelete error:', err);
    res
      .status(500)
      .send("<script>alert('삭제 중 오류가 발생했습니다.'); location.href='/contactList';</script>");
  }
});

// ===== 서버 시작 =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
