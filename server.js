// File: server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load .env variables
dotenv.config();

// Load models
const User = require('./models/User');
const Task = require('./models/Task');
const Group = require('./models/Group');

const app = express();
const port = process.env.PORT || 3019;

// ✅ Enable CORS for Vercel deployments
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// ✅ Route files
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');

// ✅ Use Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);

// ✅ Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '1h'
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Registration Route
app.post('/post', async (req, res) => {
  const { emp_id, name, department, email, password } = req.body;

  try {
    if (!emp_id || !name || !department || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const role = emp_id.toUpperCase().startsWith("MM") ? 'manager' : 'employee';

    const user = new User({
      _id: emp_id,
      name,
      email,
      password,
      branch: department,
      role
    });

    await user.save();
    console.log("✅ User saved:", user);
    res.status(200).json({ message: '✅ Form Submission Successful' });

  } catch (error) {
    console.error("❌ Error saving user:", error);

    if (error.code === 11000) {
      return res.status(409).json({ message: 'User with this Employee ID or Email already exists.' });
    }

    res.status(500).json({ message: '❌ Server Error' });
  }
});

// ✅ Root route
app.get('/', (req, res) => {
  res.send('✅ Backend API is running and reachable.');
});

// ✅ Health check
app.get('/health', (req, res) => {
  res.send('✅ Server is healthy!');
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});


