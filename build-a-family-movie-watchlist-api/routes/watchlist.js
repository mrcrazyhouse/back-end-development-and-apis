import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";  // ← Tambahkan
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

const router = express.Router();

// authenticate → berlaku untuk SEMUA route
router.use(authenticate);

// ─────────────────────────────────────────
// GET /api/watchlist/:userId
// Hanya butuh authenticate — semua user yang login bisa lihat watchlist siapapun
// ─────────────────────────────────────────
router.get("/:userId", (req, res) => {
  const userId = Number(req.params.userId);

  const watchlist = getWatchlist(userId);

  if (watchlist === null) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(watchlist);
});

// ─────────────────────────────────────────
// POST /api/watchlist/:userId/movies
// Butuh authenticate + authorizeModification
// (child hanya bisa POST ke watchlist sendiri)
// ─────────────────────────────────────────
router.post("/:userId/movies", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const { title, genre } = req.body;

  if (!title || !genre) {
    return res.status(400).json({ error: "title and genre are required" });
  }

  const movie = addMovie(userId, { title, genre });

  if (movie === null) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(201).json(movie);
});

// ─────────────────────────────────────────
// PUT /api/watchlist/:userId/movies/:movieId
// Butuh authenticate + authorizeModification
// ─────────────────────────────────────────
router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);

  const updated = updateMovie(userId, movieId, req.body);

  if (updated === null) {
    return res.status(404).json({ error: "Movie or user not found" });
  }

  res.json(updated);
});

// ─────────────────────────────────────────
// DELETE /api/watchlist/:userId/movies/:movieId
// Butuh authenticate + authorizeModification
// ─────────────────────────────────────────
router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);

  const result = deleteMovie(userId, movieId);

  if (result === null) {
    return res.status(404).json({ error: "Movie or user not found" });
  }

  res.json({ message: "Movie deleted successfully" });
});

export default router;