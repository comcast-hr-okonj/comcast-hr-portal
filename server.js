const express = require("express");
const cors = require("cors");

const app = express();

// Middleware (MUST be at top)
app.use(cors());
app.use(express.json());

// Port for Render
const PORT = process.env.PORT || 3000;

/* =========================
   HOME ROUTE (THIS FIXES "Cannot GET /")
========================= */
app.get("/", (req, res) => {
  res.send("🚀 Comcast HR Backend is running successfully");
});

/* =========================
   TEST ROUTE (OPTIONAL)
========================= */
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is alive" });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
