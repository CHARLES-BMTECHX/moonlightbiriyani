const mongoose = require("mongoose");

const paymentDetailsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },

    qrCodeImage: {
      type: String, // public URL
      required: true,
    },

    qrCodeImagePath: {
      type: String, // local file path
      required: true,
    },

    upiId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

paymentDetailsSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model("PaymentDetails", paymentDetailsSchema);
