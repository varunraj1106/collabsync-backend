const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// ✅ GET: All groups or filtered by managerId
router.get('/', async (req, res) => {
  const { managerId } = req.query;

  try {
    const query = managerId ? { managerId } : {};
    const groups = await Group.find(query);
    res.json(groups);
  } catch (err) {
    console.error('❌ Error fetching groups:', err);
    res.status(500).json({ message: 'Server error fetching groups' });
  }
});

// ✅ POST: Create a new group with optional status
router.post('/', async (req, res) => {
  const { name, members, managerId, status } = req.body;

  if (!name || !Array.isArray(members) || !managerId || !status) {
    return res.status(400).json({ message: 'Group name, members, managerId, and status are required' });
  }

  try {
    const newGroup = new Group({ name, members, managerId, status });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (err) {
    console.error('❌ Error creating group:', err);
    res.status(500).json({ message: 'Server error creating group' });
  }
});

// ✅ PUT: Update group name, members, and status
router.put('/:groupId', async (req, res) => {
  const { name, members, status } = req.body;

  if (!name || !Array.isArray(members) || !status) {
    return res.status(400).json({ message: 'Group name, members, and status are required for update' });
  }

  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.groupId,
      { name, members, status },
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(updatedGroup);
  } catch (err) {
    console.error('❌ Error updating group:', err);
    res.status(500).json({ message: 'Server error updating group' });
  }
});

// ✅ DELETE: Delete a group
router.delete('/:groupId', async (req, res) => {
  try {
    const deletedGroup = await Group.findByIdAndDelete(req.params.groupId);
    if (!deletedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json({ message: 'Group deleted', deletedGroup });
  } catch (err) {
    console.error('❌ Error deleting group:', err);
    res.status(500).json({ message: 'Server error deleting group' });
  }
});

module.exports = router;
