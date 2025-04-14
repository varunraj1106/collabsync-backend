// File: models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'inprogress', 'done'],
    default: 'todo'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', taskSchema);
