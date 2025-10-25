const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

// Example: South Africa coordinates (Johannesburg)
const LAT = -26.2;
const LON = 28.0;

// Get current weather
router.get("/current", async (req, res) => {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`);
    const data = await response.json();
    res.json(data.current_weather);
  } catch (error) {
    res.status(500).json({ message: "Error fetching weather", error });
  }
});

module.exports = router;
