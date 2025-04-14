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

// 👉 POST a new task
router.post('/', async (req, res) => {
  const { title, status } = req.body;

  try {
    const task = new Task({ title, status });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: 'Error creating task' });
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
