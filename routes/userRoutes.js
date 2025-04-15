const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ GET all unassigned users (not assigned to a manager and not a manager themselves)
router.get('/users/unassigned', async (req, res) => {
  try {
    const users = await User.find({
      managerId: null,
      _id: { $not: /^MM/ } // exclude managers
    });
    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching unassigned users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PATCH assign user to a manager
router.patch('/users/assign-manager', async (req, res) => {
  const { employeeId, managerId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      employeeId,
      { managerId },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User assigned successfully', user });
  } catch (err) {
    console.error('❌ Error assigning manager:', err);
    res.status(500).json({ message: 'Error assigning manager' });
  }
});

// ✅ GET all users excluding the currently logged-in manager
router.get('/users/all', async (req, res) => {
  const managerId = req.query.managerId;

  try {
    const users = await User.find({ _id: { $ne: managerId } });
    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

module.exports = router;
