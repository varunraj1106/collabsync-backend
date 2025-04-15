// File: models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ✅ Define user schema
const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // employee ID as primary key
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  branch: { type: String, required: true },
  role: {
    type: String,
    enum: ['manager', 'employee'],
    default: 'employee'
  },
  managerId: { type: String, default: null } // ✅ Assigned manager's ID
});

// ✅ Hash password before saving
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    console.error('❌ Error hashing password:', error);
    next(error);
  }
});

// ✅ Add password comparison method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
