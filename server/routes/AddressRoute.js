// routes/address.js
const express = require('express');
const { protect } = require('../middleware/Auth');
const {
  addAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} = require('../controllers/AddressController');

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes
router
  .route('/')
  .post(addAddress)        // Create
  .get(getAddresses);      // Get all

router
  .route('/:id')
  .get(getAddressById)     // Get one
  .patch(updateAddress)    // Update (use PATCH for partial updates)
  .delete(deleteAddress);  // Delete

module.exports = router;
