const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/db'); // ⬅️ DB connection module
const port = 3019;

const app = express();

// ✅ Connect to MongoDB Atlas
connectDB(); // ⬅️ Call the connection function

// ✅ Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));

// ✅ Define Schema
const userSchema = new mongoose.Schema({
  regd_no: String,
  name: String,
  email: String,
  branch: String
});

// ✅ Create model
const User = mongoose.model("User", userSchema);

// ✅ Redirect root to signup page
app.get("/", (req, res) => {
  res.redirect("/index");
});

// ✅ Serve Signup.html
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
  console.log(`🚀 Server Started on http://localhost:${port}`);
});
