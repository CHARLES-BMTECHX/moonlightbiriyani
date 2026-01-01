const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* ───────────────── 1. Trust Render Proxy ───────────────── */
app.set("trust proxy", 1);

/* ───────────────── 2. CORS CONFIG (FIXED & SAFE) ───────────────── */
const allowedOrigins = [
  process.env.FRONTEND_URL,      // https://moonlightbriyani.com
  process.env.PRODUCTION_URL,    // https://www.moonlightbriyani.com
  "http://localhost:3000"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader("Vary", "Origin");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* ───────────────── 3. Global Middleware ───────────────── */
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

/* ───────────────── 4. HEALTH CHECK API (IMPORTANT) ───────────────── */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Moonlight Briyani API is running",
    env: process.env.NODE_ENV
  });
});

/* ───────────────── 5. Database Connection ───────────────── */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err.message)
  );

/* ───────────────── 6. Routes ───────────────── */
app.use("/api/auth", require("./routes/AuthRoute"));
app.use("/api/products", require("./routes/ProductRoute"));
app.use("/api/address", require("./routes/AddressRoute"));
app.use("/api/cart", require("./routes/CartRoute"));
app.use("/api/orders", require("./routes/OrderRoute"));
app.use("/api/payment-details", require("./routes/PaymentDetailRoute"));
app.use("/api/reviews", require("./routes/ReviewRoute"));
app.use("/api/favorites", require("./routes/FavoriteRoute"));
app.use("/api/hero-banners", require("./routes/HeroBannerRoute"));
app.use("/api/admin/dashboard", require("./routes/AdminDashboardRoute"));

/* ───────────────── 7. 404 Handler ───────────────── */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* ───────────────── 8. Global Error Handler ───────────────── */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

/* ───────────────── 9. Start Server ───────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
