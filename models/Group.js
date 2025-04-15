const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: String, ref: 'User' }],
  managerId: { type: String, required: true }
});

module.exports = mongoose.model('Group', groupSchema);
