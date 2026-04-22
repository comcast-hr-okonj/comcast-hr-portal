const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SECRET = "comcast-hr-secret";

/* =========================
   DATABASE (Render safe)
========================= */
const db = new sqlite3.Database("/tmp/database.sqlite");

db.serialize(() => {
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
});

/* =========================
   ADMIN ACCOUNT (AUTO CREATE)
========================= */
const createAdmin = async () => {
  const hash = await bcrypt.hash("09015159496", 10);

  db.run(
    "INSERT OR IGNORE INTO users (email,password,role) VALUES (?,?,?)",
    ["admin@comcast.com", hash, "admin"]
  );
};

createAdmin();

/* =========================
   HOME ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("🚀 Comcast HR System Running");
});

/* =========================
   LOGIN
========================= */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email=?", [email], async (err, user) => {
    if (!user) return res.status(401).json({ error: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  });
});

/* =========================
   AUTH MIDDLEWARE
========================= */
function auth(req, res, next) {
  const token = req.headers.authorization;

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

/* =========================
   APPLY (PUBLIC)
========================= */
app.post("/applications", (req, res) => {
  const { name, email, number, position } = req.body;

  db.run(
    "INSERT INTO applications (name,email,number,position,status) VALUES (?,?,?,?,?)",
    [name, email, number, position, "Pending"],
    () => res.json({ success: true })
  );
});

/* =========================
   GET APPLICATIONS (ADMIN ONLY)
========================= */
app.get("/applications", auth, (req, res) => {
  db.all("SELECT * FROM applications ORDER BY id DESC", (err, rows) => {
    res.json(rows);
  });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
