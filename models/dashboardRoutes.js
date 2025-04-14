const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');

// Protected dashboard route
router.get('/', protect, (req, res) => {
  res.json({ message: `Welcome back, ${req.user.email}!` });
});

module.exports = router;
