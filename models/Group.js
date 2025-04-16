const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: String, ref: 'User' }],
  managerId: { type: String, required: true },
  status: {
    type: String,
    enum: [
      'Requirement Gathering',
      'In Dev',
      'Dev Completed',
      'In Testing',
      'Testing Done',
      'Done'
    ],
    default: 'Requirement Gathering'
  }
});

module.exports = mongoose.model('Group', groupSchema);
