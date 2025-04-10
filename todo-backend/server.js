/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;
const SECRET = "secret_key"; // you can store this in .env file in production

app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = "./users.json";

function readUsers() {
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data).users;
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2));
}

// ✅ Middleware to verify token and attach user to req
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Token missing" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded.username;
    next();
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
}

// 🔐 SIGNUP
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  if (users[username]) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 8);
  users[username] = {
    password: hashed,
    tasks: { completed: [], incomplete: [] },
  };

  writeUsers(users);
  res.json({ msg: "Signup successful" });
});

// 🔐 LOGIN
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users[username];
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

  res.json({ msg: "Login successful", token });
});

// 📋 GET TASKS
app.get("/api/tasks", authenticate, (req, res) => {
  const users = readUsers();
  const user = users[req.user];
  res.json(user.tasks);
});

// ➕ ADD TASK
app.post("/api/tasks", authenticate, (req, res) => {
  const { task } = req.body;
  const users = readUsers();
  users[req.user].tasks.incomplete.push(task);
  writeUsers(users);
  res.json({ msg: "Task added" });
});

// 🔁 TOGGLE TASK
app.put("/api/tasks/toggle", authenticate, (req, res) => {
  const { task, from } = req.body;
  const users = readUsers();
  const fromList = users[req.user].tasks[from];
  const toList =
    from === "incomplete"
      ? users[req.user].tasks.completed
      : users[req.user].tasks.incomplete;

  users[req.user].tasks[from] = fromList.filter((t) => t !== task);
  toList.push(task);

  writeUsers(users);
  res.json({ msg: "Task moved" });
});

// ❌ DELETE TASK
app.delete("/api/tasks", authenticate, (req, res) => {
  const { task, from } = req.body;
  const users = readUsers();
  users[req.user].tasks[from] = users[req.user].tasks[from].filter(
    (t) => t !== task
  );
  writeUsers(users);
  res.json({ msg: "Task deleted" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
