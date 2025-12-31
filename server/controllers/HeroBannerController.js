const HeroBanner = require("../models/HeroBanner");
const fs = require("fs");
const path = require("path");
const cloudinary =require("../config/cloudinary");

// /* ================= CREATE ================= */
// exports.createHeroBanner = async (req, res) => {
//   try {
//     const { title } = req.body;

//     if (!title || !req.file) {
//       return res.status(400).json({ message: "Title and banner image are required" });
//     }

//     const SERVER_URL = process.env.SERVER_URL.replace(/\/$/, "");
//     const imageUrl = `${SERVER_URL}/${req.file.path.replace(/\\/g, "/")}`;

//     const banner = await HeroBanner.create({
//       title,
//       bannerImage: imageUrl,
//     });

//     res.status(201).json({
//       message: "Hero banner created successfully",
//       data: banner,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


exports.createHeroBanner = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({ message: "Title and banner image are required" });
    }

    // req.file.path is the Cloudinary URL (e.g., https://res.cloudinary.com/.../hero_banners/xxx.jpg)
    const imageUrl = req.file.path; // or req.file.secure_url for HTTPS

    const banner = await HeroBanner.create({
      title,
      bannerImage: imageUrl,
    });

    res.status(201).json({
      message: "Hero banner created successfully",
      data: banner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
exports.getHeroBanners = async (req, res) => {
  try {
    const banners = await HeroBanner.find().sort({ createdAt: -1 });
    res.status(200).json({ data: banners });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET BY ID ================= */
exports.getHeroBannerById = async (req, res) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Hero banner not found" });
    }
    res.status(200).json({ data: banner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// /* ================= UPDATE ================= */
// exports.updateHeroBanner = async (req, res) => {
//   try {
//     const { title } = req.body;

//     const banner = await HeroBanner.findById(req.params.id);
//     if (!banner) {
//       return res.status(404).json({ message: "Hero banner not found" });
//     }

//     /* Delete old image */
//     if (req.file && banner.bannerImage) {
//       const oldPath = banner.bannerImage.replace(process.env.SERVER_URL, "");
//       const resolvedPath = path.resolve(oldPath.replace(/^\/+/, ""));
//       if (fs.existsSync(resolvedPath)) fs.unlinkSync(resolvedPath);
//     }

//     if (req.file) {
//       const SERVER_URL = process.env.SERVER_URL.replace(/\/$/, "");
//       banner.bannerImage = `${SERVER_URL}/${req.file.path.replace(/\\/g, "/")}`;
//     }

//     banner.title = title || banner.title;
//     await banner.save();

//     res.status(200).json({
//       message: "Hero banner updated successfully",
//       data: banner,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// /* ================= DELETE ================= */
// exports.deleteHeroBanner = async (req, res) => {
//   try {
//     const banner = await HeroBanner.findById(req.params.id);
//     if (!banner) {
//       return res.status(404).json({ message: "Hero banner not found" });
//     }

//     if (banner.bannerImage) {
//       const imgPath = banner.bannerImage.replace(process.env.SERVER_URL, "");
//       const resolvedPath = path.resolve(imgPath.replace(/^\/+/, ""));
//       if (fs.existsSync(resolvedPath)) fs.unlinkSync(resolvedPath);
//     }

//     await banner.deleteOne();

//     res.status(200).json({ message: "Hero banner deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.updateHeroBanner = async (req, res) => {
  try {
    const { title } = req.body;

    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Hero banner not found" });
    }

    /* Delete old image from Cloudinary */
    if (req.file && banner.bannerImage) {
      // Extract public_id from old URL (e.g., from "hero_banners/abc123")
      const publicId = banner.bannerImage
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0]; // removes extension

      await cloudinary.uploader.destroy(publicId);
    }

    /* New image uploaded */
    if (req.file) {
      banner.bannerImage = req.file.path; // Cloudinary URL
    }

    banner.title = title || banner.title;
    await banner.save();

    res.status(200).json({
      message: "Hero banner updated successfully",
      data: banner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteHeroBanner = async (req, res) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Hero banner not found" });
    }

    if (banner.bannerImage) {
      const publicId = banner.bannerImage
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

      await cloudinary.uploader.destroy(publicId);
    }

    await banner.deleteOne();

    res.status(200).json({ message: "Hero banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
