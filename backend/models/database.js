const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'crypto_market.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('✓ Connected to SQLite database');
    }
});

// Initialize database tables
function initializeDatabase() {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('✓ Users table ready');
        }
    });

    // Orders table
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            cryptocurrency TEXT NOT NULL,
            amount REAL NOT NULL,
            price REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating orders table:', err.message);
        } else {
            console.log('✓ Orders table ready');
        }
    });
}

// User operations
const userOperations = {
    create: (name, email, hashedPassword, callback) => {
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.run(sql, [name, email, hashedPassword], function(err) {
            callback(err, this?.lastID);
        });
    },

    findByEmail: (email, callback) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], callback);
    },

    findById: (id, callback) => {
        const sql = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
        db.get(sql, [id], callback);
    }
};

// Order operations
const orderOperations = {
    create: (userId, type, cryptocurrency, amount, price, callback) => {
        const sql = 'INSERT INTO orders (user_id, type, cryptocurrency, amount, price, status) VALUES (?, ?, ?, ?, ?, ?)';
        db.run(sql, [userId, type, cryptocurrency, amount, price, 'completed'], function(err) {
            callback(err, this?.lastID);
        });
    },

    findByUserId: (userId, callback) => {
        const sql = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
        db.all(sql, [userId], callback);
    },

    findById: (id, callback) => {
        const sql = 'SELECT * FROM orders WHERE id = ?';
        db.get(sql, [id], callback);
    }
};

module.exports = {
    db,
    initializeDatabase,
    userOperations,
    orderOperations
};
