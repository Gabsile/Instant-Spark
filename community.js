const express = require("express");
const fs = require("fs");
const router = express.Router();

const REPORTS_FILE = "./data/reports.json";
if (!fs.existsSync(REPORTS_FILE)) fs.writeFileSync(REPORTS_FILE, JSON.stringify([]));

// Submit a community report
router.post("/report", (req, res) => {
  const { type, description, location } = req.body;

  if (!type || !description || !location) {
    return res.status(400).json({ message: "All fields required" });
  }

  let reports = JSON.parse(fs.readFileSync(REPORTS_FILE));
  const newReport = { type, description, location, date: new Date() };
  reports.push(newReport);
  fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));

  res.json({ message: "Report submitted", report: newReport });
});

// Get all reports
router.get("/", (req, res) => {
  const reports = JSON.parse(fs.readFileSync(REPORTS_FILE));
  res.json(reports);
});

module.exports = router;
