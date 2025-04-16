// File: routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ GET users available for assignment (not assigned & not a manager)
router.get('/available/:managerId', async (req, res) => {
  const { managerId } = req.params;

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

// ✅ PATCH: Assign employee to manager
router.patch('/assign', async (req, res) => {
  const { empId, managerId } = req.body;

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

// ✅ PATCH: Unassign employee
router.patch('/unassign', async (req, res) => {
  const { empId } = req.body;

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

// ✅ GET: Employees assigned to a manager (only employees, not other managers)
router.get('/assigned/:managerId', async (req, res) => {
  const { managerId } = req.params;

  try {
    const employees = await User.find({ managerId, role: 'employee' });
    res.json(employees);
  } catch (err) {
    console.error('❌ Error fetching assigned users:', err);
    res.status(500).json({ message: 'Server error fetching assigned users' });
  }
});

// ✅ GET: All users except current manager (for dashboard listing etc.)
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
