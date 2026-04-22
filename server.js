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

const db = new sqlite3.Database("./database.sqlite");

// ================= TABLES =================
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

// ================= ADMIN =================
const createAdmin = async () => {
  const hash = await bcrypt.hash("1234", 10);

  db.run(
    "INSERT OR IGNORE INTO users (email,password,role) VALUES (?,?,?)",
    ["admin@comcast.com", hash, "admin"]
  );
};
createAdmin();

// ================= HOME =================
app.get("/", (req, res) => {
  res.send("HR Backend Running");
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email=?", [email], async (err, user) => {
    if (!user) return res.status(401).json({ error: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
    res.json({ token });
  });
});

// ================= AUTH =================
function auth(req, res, next) {
  try {
    jwt.verify(req.headers.authorization, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

// ================= APPLY =================
app.post("/applications", (req, res) => {
  const { name, email, number, position } = req.body;

  db.run(
    "INSERT INTO applications (name,email,number,position,status) VALUES (?,?,?,?,?)",
    [name, email, number, position, "Pending"],
    () => res.json({ success: true })
  );
});

// ================= GET APPLICATIONS =================
app.get("/applications", auth, (req, res) => {
  db.all("SELECT * FROM applications ORDER BY id DESC", (err, rows) => {
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
