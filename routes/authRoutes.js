const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "User registered" });
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, results[0].password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: results[0].id }, 'secretkey');
    res.json({ token });
  });
});

module.exports = router;
