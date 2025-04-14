const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 3019;

// ✅ Enable CORS for Vercel frontend
app.use(cors({
  origin: 'https://collabsync-frontend.vercel.app',
  credentials: true
}));

// ✅ Connect to MongoDB Atlas
connectDB();

// ✅ Middleware
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Optional: if you use JSON in frontend fetch()

// ✅ Define Schema
const userSchema = new mongoose.Schema({
  regd_no: String,
  name: String,
  email: String,
  branch: String
});

// ✅ Create model
const User = mongoose.model("User", userSchema);

// ✅ Health check route (optional)
app.get('/health', (req, res) => {
  res.send("✅ Server is healthy!");
});

// ✅ Redirect root to index.html
app.get("/", (req, res) => {
  res.redirect("/index");
});

// ✅ Serve index.html
app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ✅ Handle form submission
app.post('/post', async (req, res) => {
  const { regd_no, name, email, branch } = req.body;

  try {
    const user = new User({
      regd_no,
      name,
      email,
      branch
    });
    await user.save();
    console.log("✅ User saved:", user);
    res.send("✅ Form Submission Successful");
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).send("Server Error");
  }
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
