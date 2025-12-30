const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
const cloudinary=require("../config/cloudinary");

const SERVER_URL = process.env.SERVER_URL;

// @desc Get all products (Public)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc Create product (Admin)
// exports.createProduct = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Please upload a product image",
//       });
//     }

//     const imageUrl = `${SERVER_URL}/uploads/products/${req.file.filename}`;

//     const product = await Product.create({
//       ...req.body,
//       image: imageUrl,
//       image_path: req.file.path, // store for deletion
//     });

//     res.status(201).json({
//       success: true,
//       data: product,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// @desc Create product (Admin)
exports.createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a product image",
      });
    }

    // req.file.path = Cloudinary secure URL
    const imageUrl = req.file.path;

    const product = await Product.create({
      ...req.body,
      image: imageUrl,
      // Optional: store public_id for easier deletion later
      // image_public_id: req.file.filename || req.file.public_id,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update product (Admin)
// exports.updateProduct = async (req, res) => {
//   try {
//     const updates = { ...req.body };

//     if (req.file) {
//       const oldProduct = await Product.findById(req.params.id);

//       if (oldProduct?.image_path && fs.existsSync(oldProduct.image_path)) {
//         fs.unlinkSync(oldProduct.image_path);
//       }

//       updates.image = `${SERVER_URL}/uploads/products/${req.file.filename}`;
//       updates.image_path = req.file.path;
//     }

//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       updates,
//       { new: true, runValidators: true }
//     );

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: product,
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// @desc Update product (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (req.file) {
      const oldProduct = await Product.findById(req.params.id);

      if (oldProduct?.image) {
        try {
          // Extract public_id: usually "products/filename" without extension
          const publicId = oldProduct.image
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];

          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn("Failed to delete old product image from Cloudinary:", err);
        }
      }

      updates.image = req.file.path; // New Cloudinary URL
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Delete product (Admin)
// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     if (product.image_path && fs.existsSync(product.image_path)) {
//       fs.unlinkSync(product.image_path);
//     }

//     await product.deleteOne();

//     res.json({
//       success: true,
//       message: "Product deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// @desc Delete product (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete image from Cloudinary
    if (product.image) {
      try {
        const publicId = product.image
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];

        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.warn("Failed to delete product image from Cloudinary:", err);
      }
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
