const Favorite = require("../models/Favorite");

/**
 * ✅ TOGGLE FAVORITE (Add / Remove)
 * POST /api/favorites/toggle
 */
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const existing = await Favorite.findOne({
      user_id: userId,
      product_id: productId,
    });

    // If exists → remove
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return res.json({
        success: true,
        message: "Removed from favorites",
        isFavorite: false,
      });
    }

    // Else → add
    await Favorite.create({
      user_id: userId,
      product_id: productId,
    });

    res.json({
      success: true,
      message: "Added to favorites",
      isFavorite: true,
    });
  } catch (error) {
    console.error("Toggle Favorite Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ GET MY FAVORITES
 * GET /api/favorites/my
 */
exports.getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user_id: req.user._id })
      .populate("product_id", "name image price stock")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: favorites.length,
      data: favorites,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ GET FAVORITES BY USER ID (ADMIN)
 * GET /api/favorites/user/:userId
 */
exports.getFavoritesByUserId = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user_id: req.params.userId })
      .populate("product_id", "name image price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ✅ DELETE FAVORITE (Explicit)
 * DELETE /api/favorites/:productId
 */
exports.deleteFavorite = async (req, res) => {
  try {
    await Favorite.deleteOne({
      user_id: req.user._id,
      product_id: req.params.productId,
    });

    res.json({
      success: true,
      message: "Favorite removed",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
