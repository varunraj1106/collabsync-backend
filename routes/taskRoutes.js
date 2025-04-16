// ✅ File: routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// ✅ GET all tasks (admin/global access)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
});

// ✅ GET tasks by manager (Kanban view)
router.get('/by-manager/:managerId', async (req, res) => {
  try {
    const tasks = await Task.find({ managerId: req.params.managerId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks for manager' });
  }
});

// ✅ POST a new task
router.post('/', async (req, res) => {
  const { title, type, description, status, tags, assignee, group, managerId } = req.body;

  if (!title || !managerId) {
    return res.status(400).json({ message: 'Title and managerId are required' });
  }

  try {
    const task = new Task({ title, type, description, status, tags, assignee, group, managerId });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: 'Error creating task', error: err.message });
  }
});

// ✅ PUT update task status or other fields
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: 'Error updating task', error: err.message });
  }
});

// ✅ DELETE a task
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted', task: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting task' });
  }
});

module.exports = router;
