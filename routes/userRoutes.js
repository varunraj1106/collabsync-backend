const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ GET all unassigned users (no manager)
router.get('/users/unassigned', async (req, res) => {
  try {
    const users = await User.find({ managerId: null, _id: { $not: /^MM/ } });
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
    res.status(500).json({ message: 'Error assigning manager' });
  }
});

// ✅ GET all users except the current manager
router.get('/users/all', async (req, res) => {
  const managerId = req.query.managerId; // Expecting ?managerId=MM101

  try {
    const users = await User.find({ _id: { $ne: managerId } }); // Exclude manager
    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

module.exports = router;

