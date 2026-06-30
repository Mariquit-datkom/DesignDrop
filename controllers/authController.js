const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

function showRegister (req, res) {
    res.render('register');
}

async function register (req, res) {
    const {name, email, password, role} = req.body;

    try {
        if (!name?.trim() || !email?.trim() || !password?.trim()) {
            req.flash('error', 'All fields are required.');
            return res.redirect('/register');
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(cleanEmail)) {
            req.flash('error', 'Please enter a valid email address.');
            return res.redirect('/register');
        }
        
        const allowedRoles = ['buyer', 'seller'];
        if (!allowedRoles.includes(role)) {
            req.flash('error', 'Select a valid account role.');
            return res.redirect('/register');
        }

        if (cleanPassword.length < 8) {
            req.flash('error', 'Password must be at least 8 characters long.');
            return res.redirect('/register');
        }

        const existingUser = await userModel.findUserByEmail(cleanEmail);
        if (existingUser) {
            req.flash('error', 'Email already registered.')
            return res.redirect('/register')
        }

        const hashedPassword = await bcrypt.hash(cleanPassword, 10);

        await userModel.createUser(cleanName, cleanEmail, hashedPassword, role);

        req.flash('success', 'Account successfully created.')
        res.redirect('/login');

    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong.')
        res.redirect('/register');
    }
}

function showLogin (req, res) {
    res.render('login');
}

async function login (req, res) {
    const {email, password} = req.body;

    try {
        if (!email?.trim() || !password?.trim()) {
            req.flash('error', 'All fields required.');
            return res.redirect('/login');
        }

        const cleanEmail = email.trim().toLowerCase();

        const user = await userModel.findUserByEmail(cleanEmail);
        if (!user) {
            req.flash('error', 'No user found with this email.');
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password.trim(), user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid Credentials.');
            return res.redirect('/login');
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            role: user.role
        };

        if (user.role === 'seller') return res.redirect('/seller/dashboard');

        res.redirect('/buyer/dashboard');

    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong.')
        res.redirect('/login');
    }
}

function logout(req, res) {
    req.session.destroy(err => {
        if (err) return res.redirect('/dashboard');
        
        res.clearCookie('designdrop_session');
        res.redirect('/login');
    });
}

module.exports = {
    showRegister,
    register,
    showLogin,
    login,
    logout
};