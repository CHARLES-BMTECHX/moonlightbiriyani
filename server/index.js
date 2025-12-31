const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

/* ───────────────── 1. Essential Render Configuration ───────────────── */
// Required for apps behind a proxy like Render/Heroku to handle HTTPS correctly
app.set("trust proxy", 1);


/* ───────────────── 2. CORS Configuration (Fixed) ───────────────── */

const allowedOrigins = [
  "https://moonlightbriyani.com",
  "https://www.moonlightbriyani.com",
  "http://localhost:3000", // Useful for local testing
  "http://localhost:5173"  // Useful if you switch to Vite later
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);

    // Check if the origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS Blocked Request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS Middleware
app.use(cors(corsOptions));

// IMPORTANT: Handle Preflight Requests explicitly
app.options("*", cors(corsOptions));


/* ───────────────── 3. Global Middleware ───────────────── */

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* Static files */
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
    process.exit(1);
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
