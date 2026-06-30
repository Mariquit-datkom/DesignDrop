const db = require('../config/db');

async function createUser(name, email, hashedPassword, role) {
    const [result] = await db.query (
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
    );

    return result.insertId;
}

async function findUserByEmail(email) {
    const [rows] = await db.query (
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    return rows[0];
}

async function findUserById(id) {
    const [rows] = await db.query (
        'SELECT id, name, email, role FROM users WHERE id = ?',
        [id]
    );

    return rows[0];
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};