// File: routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.patch('/users/assign', async (req, res) => {
  const { empId, managerId } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      empId,
      { managerId },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User assigned successfully', user: updatedUser });
  } catch (err) {
    console.error('❌ Error assigning user:', err);
    res.status(500).json({ message: 'Error assigning manager' });
  }
});


// ✅ POST assign employee to a manager
router.post('/users/assign', async (req, res) => {
  const { empId, managerId } = req.body;

  try {
    const employee = await User.findById(empId);

    if (!employee) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optional: Prevent reassigning if already assigned
    if (employee.managerId) {
      return res.status(400).json({ message: 'User is already assigned to a manager' });
    }

    employee.managerId = managerId;
    await employee.save();

    res.status(200).json({ message: 'User assigned successfully', user: employee });
  } catch (err) {
    console.error('❌ Error assigning user:', err);
    res.status(500).json({ message: 'Error assigning manager' });
  }
});

// ✅ GET employees already assigned to this manager
router.get('/users/assigned/:managerId', async (req, res) => {
  const { managerId } = req.params;

  try {
    const users = await User.find({ managerId });
    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching assigned users:', err);
    res.status(500).json({ message: 'Server error fetching assigned users' });
  }
});

// ✅ GET all users except the current manager (for dashboard usage)
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
