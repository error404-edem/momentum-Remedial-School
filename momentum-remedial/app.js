// =====================
// 📁 momentum-remedial/
// =====================

// app.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'momentum_secret_key',
    resave: false,
    saveUninitialized: true
}));

const USER = {
    username: 'momentumadmin',
    password: 'momentum123'
};

app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === USER.username && password === USER.password) {
        req.session.auth = true;
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Invalid credentials' });
    }
});

app.get('/dashboard', (req, res) => {
    if (!req.session.auth) return res.redirect('/login');
    const students = JSON.parse(fs.readFileSync('./data/students.json', 'utf-8'));
    res.render('dashboard', { students });
});

app.get('/register', (req, res) => {
    if (!req.session.auth) return res.redirect('/login');
    res.render('register');
});

app.post('/register', (req, res) => {
    const { name, age, classLevel } = req.body;
    const students = JSON.parse(fs.readFileSync('./data/students.json', 'utf-8'));
    students.push({ name, age, classLevel });
    fs.writeFileSync('./data/students.json', JSON.stringify(students, null, 2));
    res.redirect('/dashboard');
});

app.listen(PORT, () => {
    console.log(`Momentum Remedial School app is running on http://localhost:${PORT}`);
});
