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
app.use(express.json()); // Required for handling JSON from fetch()

// ✅ Define Schema
const userSchema = new mongoose.Schema({
  regd_no: String,
  name: String,
  email: String,
  branch: String
});

// ✅ Create model
const User = mongoose.model("User", userSchema);

// ✅ Health check route
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

// ✅ Handle form submission from frontend
app.post('/post', async (req, res) => {
  const { emp_id, name, department, email } = req.body;

  try {
    const user = new User({
      regd_no: emp_id,
      name,
      email,
      branch: department
    });
    await user.save();
    console.log("✅ User saved:", user);
    res.status(200).json({ message: "✅ Form Submission Successful" });
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ message: "❌ Server Error" });
  }
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
