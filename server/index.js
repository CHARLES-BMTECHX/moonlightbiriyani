const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan"); // cors package is no longer needed
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* ───────────────── 1. Render Proxy Setting ───────────────── */
app.set("trust proxy", 1);


/* ───────────────── 2. MANUAL CORS FIX (The Nuclear Option) ───────────────── */
// This manually writes the headers for every single request.
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://moonlightbriyani.com",
    "https://www.moonlightbriyani.com",
    "http://localhost:3000"
  ];

  const origin = req.headers.origin;

  // Allow the request if the origin is in our list OR if it's a server-to-server call (no origin)
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // IMPORTANT: Handle the 'Preflight' (OPTIONS) check immediately
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});


/* ───────────────── 3. Global Middleware ───────────────── */
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static("uploads"));


/* ───────────────── 4. Database Connection ───────────────── */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
    // Do not exit process here, let the server stay alive to show errors
  });


/* ───────────────── 5. Routes ───────────────── */
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


/* ───────────────── 6. 404 Handler ───────────────── */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


/* ───────────────── 7. Global Error Handler ───────────────── */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
});


/* ───────────────── 8. Start Server ───────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
