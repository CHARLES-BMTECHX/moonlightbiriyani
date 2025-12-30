const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceAtOrder: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "UPI"],
      required: true,
    },

    // ✅ Local upload
    paymentScreenshot: {
      type: String, // public URL
      default: null,
    },

    paymentScreenshotPath: {
      type: String, // local file path
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Verified",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    uniqueCode: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Auto generate unique order code
orderSchema.pre("save", function (next) {
  if (!this.uniqueCode) {
    this.uniqueCode =
      "ORD" +
      Date.now().toString(36).toUpperCase() +
      Math.floor(Math.random() * 999);
  }
  next();
});

// Auto-populate
orderSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "items.product",
      select: "name image price stock",
    },
    {
      path: "address",
      select: "label addressLine1 addressLine2 city state pincode country",
    },
    {
      path: "user",
      select: "username email phone",
    },
  ]);
  next();
});

module.exports = mongoose.model("Order", orderSchema);
