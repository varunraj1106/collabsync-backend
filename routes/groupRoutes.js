// ✅ groupRoutes.js
const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');

// ✅ Get all groups for display
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    console.error('❌ Error fetching groups:', err);
    res.status(500).json({ message: 'Server error fetching groups' });
  }
});

// ✅ Create a new group
router.post('/', async (req, res) => {
  const { name, members } = req.body;
  try {
    const group = new Group({ name, members });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    console.error('❌ Error creating group:', err);
    res.status(500).json({ message: 'Server error creating group' });
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
