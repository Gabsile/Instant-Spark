const express = require("express");
const fs = require("fs");
const router = express.Router();

const USERS_FILE = "./data/users.json";

// Create users.json if not exists
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));

// Register/login user
router.post("/login", (req, res) => {
  const { email, phone, idNumber } = req.body;

  if (!email || !phone || !idNumber) {
    return res.status(400).json({ message: "All fields required" });
  }

  let users = JSON.parse(fs.readFileSync(USERS_FILE));
  let existingUser = users.find(u => u.idNumber === idNumber);

  if (!existingUser) {
    // New user
    const newUser = { email, phone, idNumber, registeredAt: new Date() };
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return res.status(201).json({ message: "User registered", user: newUser });
  }

  // Existing user
  res.json({ message: "User logged in", user: existingUser });
});

module.exports = router;
