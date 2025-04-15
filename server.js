const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 3019;

// CORS for frontend access
app.use(cors({
  origin: [
    'https://collabsync-frontend.vercel.app',
    'https://collabsync-frontend-git-main-varunraj-kadams-projects.vercel.app'
  ],
  credentials: true
}));

// Connect DB
connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Models
const User = require('./models/User');
const Task = require('./models/Task');
const Group = require('./models/Group'); // ✅ New

// Routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// API for group creation
app.post('/api/groups', async (req, res) => {
  const { name, managerId, members } = req.body;

  if (!name || !managerId || !Array.isArray(members)) {
    return res.status(400).json({ message: 'Invalid group input.' });
  }

  try {
    const group = new Group({ name, manager: managerId, members });
    await group.save();
    res.status(200).json({ message: '✅ Group created', group });
  } catch (error) {
    console.error('❌ Error creating group:', error);
    res.status(500).json({ message: '❌ Server error' });
  }
});

// API to get groups by manager
app.get('/api/groups', async (req, res) => {
  const { managerId } = req.query;

  try {
    const groups = await Group.find({ manager: managerId });
    res.status(200).json(groups);
  } catch (error) {
    console.error('❌ Error fetching groups:', error);
    res.status(500).json({ message: '❌ Server error' });
  }
});

app.get('/health', (req, res) => res.send("✅ Server is healthy!"));
app.get('/', (req, res) => res.send("✅ Backend API running."));

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
