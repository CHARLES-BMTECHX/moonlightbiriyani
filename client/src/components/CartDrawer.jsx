// src/components/CartDrawer.jsx
import { Drawer } from "antd";
import { X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { cart, total, open, setOpen, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  return (
    <Drawer
      title={<span className="text-xl font-normal text-gray-700">Shopping cart</span>}
      placement="right"
      width={400} // Slightly narrower to match reference
      open={open}
      onClose={() => setOpen(false)}
      closeIcon={<X size={24} className="text-gray-500 hover:text-red-600" />}
      styles={{
        body: { padding: 0, display: 'flex', flexDirection: 'column' },
        header: { borderBottom: '1px solid #f0f0f0', padding: '20px 24px' }
      }}
    >
      {/* --- CART ITEMS LIST --- */}
      <div className="flex-1 overflow-y-auto p-6">
        {cart?.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <p>Your cart is empty</p>
          </div>
        )}

        {cart?.map((item) => (
          <div
            key={item.product._id}
            className="flex gap-4 mb-8 relative group"
          >
            {/* 1. Image (Circular/Rounded) */}
            <div className="w-20 h-20 flex-shrink-0">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-full h-full object-cover rounded-full border border-gray-100"
              />
            </div>

            {/* 2. Content */}
            <div className="flex-1 flex flex-col justify-center">
              {/* Title & Remove Button Row */}
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-gray-800 text-base leading-tight pr-8">
                  {item.product.name}
                </h4>

                {/* Floating Remove Button (Top Right) */}
                <button
                  onClick={() => removeItem(item.product._id)}
                  className="absolute top-0 right-0 w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-600 transition-colors bg-white"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Price */}
              <p className="text-gray-500 mb-3 text-sm">
                ₹{item.product.price}
              </p>

              {/* 3. Custom Quantity Selector [ - | 1 | + ] */}
              <div className="flex items-center border border-gray-300 rounded-sm w-max h-8 bg-white">
                <button
                  className="px-3 h-full hover:bg-gray-50 text-gray-600 border-r border-gray-300 flex items-center justify-center disabled:opacity-50"
                  onClick={() => updateQty(item.product._id, item.quantity - 1)}
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-medium text-gray-800 select-none">
                  {item.quantity}
                </span>
                <button
                  className="px-3 h-full hover:bg-gray-50 text-gray-600 border-l border-gray-300 flex items-center justify-center"
                  onClick={() => updateQty(item.product._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- FOOTER SECTION --- */}
      {cart?.length > 0 && (
        <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          {/* Subtotal */}
          <div className="flex justify-between items-end mb-1">
            <span className="text-xl text-gray-600 font-normal">Subtotal</span>
            <span className="text-xl font-bold text-gray-800">
              ₹{total}
            </span>
          </div>

          {/* Note */}
          <p className="text-gray-400 text-sm mb-6 font-light">
            Taxes and shipping calculated at checkout
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
             onClick={() => {
                setOpen(false);
                navigate('/checkout');
              }}
              className="w-full py-3.5 bg-[#c91f37] hover:bg-[#b01b30] text-white font-bold text-sm tracking-wide rounded-sm uppercase transition-colors"
            >
              CHECK OUT
            </button>
            <button
              onClick={() => {
                setOpen(false);
                navigate('/cart');
              }}
              className="w-full py-3.5 bg-[#c91f37] hover:bg-[#b01b30] text-white font-bold text-sm tracking-wide rounded-sm uppercase transition-colors"
            >
              VIEW CART
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;
