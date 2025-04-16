// ✅ groupRoutes.js
const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// ✅ Get all groups (global/admin access, if needed)
router.get('/', async (req, res) => {
  const { managerId } = req.query;

  try {
    if (managerId) {
      const groups = await Group.find({ managerId });
      return res.json(groups);
    }

    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    console.error('❌ Error fetching groups:', err);
    res.status(500).json({ message: 'Server error fetching groups' });
  }
});

// ✅ Get groups by manager (legacy support if needed)
router.get('/by-manager/:managerId', async (req, res) => {
  const { managerId } = req.params;

  if (!managerId) {
    return res.status(400).json({ message: 'Manager ID is required' });
  }

  try {
    const groups = await Group.find({ managerId });
    res.json(groups);
  } catch (err) {
    console.error('❌ Error fetching groups for manager:', err);
    res.status(500).json({ message: 'Server error fetching manager groups' });
  }
});

// ✅ Create a new group
router.post('/', async (req, res) => {
  const { name, members, managerId } = req.body;

  if (!name || !Array.isArray(members) || !managerId) {
    return res.status(400).json({ message: 'Group name, members, and managerId are required' });
  }

  try {
    const group = new Group({ name, members, managerId });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    console.error('❌ Error creating group:', err);
    res.status(500).json({ message: 'Server error creating group' });
  }
});

// ✅ Update a group (Edit group name or members)
router.put('/:groupId', async (req, res) => {
  const { name, members } = req.body;

  if (!name || !Array.isArray(members)) {
    return res.status(400).json({ message: 'Group name and members are required for update' });
  }

  try {
    const updated = await Group.findByIdAndUpdate(
      req.params.groupId,
      { name, members },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('❌ Error updating group:', err);
    res.status(500).json({ message: 'Server error updating group' });
  }
});

// ✅ Delete a group by ID
router.delete('/:groupId', async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json({ message: 'Group deleted', deletedGroup: group });
  } catch (err) {
    console.error('❌ Error deleting group:', err);
    res.status(500).json({ message: 'Server error deleting group' });
  }
});

module.exports = router;
