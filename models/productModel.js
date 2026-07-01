const db = require('../config/db');

async function createProduct(sellerId, title, description, price) {
    const [result] = await db.query(
        `INSERT INTO products (seller_id, title, description, price) VALUES (?, ?, ?, ?)`,
        [sellerId, title, description, price]
    );

    return result.insertId;
}

async function getSellerProducts(sellerId) {
    const [rows] = await db.query(
        `SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC`,
        [sellerId]
    );

    return rows;
}

module.exports = {
    createProduct,
    getSellerProducts
};