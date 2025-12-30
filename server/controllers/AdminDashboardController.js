const User = require("../models/UserModel");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Cart = require("../models/Cart");
const Address = require("../models/AddressModel");

exports.getAdminDashboardOverview = async (req, res) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        /* ---------------- USERS ---------------- */
        // USERS (ONLY role === "user")
        const totalUsers = await User.countDocuments({ role: "user" });

        const activeUsers = await User.countDocuments({
            role: "user",
            isActive: true,
        });

        const newUsersToday = await User.countDocuments({
            role: "user",
            createdAt: { $gte: todayStart, $lte: todayEnd },
        });

        /* ---------------- PRODUCTS ---------------- */
        const totalProducts = await Product.countDocuments();
        const outOfStockProducts = await Product.countDocuments({ stock: 0 });
        const lowStockProducts = await Product.countDocuments({
            stock: { $gt: 0, $lte: 5 },
        });

        /* ---------------- ORDERS ---------------- */
        const totalOrders = await Order.countDocuments();
        const ordersToday = await Order.countDocuments({
            createdAt: { $gte: todayStart, $lte: todayEnd },
        });

        const orderStatusStats = await Order.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const totalRevenueAgg = await Order.aggregate([
            { $match: { status: { $in: ["Paid", "Verified", "Delivered"] } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        const todayRevenueAgg = await Order.aggregate([
            {
                $match: {
                    status: { $in: ["Paid", "Verified", "Delivered"] },
                    createdAt: { $gte: todayStart, $lte: todayEnd },
                },
            },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        /* ---------------- PAYMENTS ---------------- */
        const paymentMethodStats = await Order.aggregate([
            { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
        ]);

        const paymentScreenshots = await Order.countDocuments({
            paymentScreenshot: { $ne: null },
        });

        /* ---------------- REVIEWS ---------------- */
        const totalReviews = await Review.countDocuments();
        const avgRatingAgg = await Review.aggregate([
            { $group: { _id: null, avg: { $avg: "$rating" } } },
        ]);

        /* ---------------- CARTS & ADDRESSES ---------------- */
        const activeCarts = await Cart.countDocuments();
        const totalAddresses = await Address.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    today: newUsersToday,
                },
                products: {
                    total: totalProducts,
                    outOfStock: outOfStockProducts,
                    lowStock: lowStockProducts,
                },
                orders: {
                    total: totalOrders,
                    today: ordersToday,
                    byStatus: orderStatusStats,
                },
                revenue: {
                    total: totalRevenueAgg[0]?.total || 0,
                    today: todayRevenueAgg[0]?.total || 0,
                },
                payments: {
                    methods: paymentMethodStats,
                    screenshotsUploaded: paymentScreenshots,
                },
                reviews: {
                    total: totalReviews,
                    averageRating: avgRatingAgg[0]?.avg || 0,
                },
                misc: {
                    carts: activeCarts,
                    addresses: totalAddresses,
                },
            },
        });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load dashboard overview",
        });
    }
};
