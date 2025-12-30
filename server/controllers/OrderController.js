// controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/AddressModel');
const fs = require("fs/promises");
const cloudinary=require("../config/cloudinary");

const SERVER_URL = process.env.SERVER_URL;

/**
 * PLACE ORDER
 */
exports.placeOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod } = req.body;
    const userId = req.user._id;

    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) {
      return res
        .status(400)
        .json({ message: "Invalid or unauthorized address" });
    }

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      priceAtOrder: item.product.price,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.priceAtOrder * item.quantity,
      0
    );

    const order = await Order.create({
      user: userId,
      address: addressId,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
    });

    await Cart.deleteOne({ user: userId });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPLOAD PAYMENT SCREENSHOT (UPI)
 */
// exports.uploadPaymentScreenshot = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const userId = req.user._id;

//     const order = await Order.findOne({ _id: orderId, user: userId });
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (order.paymentMethod !== "UPI") {
//       return res
//         .status(400)
//         .json({ message: "Screenshot only allowed for UPI payments" });
//     }

//     if (order.paymentScreenshot) {
//       return res
//         .status(400)
//         .json({ message: "Screenshot already uploaded" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     order.paymentScreenshot = `${SERVER_URL}/uploads/order-payments/${req.file.filename}`;
//     order.paymentScreenshotPath = req.file.path;
//     order.status = "Paid";

//     await order.save();

//     res.json({
//       message: "Screenshot uploaded & payment marked as Paid",
//       order,
//     });
//   } catch (error) {
//     console.error("Upload Screenshot Error:", error);
//     res.status(500).json({ message: "Upload failed" });
//   }
// };

exports.uploadPaymentScreenshot = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentMethod !== "UPI") {
      return res
        .status(400)
        .json({ message: "Screenshot only allowed for UPI payments" });
    }

    if (order.paymentScreenshot) {
      return res
        .status(400)
        .json({ message: "Screenshot already uploaded" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Optional: Delete any old screenshot (in case of future updates)
    if (order.paymentScreenshot) {
      try {
        const publicId = order.paymentScreenshot
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.warn("Failed to delete old screenshot:", err);
      }
    }

    // Save new Cloudinary URL
    order.paymentScreenshot = req.file.path; // e.g., https://res.cloudinary.com/.../order_payment_screenshots/abc.jpg
    order.status = "Paid"; // or "Payment Received", depending on your flow

    await order.save();

    res.json({
      message: "Screenshot uploaded & payment marked as Paid",
      order,
    });
  } catch (error) {
    console.error("Upload Screenshot Error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

// Get My Orders (User) with Pagination
exports.getMyOrders = async (req, res) => {
  try {
    // 1. Extract page and limit from query string (default to Page 1, Limit 10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 2. Get total count for pagination math
    const totalOrders = await Order.countDocuments({ user: req.user._id });

    // 3. Fetch orders with skip/limit
    // Note: Population is handled by your Order model's pre(/^find/) hook automatically
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 4. Return data + pagination info
    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        limit
      }
    });

  } catch (error) {
    console.error("Error fetching my orders:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Order by uniqueCode (Admin + User)
exports.getOrderByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const order = await Order.findOne({ uniqueCode: code.toUpperCase() });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Allow user to access their own order
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get All Orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      total,
      pages: Math.ceil(total / limit),
      currentPage: +page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Paid', 'Verified', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Get latest order unique code for logged-in user
exports.getLatestOrderCode = async (req, res) => {
  try {
    const userId = req.user._id;

    const order = await Order.findOne({ user: userId })
      .sort({ createdAt: -1 }) // ✅ latest order
      .select('uniqueCode status createdAt');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No orders found',
      });
    }

    res.json({
      success: true,
      data: {
        uniqueCode: order.uniqueCode,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error('Latest Order Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch latest order',
    });
  }
};
