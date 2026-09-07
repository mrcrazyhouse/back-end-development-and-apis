import express from "express";
import helmet from "helmet";

import watchlistRoutes from "./routes/watchlist.js";

const PORT = process.env.PORT;
const app = express();

// Middleware keamanan HTTP headers
app.use(helmet());

// Middleware agar Express bisa membaca body JSON dari request
app.use(express.json());

// Route untuk cek server aktif
app.get("/", (req, res) => {
  res.send("Family Movie Watchlist API");
});

// Semua route watchlist diakses dengan prefix /api/watchlist
app.use("/api/watchlist", watchlistRoutes);

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});