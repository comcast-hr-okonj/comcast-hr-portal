const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SECRET = "secret123";

// DB
const db = new sqlite3.Database("./database.sqlite");

// CREATE TABLES
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
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

  // CREATE ADMIN
  const hash = bcrypt.hashSync("1234", 10);

  db.run(
    "INSERT OR IGNORE INTO users (email,password) VALUES (?,?)",
    ["admin@comcast.com", hash]
  );
});

// TEST
app.get("/", (req, res) => {
  res.json({ message: "HR API Running" });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email=?", [email], (err, user) => {
    if (!user) return res.status(401).json({ error: "User not found" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user.id }, SECRET);
    res.json({ token });
  });
});

// AUTH
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// SUBMIT APPLICATION
app.post("/applications", (req, res) => {
  const { name, email, number, position } = req.body;

  if (!name || !email || !number || !position) {
    return res.status(400).json({ error: "Fill all fields" });
  }

  db.run(
    "INSERT INTO applications (name,email,number,position,status) VALUES (?,?,?,?,?)",
    [name, email, number, position, "Pending"],
    () => res.json({ success: true })
  );
});

// GET APPLICATIONS
app.get("/applications", auth, (req, res) => {
  db.all("SELECT * FROM applications ORDER BY id DESC", (err, rows) => {
    res.json(rows);
  });
});

// START
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
