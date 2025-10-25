const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const weatherRoutes = require("./routes/weather");
const communityRoutes = require("./routes/community");
const notificationsRoutes = require("./routes/notifications");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/weather", weatherRoutes);
app.use("/community", communityRoutes);
app.use("/notifications", notificationsRoutes);

app.get("/", (req, res) => {
  res.send("AgriGuard Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
