import { createContext, useContext, useEffect, useState } from "react";
import cartService from "../services/CartService";
import { message } from "antd";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);

  // Load cart
  const loadCart = async () => {
    try {
      const res = await cartService.getMyCart();
      setCart(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Failed to load cart", err);
    }
  };

  // Add item
  const addToCart = async (productId) => {
    try {
      await cartService.addToCart(productId, 1);
      await loadCart();
      setOpen(true);
      message.success("Added to cart");
    } catch (err) {
      message.error(err?.message || "Add to cart failed");
    }
  };

  // Update qty
  const updateQty = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await cartService.updateQty(productId, quantity);
      await loadCart();
    } catch {
      message.error("Update failed");
    }
  };

  // Remove item
  const removeItem = async (productId) => {
    try {
      await cartService.removeItem(productId);
      await loadCart();
    } catch {
      message.error("Remove failed");
    }
  };

  // ✅ CLEAR CART (THIS WAS MISSING)
  const clearCart = () => {
    setCart([]);
    setTotal(0);
    setOpen(false);
  };

  // Badge count
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadCart();
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        count,
        open,
        setOpen,
        addToCart,
        updateQty,
        removeItem,
        clearCart, // ✅ expose
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
