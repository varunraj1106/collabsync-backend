const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// POST /api/groups/create
router.post('/create', async (req, res) => {
  const { name, members, managerId } = req.body;

  if (!name || !members || !managerId) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const newGroup = new Group({ name, members, managerId });
    await newGroup.save();
    res.status(201).json({ message: 'Group created', group: newGroup });
  } catch (err) {
    console.error('❌ Error creating group:', err);
    res.status(500).json({ message: 'Server error creating group' });
  }
});

// GET /api/groups/:managerId
router.get('/:managerId', async (req, res) => {
  try {
    const groups = await Group.find({ managerId: req.params.managerId });
    res.json(groups);
  } catch (err) {
    console.error('❌ Error fetching groups:', err);
    res.status(500).json({ message: 'Server error fetching groups' });
  }
});

module.exports = router;
