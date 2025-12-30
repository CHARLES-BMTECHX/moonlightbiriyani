// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper: Find user's cart (create if not exists)
const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @desc    Get user's cart
const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name price image stock',
      });

    if (!cart) {
      return res.json({
        success: true,
        data: { items: [], total: 0 },
      });
    }

    // Calculate total price
    const total = cart.items.reduce((acc, item) => {
      if (item.product) {
        return acc + item.product.price * item.quantity;
      }
      return acc;
    }, 0);

    res.json({
      success: true,
      data: {
        items: cart.items,
        total,
        itemsCount: cart.items.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getMyCartItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 1. Get the total count of items first (needed for frontend pagination logic)
    const cartForCount = await Cart.findOne({ user: req.user._id });

    if (!cartForCount) {
      return res.json({
        success: true,
        data: { items: [], total: 0, totalItems: 0, currentPage: page },
      });
    }

    const totalItems = cartForCount.items.length;

    // 2. Fetch the specific slice of items
    const cart = await Cart.findOne({ user: req.user._id })
      .select({
        items: { $slice: [skip, limit] } // MongoDB slice to paginate array
      })
      .populate({
        path: 'items.product',
        select: 'name price image stock type cuisine meat', // Added fields based on screenshot
      });

    // 3. Calculate Total Price (Note: This must be calculated on the FULL cart, not just the page)
    // Since we only fetched a slice, we might need the full cart for grand total.
    // Optimization: Calculate total on the frontend or fetch full items just for calculation.
    // For accuracy, let's calculate total on the full 'cartForCount' we fetched earlier.
    // (Assuming we populate it, or we store price in cart item. Here we assume generic calculation).

    // To keep it performant, we will send the total of *current page* or
    // you should store 'grandTotal' in the Cart Schema to avoid heavy calc every time.
    // For now, let's just return the paginated items.

    res.json({
      success: true,
      data: {
        items: cart.items,
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items in stock`,
      });
    }

    const cart = await getCart(req.user._id);

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity
      const newQty = cart.items[itemIndex].quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${product.stock} in stock`,
        });
      }
      cart.items[itemIndex].quantity = newQty;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name price image stock',
    });

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update item quantity
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params; // productId in cart

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === id
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    const product = await Product.findById(id);
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available`,
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name price image stock',
    });

    res.json({
      success: true,
      message: 'Cart updated',
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params; // productId

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== id
    );

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name price image stock',
    });

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Clear entire cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });

    res.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getMyCartItems,
};
