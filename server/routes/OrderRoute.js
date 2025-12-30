// const express = require("express");
// const router = express.Router();

// const {
//   placeOrder,
//   uploadPaymentScreenshot,
//   getMyOrders,
//   getOrderByCode,
//   getAllOrders,
//   updateOrderStatus,
//   getLatestOrderCode,
// } = require("../controllers/OrderController");

// const { protect, admin } = require("../middleware/Auth");
// const upload = require("../middleware/orderScreenshotUpload");

// // User Routes
// router.post("/place", protect, placeOrder);
// router.post(
//   "/:orderId/screenshot",
//   protect,
//   upload.single("screenshot"),
//   uploadPaymentScreenshot
// );
// router.get("/my", protect, getMyOrders);
// router.get("/code/:code", protect, getOrderByCode);

// // Admin Routes
// router.get("/admin/all", protect, admin, getAllOrders);
// router.put("/admin/:orderId/status", protect, admin, updateOrderStatus);
// router.get("/latest/code/:orderId", protect, getLatestOrderCode);

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  placeOrder,
  uploadPaymentScreenshot,
  getMyOrders,
  getOrderByCode,
  getAllOrders,
  updateOrderStatus,
  getLatestOrderCode,
} = require("../controllers/OrderController");

const { protect, admin } = require("../middleware/Auth");
const upload = require("../middleware/orderScreenshotUpload"); // Now Cloudinary!

// User Routes
router.post("/place", protect, placeOrder);
router.post(
  "/:orderId/screenshot",
  protect,
  upload.single("screenshot"), // Field name must be "screenshot"
  uploadPaymentScreenshot
);
router.get("/my", protect, getMyOrders);
router.get("/code/:code", protect, getOrderByCode);

// Admin Routes
router.get("/admin/all", protect, admin, getAllOrders);
router.put("/admin/:orderId/status", protect, admin, updateOrderStatus);
router.get("/latest/code/:orderId", protect, getLatestOrderCode);

module.exports = router;
