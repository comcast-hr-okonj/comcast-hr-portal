const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

// ✅ FIXED CORS (Vercel + Render)
app.use(cors({
  origin: "https://comcast-hr-portal.vercel.app",
  methods: ["GET", "POST"],
}));

const SECRET = "comcast-hr-secret";
const PORT = process.env.PORT || 3000;

// DB
const db = new sqlite3.Database("./database.sqlite");

// TABLES
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  number TEXT,
  position TEXT,
  status TEXT
)
`);

// ADMIN (auto create)
const hash = bcrypt.hashSync("1234", 10);

db.run(
  "INSERT OR IGNORE INTO users (email,password,role) VALUES (?,?,?)",
  ["admin@comcast.com", hash, "admin"]
);

// HOME
app.get("/", (req, res) => {
  res.json({ message: "HR API Running" });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email=?", [email], async (err, user) => {
    if (!user) return res.status(401).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, {
      expiresIn: "2h"
    });

    res.json({ token });
  });
});

// AUTH
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// APPLY
app.post("/applications", (req, res) => {
  const { name, email, number, position } = req.body;

  db.run(
    "INSERT INTO applications (name,email,number,position,status) VALUES (?,?,?,?,?)",
    [name, email, number, position, "Pending"],
    () => res.json({ success: true })
  );
});

// GET ALL (ADMIN)
app.get("/applications", auth, (req, res) => {
  db.all("SELECT * FROM applications ORDER BY id DESC", (err, rows) => {
    res.json(rows);
  });
});

// START
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
