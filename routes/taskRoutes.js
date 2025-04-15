// File: routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// 👉 GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// 👉 GET tasks for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks for user' });
  }
});

// 👉 POST a new task (includes userId)
router.post('/', async (req, res) => {
  const { title, status, userId } = req.body;

  try {
    const task = new Task({ title, status, userId });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: 'Error creating task', error: err.message });
  }
});

// 👉 PUT update task status
router.put('/:id', async (req, res) => {
  const { status } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: 'Error updating task' });
  }
});

module.exports = router;
