const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/Auth");

const {
  toggleFavorite,
  getMyFavorites,
  getFavoritesByUserId,
  deleteFavorite,
} = require("../controllers/FavoriteController");

// 🔐 Protect all routes
router.use(protect);

// User routes
router.post("/toggle", toggleFavorite);
router.get("/my", getMyFavorites);
router.delete("/:productId", deleteFavorite);

// Admin route
router.get("/user/:userId", admin, getFavoritesByUserId);

module.exports = router;
