// ✅ File: models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Task', 'Bug', 'User Story', 'Subtask'],
    default: 'Task'
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['Requirement Gathering', 'In Dev', 'Dev Completed', 'In Testing', 'Testing Done', 'Done'],
    default: 'Requirement Gathering'
  },
  tags: [String],
  assignee: {
    type: String, // Store employee ID like "EMP303"
    ref: 'User'
  },
  group: {
    type: String // Optional: can store group ID or name
  },
  managerId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', taskSchema);
