import { Routes, Route } from "react-router-dom";
import MainLayout from "./layoutes/MainLayout";
import PrivateRoute from "./routes/PrivateRoute";

// 🌐 Public/Home Page Components
import HomeSection from "./components/Home";
import AboutSection from "./components/About";
import ServiceSection from "./components/Service";
import Reviewsection from "./components/Review";

// 🔑 Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// 👤 User Protected Pages
import ProfilePage from "./components/MyProfile";
import MyOrdersPage from "./components/MyOrdersPage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import PaymentUploadPage from "./components/PaymentUploadPage";
import OrderSuccessPage from "./components/OrderSuccessPage";
import FavoritesPage from "./components/FavoritesPage";

// 👑 ADMIN PAGES (Imports)
import AdminLayout from "./layoutes/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import ProductList from "./pages/admin/products/ProductList";
import PaymentDetails from "./pages/admin/payments/PaymentDetails";
import ReviewList from "./pages/admin/review/ReviewList";

// 🛠 Shared
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartDrawer from "./components/CartDrawer";
import HeroBanner from "./pages/admin/HeroBanner";
import Users from "./pages/admin/User";
import MyProfileInfo from "./pages/admin/MyProfile";
import AdminOrders from "./pages/admin/AdminOrders";

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <CartDrawer />

      <Routes>
        {/* ========================================================= */}
        {/* 🌐 ALL NON-ADMIN PAGES → Use MainLayout (Common Header + Footer) */}
        {/* ========================================================= */}
        <Route element={<MainLayout />}>
          {/* Public Home Page */}
          <Route
            path="/"
            element={
              <>
                <HomeSection />
                <AboutSection />
                <ServiceSection />
                <Reviewsection />
              </>
            }
          />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected User Routes (user + admin can access) */}
          <Route element={<PrivateRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/account" element={<ProfilePage />} />
            <Route path="/orders" element={<MyOrdersPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment-upload/:orderId" element={<PaymentUploadPage />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Route>
        </Route>

        {/* =========================================================== */}
        {/* 👑 ADMIN PROTECTED ROUTES (EXACTLY AS YOU PROVIDED — UNTOUCHED) */}
        {/* =========================================================== */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          {/* The AdminLayout provides the sticky header and 25%/75% sidebar/content */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* Admin Index Route: Renders into AdminLayout's Outlet */}
            <Route index element={<AdminDashboard />} />

            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="product" element={<ProductList />} />
            <Route path="account" element={<PaymentDetails />} />
            <Route path="reviews" element={<ReviewList />} />
            <Route path="banner" element={<HeroBanner />} />
            <Route path="account-info" element={<MyProfileInfo />} />
            <Route path="admin-orders" element={<AdminOrders />} />

            {/* Add more admin specific routes here */}
          </Route>
        </Route>

        {/* 🚫 404 */}
        <Route path="*" element={<h1 className="text-center py-32 text-4xl">404: Page Not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;
