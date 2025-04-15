// File: server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 3019;

// ✅ Enable CORS for Vercel frontend
app.use(cors({
  origin: [
    'https://collabsync-frontend.vercel.app',
    'https://collabsync-frontend-git-main-varunraj-kadams-projects.vercel.app'
  ],
  credentials: true
}));

// ✅ Connect to MongoDB Atlas
connectDB();

// ✅ Middleware
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Models
const User = require('./models/User');
const Task = require('./models/Task');

// ✅ Routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// ✅ Health check
app.get('/health', (req, res) => {
  res.send("✅ Server is healthy!");
});

// ✅ Root route
app.get('/', (req, res) => {
  res.send("✅ Backend API is running and reachable.");
});

// ✅ Handle registration (emp_id used as primary key)
app.post('/post', async (req, res) => {
  const { emp_id, name, department, email, password } = req.body;

  try {
    if (!emp_id || !name || !department || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = new User({
      _id: emp_id, // emp_id is primary key
      name,
      email,
      password,
      branch: department
    });

    await user.save();
    console.log("✅ User saved:", user);
    res.status(200).json({ message: "✅ Form Submission Successful" });

  } catch (error) {
    console.error("❌ Error saving user:", error);

    if (error.code === 11000) {
      return res.status(409).json({ message: "User with this Employee ID or Email already exists." });
    }

    res.status(500).json({ message: "❌ Server Error" });
  }
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
