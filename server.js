const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const flash = require('connect-flash');

dotenv.config();

const app = express();
const db = require('./config/db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/dashboard'));

app.get('/', (req, res) => {
    res.send('🎨 DesignDrop is live!');
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 DesignDrop running on http://localhost:${PORT}`);
});