const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');

router.get('/', protect, (req, res) => {
  res.json({
    message: `Hello ${req.user.email}, welcome to your dashboard!`,
    user: req.user
  });
});

module.exports = router;
