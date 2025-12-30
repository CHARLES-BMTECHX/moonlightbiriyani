const mongoose = require("mongoose");

const HeroBannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bannerImage: {
      type: String, // stored file path
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroBanner", HeroBannerSchema);
