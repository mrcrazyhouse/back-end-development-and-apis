import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";      // ← Tambahkan
import { findByUsername } from "../utils/db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;  // ← Tambahkan

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const user = findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // ── Buat JWT Token ────────────────────────────────────────
  const token = jwt.sign(
    {
      id: user.id,           // ← ID user (number)
      username: user.username,
      role: user.role,       // ← "parent" atau "child"
    },
    JWT_SECRET,              // ← Secret key untuk tanda tangan
    { expiresIn: "1h" }      // ← Token kadaluarsa dalam 1 jam
  );
  // ─────────────────────────────────────────────────────────

  res.json({
    message: "Login successful",
    token,   // ← Kirim token ke client
  });
});

export default router;