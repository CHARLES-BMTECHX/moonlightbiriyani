import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle, Package, Home } from "lucide-react";
import confetti from "canvas-confetti";
import orderService from "../services/orderService";
import { useCart } from "../context/CartContext";

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [orderCode, setOrderCode] = useState("");
  const [loading, setLoading] = useState(true);

  // 🎉 Confetti animation
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);

      confetti({
        particleCount: 50,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getOrderById(orderId);
        setOrderCode(res.data.uniqueCode);
         clearCart();
      } catch (error) {
        console.error("Failed to load order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden text-center">

        <div className="h-2 bg-[#672674]" />

        <div className="p-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="text-green-600 w-10 h-10" strokeWidth={3} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order Confirmed!
          </h1>

          <p className="text-gray-500 mb-6">
            Thank you for your purchase. Your order has been placed successfully.
          </p>

          {/* ✅ Order Code */}
          <div className="bg-gray-100 rounded-md p-4 mb-8 border">
            <p className="text-xs text-gray-500 uppercase mb-1">
              Order ID
            </p>

            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <p className="text-xl font-mono font-bold text-gray-800">
                {orderCode}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/orders")}
              className="w-full flex items-center justify-center gap-2 bg-[#672674] text-white font-bold py-3 rounded"
            >
              <Package size={20} />
              Track Order
            </button>

            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 border py-3 rounded text-gray-700"
            >
              <Home size={20} />
              Return to Home
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 p-4 border-t">
          <p className="text-xs text-gray-400">
            A confirmation email has been sent to your registered email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
