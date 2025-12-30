const express = require("express");
const router = express.Router();

const {
  setPaymentDetails,
  getActivePaymentDetails,
  getMyPaymentDetails,
  deactivatePaymentDetails,
  deletePaymentDetails,
  getMyPaymentDetailsForOrder,
} = require("../controllers/PaymentDetailController");

const { protect, admin } = require("../middleware/Auth");
const upload = require("../middleware/paymentQrUpload");

// Public
router.get("/active", getActivePaymentDetails);

// Protected
router.use(protect);

router.post("/setup", admin, upload.single("qrCode"), setPaymentDetails);
router.get("/me", getMyPaymentDetails);
router.get("/order-account", getMyPaymentDetailsForOrder);
router.put("/deactivate", admin, deactivatePaymentDetails);
router.delete("/", admin, deletePaymentDetails);

module.exports = router;
