// Handles SQLite database connection and initialization

const sqlite3 = require("sqlite3").verbose();

// Creates or opens a persistent SQLite file
const db = new sqlite3.Database("./donations.db");

// Create donations table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      donorName TEXT NOT NULL,
      donationType TEXT NOT NULL,
      amount REAL NOT NULL,
      donationDate TEXT NOT NULL
    )
  `);
});

module.exports = db;