const express = require('express');
const path = require('path');
const port = 3019;

const app = express();

// Redirect root URL to /signup
app.get("/", (req, res) => {
  res.redirect("/signup");
});

// Serve Signup.html from public folder
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'Signup.html'));
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
