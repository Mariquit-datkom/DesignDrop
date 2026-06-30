const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const dotenv = require('dotenv');
const path = require('path');
const flash = require('connect-flash');
const favicon = require('serve-favicon');

dotenv.config();

const app = express();
const db = require('./config/db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(path.join(__dirname, 'public', 'assets', 'icon', 'logo_x32.ico')));

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

app.use(session({
  key: 'designdrop_session',
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/seller'));

app.get('/', (req, res) => {
    res.send('🎨 DesignDrop is live!');
});

app.use((req, res) => {
    res.status(404).render('errors/404');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 DesignDrop running on http://localhost:${PORT}`);
});