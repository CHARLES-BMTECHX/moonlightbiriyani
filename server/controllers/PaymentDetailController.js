const PaymentDetails = require("../models/PaymentDetailModel");
const fs = require("fs/promises");
const cloudinary=require("../config/cloudinary")
const SERVER_URL = process.env.SERVER_URL;

/**
 * CREATE / UPDATE
 */
// exports.setPaymentDetails = async (req, res) => {
//   try {
//     const { upiId, phone, accountHolderName } = req.body;
//     const userId = req.user._id;

//     if (!upiId || !phone || !accountHolderName) {
//       return res.status(400).json({
//         message: "UPI ID, Phone, and Account Holder Name are required",
//       });
//     }

//     const existing = await PaymentDetails.findOne({ user: userId });

//     let qrCodeImage = existing?.qrCodeImage;
//     let qrCodeImagePath = existing?.qrCodeImagePath;

//     if (req.file) {
//       if (qrCodeImagePath) {
//         try {
//           await fs.unlink(qrCodeImagePath);
//         } catch {}
//       }

//       qrCodeImagePath = req.file.path;
//       qrCodeImage = `${SERVER_URL}/uploads/payment/${req.file.filename}`;
//     }

//     if (!qrCodeImage || !qrCodeImagePath) {
//       return res.status(400).json({ message: "QR Code image is required" });
//     }

//     const paymentDetails = await PaymentDetails.findOneAndUpdate(
//       { user: userId },
//       {
//         user: userId,
//         accountHolderName: accountHolderName.trim(),
//         qrCodeImage,
//         qrCodeImagePath,
//         upiId: upiId.trim().toLowerCase(),
//         phone: phone.trim(),
//         isActive: true,
//       },
//       { upsert: true, new: true }
//     );

//     res.json({
//       message: "Payment details saved successfully",
//       data: paymentDetails,
//     });
//   } catch (error) {
//     console.error("SET PAYMENT ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

exports.setPaymentDetails = async (req, res) => {
  try {
    const { upiId, phone, accountHolderName } = req.body;
    const userId = req.user._id;

    if (!upiId || !phone || !accountHolderName) {
      return res.status(400).json({
        message: "UPI ID, Phone, and Account Holder Name are required",
      });
    }

    const existing = await PaymentDetails.findOne({ user: userId });

    let qrCodeImage = existing?.qrCodeImage; // Cloudinary URL

    // If new file uploaded
    if (req.file) {
      // Delete old QR from Cloudinary if exists
      if (existing?.qrCodeImage) {
        try {
          const publicId = existing.qrCodeImage
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0]; // extracts folder/filename without extension

          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn("Failed to delete old QR from Cloudinary:", err);
        }
      }

      // New Cloudinary URL
      qrCodeImage = req.file.path; // e.g., https://res.cloudinary.com/.../payment_qr_codes/abc123.jpg
    }

    // If no QR image at all (first time or removed)
    if (!qrCodeImage) {
      return res.status(400).json({ message: "QR Code image is required" });
    }

    const paymentDetails = await PaymentDetails.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        accountHolderName: accountHolderName.trim(),
        qrCodeImage, // now stores Cloudinary URL
        upiId: upiId.trim().toLowerCase(),
        phone: phone.trim(),
        isActive: true,
      },
      { upsert: true, new: true }
    );

    res.json({
      message: "Payment details saved successfully",
      data: paymentDetails,
    });
  } catch (error) {
    console.error("SET PAYMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUBLIC – ACTIVE PAYMENT
 */
exports.getActivePaymentDetails = async (req, res) => {
  const details = await PaymentDetails.findOne({ isActive: true })
    .select("qrCodeImage upiId phone accountHolderName")
    .lean();

  if (!details) {
    return res.status(404).json({ message: "Payment not configured" });
  }

  res.json({ data: details });
};

/**
 * ADMIN – OWN PAYMENT DETAILS
 */
exports.getMyPaymentDetails = async (req, res) => {
  const details = await PaymentDetails.findOne({ user: req.user._id });

  if (!details) {
    return res.status(404).json({ message: "No payment details found" });
  }

  res.json({ data: details });
};

/**
 * FOR ORDER PAGE
 */
exports.getMyPaymentDetailsForOrder = async (req, res) => {
  const details = await PaymentDetails.findOne({ isActive: true })
    .select("qrCodeImage upiId phone accountHolderName")
    .lean();

  if (!details) {
    return res.status(404).json({ message: "No active payment found" });
  }

  res.json({ data: details });
};

/**
 * ADMIN – DEACTIVATE
 */
exports.deactivatePaymentDetails = async (req, res) => {
  const details = await PaymentDetails.findOneAndUpdate(
    { user: req.user._id },
    { isActive: false },
    { new: true }
  );

  if (!details) {
    return res.status(404).json({ message: "Payment details not found" });
  }

  res.json({ message: "Payment details deactivated" });
};

/**
 * ADMIN – DELETE
 */
// exports.deletePaymentDetails = async (req, res) => {
//   try {
//     const details = await PaymentDetails.findOne({ user: req.user._id });

//     if (!details) {
//       return res.status(404).json({ message: "Payment details not found" });
//     }

//     if (details.isActive) {
//       return res
//         .status(400)
//         .json({ message: "Deactivate payment before deleting" });
//     }

//     if (details.qrCodeImagePath) {
//       try {
//         await fs.unlink(details.qrCodeImagePath);
//       } catch {}
//     }

//     await details.deleteOne();

//     res.json({ message: "Payment details deleted permanently" });
//   } catch (error) {
//     console.error("DELETE PAYMENT ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };


exports.deletePaymentDetails = async (req, res) => {
  try {
    const details = await PaymentDetails.findOne({ user: req.user._id });

    if (!details) {
      return res.status(404).json({ message: "Payment details not found" });
    }

    if (details.isActive) {
      return res
        .status(400)
        .json({ message: "Deactivate payment before deleting" });
    }

    // Delete QR image from Cloudinary
    if (details.qrCodeImage) {
      try {
        const publicId = details.qrCodeImage
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];

        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.warn("Failed to delete QR from Cloudinary:", err);
      }
    }

    await details.deleteOne();

    res.json({ message: "Payment details deleted permanently" });
  } catch (error) {
    console.error("DELETE PAYMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
