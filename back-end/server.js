import express from "express";
import cors from "cors";
import { users, findUser, addUser, logOutAllUsers } from "./users.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/register", (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  // Server-side validation
  const errors = {};
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }
  const emailRegex = /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    errors.password =
      "Password must be at least 8 characters and contain both letters and numbers";
  }
  const phoneRegex = /^\+380\d{9}$/;
  if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
    errors.phoneNumber = "Phone number must be in format +380XXXXXXXXX";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  if (findUser(email)) {
    return res.status(400).json({ error: "Email is already taken" });
  }

  const newUser = addUser(name, email, password, phoneNumber);
  res.status(201).json({ user: newUser });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = findUser(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Wrong email or password" });
  }

  logOutAllUsers();
  user.loggedIn = true;

  res.json({ user });
});

app.get("/current-user", (req, res) => {
  const loggedInUser = users.find((u) => u.loggedIn);
  if (!loggedInUser) {
    return res.status(404).json({ error: "No user logged in" });
  }
  res.json({ user: loggedInUser });
});

app.post("/logout", (req, res) => {
  logOutAllUsers();
  res.json({ message: "Logged out" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
