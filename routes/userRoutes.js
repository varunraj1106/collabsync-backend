// File: routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ GET: Users available for assignment (employees without a manager)
router.get('/available/:managerId', async (req, res) => {
  const { managerId } = req.params;

  if (!managerId) {
    return res.status(400).json({ message: 'Manager ID is required' });
  }

  try {
    const users = await User.find({
      role: 'employee',
      managerId: null,
      _id: { $ne: managerId } // exclude self
    });
    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching available users:', err);
    res.status(500).json({ message: 'Server error fetching available users' });
  }
});

// ✅ PATCH: Assign employee to a manager
router.patch('/assign', async (req, res) => {
  const { empId, managerId } = req.body;

  if (!empId || !managerId) {
    return res.status(400).json({ message: 'Both empId and managerId are required' });
  }

  try {
    const employee = await User.findById(empId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.managerId = managerId;
    await employee.save();

    res.status(200).json({ message: 'User assigned successfully', user: employee });
  } catch (err) {
    console.error('❌ Error assigning user:', err);
    res.status(500).json({ message: 'Error assigning manager' });
  }
});

// ✅ PATCH: Unassign employee from manager
router.patch('/unassign', async (req, res) => {
  const { empId } = req.body;

  if (!empId) {
    return res.status(400).json({ message: 'empId is required' });
  }

  try {
    const updated = await User.findByIdAndUpdate(empId, { managerId: null }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Employee unassigned', user: updated });
  } catch (err) {
    console.error('❌ Error unassigning user:', err);
    res.status(500).json({ message: 'Error unassigning employee' });
  }
});

// ✅ GET: All employees assigned under a manager
router.get('/assigned/:managerId', async (req, res) => {
  const { managerId } = req.params;

  if (!managerId) {
    return res.status(400).json({ message: 'Manager ID is required' });
  }

  try {
    const employees = await User.find({ managerId, role: 'employee' });
    res.json(employees);
  } catch (err) {
    console.error('❌ Error fetching assigned users:', err);
    res.status(500).json({ message: 'Server error fetching assigned users' });
  }
});

// ✅ GET: All users excluding current manager (for dashboard listing etc.)
router.get('/all', async (req, res) => {
  const { managerId } = req.query;

  try {
    const users = await User.find({ _id: { $ne: managerId } });
    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// ✅ GET: Fetch a single user (manager or employee) by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('❌ Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
});

// ✅ GET a single user by ID (for profile info)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id }); // <== ✅ Fixed here
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
});

module.exports = router;
