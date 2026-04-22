const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

// middleware (MUST be at top)
app.use(cors());
app.use(express.json());

const SECRET = "comcast-hr-secret";

// Render PORT (VERY IMPORTANT)
const PORT = process.env.PORT || 3000;

// DATABASE (simple file DB)
const db = new sqlite3.Database("./database.sqlite");

// -------------------- TABLES --------------------
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

// -------------------- ADMIN USER --------------------
const createAdmin = async () => {
  const hash = await bcrypt.hash("09015159496", 10);

  db.run(
    "INSERT OR IGNORE INTO users (email,password,role) VALUES (?,?,?)",
    ["okonjortestimony2008@gmail.com", hash, "admin"]
  );
};

createAdmin();

// -------------------- LOGIN --------------------
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

// -------------------- AUTH MIDDLEWARE --------------------
function auth(req, res, next) {
  const token = req.headers.authorization;

  try {
    jwt.verify(token, SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// -------------------- APPLY (PUBLIC) --------------------
app.post("/applications", (req, res) => {
  const { name, email, number, position } = req.body;

  db.run(
    "INSERT INTO applications (name,email,number,position,status) VALUES (?,?,?,?,?)",
    [name, email, number, position, "Pending"],
    () => res.json({ success: true })
  );
});

// -------------------- GET APPLICATIONS (ADMIN ONLY) --------------------
app.get("/applications", auth, (req, res) => {
  db.all("SELECT * FROM applications ORDER BY id DESC", (err, rows) => {
    res.json(rows);
  });
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log("🚀 HR Server running on port " + PORT);
});
