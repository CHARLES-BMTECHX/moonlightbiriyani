// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use("/uploads", express.static("uploads"));
// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('DB Connection Error:', err.message);
    process.exit(1);
  });

// ──────────────────────────────── Routes ─────────────────────
app.use('/api/auth', require('./routes/AuthRoute'));
app.use('/api/products', require('./routes/ProductRoute'));
app.use('/api/address', require('./routes/AddressRoute'));
app.use('/api/cart', require('./routes/CartRoute'));
app.use('/api/orders', require('./routes/OrderRoute'));
app.use('/api/payment-details', require('./routes/PaymentDetailRoute'));
app.use('/api/reviews', require('./routes/ReviewRoute'));
app.use('/api/favorites', require('./routes/FavoriteRoute'));
app.use('/api/hero-banners', require('./routes/heroBannerRoute'));
app.use("/api/admin/dashboard", require("./routes/AdminDashboardRoute"));


// ──────── 404 Handler (MUST be after all routes) ────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ───────── Global Error Handling Middleware ─────────────
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    // Only send stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─────────────────── Start Server ─────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
