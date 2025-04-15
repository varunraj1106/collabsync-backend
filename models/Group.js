const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: String }] // email list
});

module.exports = mongoose.model('Group', groupSchema);
