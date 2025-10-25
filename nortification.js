const express = require("express");
const router = express.Router();

// Send alert (simulate SMS or push)
router.post("/send", (req, res) => {
  const { type, message, user } = req.body;

  if (!type || !message || !user) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // Here you would integrate SMS or email API (Twilio, Africa’s Talking)
  console.log(`Sending ${type} alert to ${user.phone || user.email}: ${message}`);

  res.json({ message: `Alert sent to ${user.email || user.phone}` });
});

module.exports = router;
