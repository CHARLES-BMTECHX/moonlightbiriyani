// const express = require("express");
// const { protect, admin } = require("../middleware/Auth");
// const upload = require("../middleware/productUpload");

// const {
//   getProducts,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// } = require("../controllers/ProductController");

// const router = express.Router();

// // Public
// router.get("/", getProducts);

// // Admin
// router.post("/", protect, admin, upload.single("image"), createProduct);

// router
//   .route("/:id")
//   .put(protect, admin, upload.single("image"), updateProduct)
//   .delete(protect, admin, deleteProduct);

// module.exports = router;


const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/Auth");
const upload = require("../middleware/productUpload"); // ← Now uses Cloudinary!

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  // Add any other product controllers here if you have them
} = require("../controllers/ProductController");

// Public Routes
router.get("/", getProducts);

// Admin Protected Routes
router.post(
  "/",
  protect,
  admin,
  upload.single("image"), // Field name must be "image" in FormData
  createProduct
);

router
  .route("/:id")
  .put(protect, admin, upload.single("image"), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
