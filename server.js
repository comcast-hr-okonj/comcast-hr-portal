const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "comcast-hr-secret";
const PORT = process.env.PORT || 3000;

// DATABASE
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

// CREATE ADMIN (AUTO FIX)
db.serialize(() => {
  const hash = bcrypt.hashSync("09015159496", 10);

  db.run(
    "INSERT OR IGNORE INTO users (email,password,role) VALUES (?,?,?)",
    ["okonjortestimony2008@gmail.com", hash, "admin"]
  );
});

// HOME TEST
app.get("/", (req, res) => {
  res.json({ ok: true, message: "HR API running" });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email=?", [email], async (err, user) => {
    if (!user) return res.status(401).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  });
});

// AUTH MIDDLEWARE
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    const clean = token.replace("Bearer ", "");
    req.user = jwt.verify(clean, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// APPLY FORM
app.post("/applications", (req, res) => {
  const { name, email, number, position } = req.body;

  if (!name || !email || !number || !position) {
    return res.status(400).json({ error: "Missing fields" });
  }

  db.run(
    "INSERT INTO applications (name,email,number,position,status) VALUES (?,?,?,?,?)",
    [name, email, number, position, "Pending"],
    (err) => {
      if (err) return res.status(500).json({ error: "DB error" });

      res.json({ success: true });
    }
  );
});

// GET APPLICATIONS (ADMIN)
app.get("/applications", auth, (req, res) => {
  db.all("SELECT * FROM applications ORDER BY id DESC", (err, rows) => {
    res.json(rows);
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log("🚀 HR Server running on port " + PORT);
});
