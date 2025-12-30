// const express = require("express");
// const router = express.Router();

// const upload = require("../middleware/BannerUpload");
// const {
//   createHeroBanner,
//   getHeroBanners,
//   getHeroBannerById,
//   updateHeroBanner,
//   deleteHeroBanner,
// } = require("../controllers/HeroBannerController");

// router.post("/", upload.single("bannerImage"), createHeroBanner);
// router.get("/", getHeroBanners);
// router.get("/:id", getHeroBannerById);
// router.put("/:id", upload.single("bannerImage"), updateHeroBanner);
// router.delete("/:id", deleteHeroBanner);

// module.exports = router;



const express = require("express");
const router = express.Router();

const upload = require("../middleware/BannerUpload"); // This now uses Cloudinary

const {
  createHeroBanner,
  getHeroBanners,       // You probably have this
  getHeroBannerById,     // You probably have this
  updateHeroBanner,
  deleteHeroBanner,
} = require("../controllers/HeroBannerController");

// CREATE - POST /api/hero-banners
router.post("/", upload.single("bannerImage"), createHeroBanner);

// GET ALL - GET /api/hero-banners
router.get("/", getHeroBanners);

// GET ONE - GET /api/hero-banners/:id
router.get("/:id", getHeroBannerById);

// UPDATE - PUT /api/hero-banners/:id
router.put("/:id", upload.single("bannerImage"), updateHeroBanner);

// DELETE - DELETE /api/hero-banners/:id
router.delete("/:id", deleteHeroBanner);

module.exports = router;
