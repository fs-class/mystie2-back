require('dotenv').config();

const express = require('express');
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
app.use(session({secret: 'haha', cookie: {maxAge: 60000}, resave: true, saveUninitialized: true}))

app.use((req, res, next)=> {
    res.locals.user_id = "";
    res.locals.name = "";

    if (req.session.member) {
        res.locals.user_id = req.session.member.user_id
        res.locals.name = req.session.member.name
    }
    next()
})


const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
});

// 라우팅
app.get('/', (req, res) => {

    console.log(req.session.member)

    res.render('index') // ./views/index.ejs
})

// app.get('/contact', (req, res) => {
//     res.render('contact')
// })

app.post('/contactProc', async (req, res) => {
    const { name, phone, email, memo } = req.body;
    
    let conn;
    try {
        conn = await pool.getConnection();
        const sql = `INSERT INTO contact (name, phone, email, memo, regdate) VALUES (?, ?, ?, ?, NOW())`;
        await conn.query(sql, [name, phone, email, memo]);

        res.send("<script>alert('문의사항이 등록되었습니다.'); location.href='/';</script>");
    } catch (err) {
        console.error(err);
        res.status(500).send("<script>alert('오류가 발생했습니다.'); location.href='/';</script>");
    } finally {
        if (conn) conn.release();
    }
});


function isLoggedIn(req, res, next) {
    if (req.session.member) {
        next(); // 로그인된 상태 → 다음 미들웨어/라우트 실행
    } else {
        res.send("<script>alert('로그인이 필요합니다.'); location.href='/';</script>");
    }
}

app.get('/contactList', isLoggedIn, async (req, res) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const sql = `SELECT * FROM contact ORDER BY idx DESC`;
        const results = await conn.query(sql);

        res.render('contactList', { contacts: results }); // ejs로 전달
    } catch (err) {
        console.error('DB 조회 오류:', err);
        res.status(500).send('DB 조회 중 오류 발생');
    } finally {
        if (conn) conn.release();
    }
});

app.get('/contactDelete', async (req, res) => {
    const idx = req.query.idx;
    let conn;

    try {
        conn = await pool.getConnection();

        const sql = `DELETE FROM contact WHERE idx = ?`;
        await conn.query(sql, [idx]);

        res.send("<script>alert('삭제되었습니다.'); location.href='/contactList';</script>");
    } catch (err) {
        console.error('DB 삭제 오류:', err);
        res.status(500).send("<script>alert('삭제 중 오류가 발생했습니다.'); location.href='/contactList';</script>");
    } finally {
        if (conn) conn.release();
    }
});


app.get('/login', (req, res) => {
    res.render('/')
})

app.post('/loginProc', async (req, res) => {
    const { user_id, pw } = req.body;

    let conn;
    try {
        conn = await pool.getConnection();

        const sql = `SELECT * FROM member WHERE user_id = ? AND pw = ?`;
        const result = await conn.query(sql, [user_id, pw]);

        if (result.length > 0) {
            // 로그인 성공
            console.log(result[0])

            req.session.member = result[0]

            res.send("<script>alert('로그인 되었습니다.'); location.href='/';</script>");
        } else {
            // 로그인 실패
            res.send("<script>alert('아이디 또는 비밀번호가 틀렸습니다.'); location.href='/';</script>");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("<script>alert('오류가 발생했습니다.'); location.href='/';</script>");
    } finally {
        if (conn) conn.release();
    }
});

app.get('/logout', async (req, res) => {
    req.session.member = null
    res.send("<script> alert('로그아웃 되었습니다.'); location.href='/'; </script>")
});



app.listen(port, () => {
    console.log(`서버가 실행되었습니다. 접속 주소: http://localhost:${port}`)
})
