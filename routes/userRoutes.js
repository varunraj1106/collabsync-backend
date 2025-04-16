// File: routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ POST: Register a new user (manager or employee)
router.post('/post', async (req, res) => {
  const { emp_id, name, department, email, password } = req.body;

  if (!emp_id || !name || !email || !password || !department) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUser = await User.findById(emp_id);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this ID already exists.' });
    }

    const role = emp_id.startsWith('MM') ? 'manager' : 'employee';

    const newUser = new User({
      _id: emp_id,
      name,
      email,
      password,
      branch: department,
      role
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', _id: newUser._id });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

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
      _id: { $ne: managerId }
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

    if (employee.role !== 'employee') {
      return res.status(400).json({ message: 'Only employees can be assigned to a manager' });
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

// ✅ GET: All users excluding current manager
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

module.exports = router;
