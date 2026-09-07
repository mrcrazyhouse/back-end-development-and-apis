import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function authenticate(req, res, next) {
  // 1. Ambil header Authorization
  //    Format yang diharapkan: "Bearer eyJhbGciOiJIUzI1NiJ9..."
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // 2. Kalau tidak ada token, tolak dengan 401
  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }

  // 3. Verifikasi token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // ← Simpan info user ke dalam request
    next();              // ← Lanjutkan ke handler berikutnya
  } catch (err) {
    // Token tidak valid atau sudah kadaluarsa
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}