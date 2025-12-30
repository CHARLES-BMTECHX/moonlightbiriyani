// routes/cart.js
const express = require('express');
const { protect } = require('../middleware/Auth');
const {
  getMyCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getMyCartItems
} = require('../controllers/CartController');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getMyCart)
  .post(addToCart)
  .delete(clearCart); // Clear entire cart
router.route('/items').get(getMyCartItems);
router.route('/items/:id')
  .patch(updateCartItem)   // Update quantity
  .delete(removeFromCart); // Remove item

module.exports = router;
