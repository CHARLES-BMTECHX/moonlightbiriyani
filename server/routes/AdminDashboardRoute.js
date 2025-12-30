const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/Auth");
const {
  getAdminDashboardOverview,
} = require("../controllers/AdminDashboardController");

router.get("/overview", protect, admin, getAdminDashboardOverview);

module.exports = router;
