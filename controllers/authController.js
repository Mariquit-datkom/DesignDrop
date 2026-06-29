const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

function showRegister (req, res) {
    res.render('register');
}

async function register (req, res) {
    const {name, email, password, role} = req.body;

    try {
        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            req.flash('error', 'Email already registered.')
            return res.redirect('/register')
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.createUser(name, email, hashedPassword);

        req.flash('success', 'Account successfuly created.')
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
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            req.flash('error', 'No user found with this email.');
            return res.redirect('login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid Credentials.');
            return res.redirect('login');
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            role: user.role
        };

        res.redirect('/dashboard');

    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong.')
        res.redirect('/login');
    }
}

function logout (req, res) {
    req.session.destroy(() => {
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