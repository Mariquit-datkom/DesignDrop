const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const schemaSQL = fs.readFileSync(
    path.join(__dirname, '../sql/schema.sql'), 'utf-8'
);

const tempPool = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    waitForConnections : true,
    connectionLimit : 1,
    multipleStatements : true
});

const tempDb = tempPool.promise();

const pool = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections : true,
    connectionLimit : 10
});

const db = pool.promise();

async function initializeDatabase() {
    try {
        await tempDb.query(schemaSQL);
        console.log('🎨 DesignDrop database initialized successfully!\n');
    } catch (err) {
        console.log('❌ Database initialization failed: ', err.message);
        process.exit(1);
    } finally {
        tempPool.end();
    }
}

initializeDatabase();

module.exports = db;