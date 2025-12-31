const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* ───────────────── CORS Configuration (FINAL FIX) ───────────────── */

const allowedOrigins = [
  "https://moonlightbriyani.com",
  "https://www.moonlightbriyani.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    // ✅ Allow Postman / server-to-server
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(cleanOrigin)) {
      // ✅ MUST return origin string (NOT true / false)
      return callback(null, cleanOrigin);
    }

    console.warn("❌ CORS blocked for:", cleanOrigin);

    // ❌ Never return false (breaks CORS headers)
    // ✅ Fallback to first allowed origin
    return callback(null, allowedOrigins[0]);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

/* Apply CORS ONCE (IMPORTANT) */
app.use(cors(corsOptions));

/* ───────────────── Global Middleware ───────────────── */

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* Static files */
app.use("/uploads", express.static("uploads"));

/* ───────────────── Database Connection ───────────────── */

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    process.exit(1);
  });

/* ───────────────── Routes ───────────────── */

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

/* ───────────────── 404 Handler ───────────────── */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ───────────────── Global Error Handler ───────────────── */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
});

/* ───────────────── Start Server ───────────────── */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
