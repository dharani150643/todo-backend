const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/auth');

const router = express.Router();

// Get todos
router.get('/', auth, (req, res) => {
  db.query('SELECT * FROM todos WHERE user_id = ?', [req.user.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add todo
router.post('/', auth, (req, res) => {
  const { task } = req.body;
  db.query('INSERT INTO todos (user_id, task) VALUES (?, ?)', [req.user.id, task], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Todo added" });
  });
});

// Toggle complete
router.put('/:id', auth, (req, res) => {
  const { completed } = req.body;
  db.query('UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?', [completed, req.params.id, req.user.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Todo updated" });
  });
});

// Delete
router.delete('/:id', auth, (req, res) => {
  db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Todo deleted" });
  });
});

module.exports = router;
