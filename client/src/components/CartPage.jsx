import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react"; // Or use your icons
import cartService from "../services/CartService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [grandTotal, setGrandTotal] = useState(0);
    const navigate = useNavigate();

    const LIMIT = 10;

    // Initial Load
    useEffect(() => {
        fetchCartData(1, true);
    }, []);

    // Calculate Grand Total whenever items change
    useEffect(() => {
        const total = cartItems.reduce((acc, item) => {
            return acc + (item.product?.price || 0) * item.quantity;
        }, 0);
        setGrandTotal(total);
    }, [cartItems]);

    const fetchCartData = async (pageNum, reset = false) => {
        try {
            setLoading(true);
            const res = await cartService.getMyCartItems(pageNum, LIMIT);

            if (res.success) {
                const newItems = res.data.items;
                const totalItems = res.data.totalItems;

                if (reset) {
                    setCartItems(newItems);
                } else {
                    // Append new items to existing list
                    setCartItems((prev) => [...prev, ...newItems]);
                }

                // Check if we have loaded all items
                const currentCount = reset ? newItems.length : cartItems.length + newItems.length;
                setHasMore(currentCount < totalItems);
            }
        } catch (error) {
            console.error(error);
            toast.error("Could not load cart");
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchCartData(nextPage, false);
    };

    const handleUpdateQty = async (productId, currentQty, change) => {
        const newQty = currentQty + change;

        // Prevent going below 1
        if (newQty < 1) return;

        // 1. Optimistic UI Update:
        // We update the UI immediately so it feels fast.
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product._id === productId ? { ...item, quantity: newQty } : item
            )
        );

        try {
            // 2. Call the API
            await cartService.updateQty(productId, newQty);

            // If code reaches here, the API call was successful (Status 200).

        } catch (error) {
            console.error("Update failed:", error);

            // 3. REVERT LOGIC (Crucial):
            // The API failed (e.g., Status 400/500). We MUST set the cart back to 'currentQty'.
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.product._id === productId ? { ...item, quantity: currentQty } : item
                )
            );

            // 4. Extract the exact error message from your backend response
            // Structure: error.response.data -> { success: false, message: "Only 1 items available" }
            console.log(error, 'erro');

            const serverMessage = error?.message || "Failed to update quantity";

            toast.info(serverMessage);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await cartService.removeItem(productId);
            setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
            toast.success("Item removed");
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };
    return (
        <div className="bg-white min-h-screen pb-20 font-sans">

            {/* --- HEADER --- */}
            <div
                className="w-full h-64 bg-black flex flex-col justify-center items-center text-white relative bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80')" }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl font-bold tracking-widest uppercase mb-2">Your Shopping Cart</h1>
                    <p className="text-sm text-gray-300">Home / Your Shopping Cart</p>
                </div>
            </div>

            {/* --- CART CONTENT --- */}
            <div className="max-w-7xl mx-auto px-4 mt-16">

                {/* Table Head */}
                <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-200 pb-4 mb-6 text-gray-500 font-bold text-sm uppercase tracking-wider">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-3 text-center">Quantity</div>
                    <div className="col-span-3 text-right">Total</div>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-8">
                    {cartItems.length === 0 && !loading ? (
                        <div className="text-center py-16">
                            <p className="text-xl text-gray-500 mb-6">Your cart is empty.</p>
                            <Link to="/" className="text-[#c91f37] hover:underline">Go Shopping</Link>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-gray-100 pb-6">
                                {/* Product Info */}
                                <div className="col-span-1 md:col-span-6 flex gap-6">
                                    <div className="w-24 h-24 border border-gray-200 p-1 rounded-sm flex-shrink-0">
                                        <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <span className="text-xs text-gray-400 uppercase tracking-wide">ITEM</span>
                                        <h3 className="text-lg font-medium text-gray-800">{item.product?.name}</h3>
                                        <p className="text-gray-500 text-sm mt-1">₹{item.product?.price?.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="col-span-1 md:col-span-3 flex justify-center items-center gap-3">
                                    <div className="flex items-center border border-gray-300">
                                        <button onClick={() => handleUpdateQty(item.product._id, item.quantity, -1)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 border-r border-gray-300">
                                            <Minus size={14} />
                                        </button>
                                        <span className="px-4 py-2 text-gray-800 font-medium min-w-[40px] text-center">{item.quantity}</span>
                                        <button onClick={() => handleUpdateQty(item.product._id, item.quantity, 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 border-l border-gray-300">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <button onClick={() => handleRemoveItem(item.product._id)} className="bg-[#c91f37] text-white p-2 rounded-sm hover:bg-[#a0182b] transition">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Row Total */}
                                <div className="col-span-1 md:col-span-3 text-right">
                                    <span className="text-lg font-medium text-gray-600">
                                        ₹{(item.product?.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Load More */}
                {hasMore && !loading && cartItems.length > 0 && (
                    <div className="flex justify-center mt-10">
                        <button onClick={handleLoadMore} className="px-6 py-2 border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition text-sm font-medium">
                            Load More
                        </button>
                    </div>
                )}

                {/* --- CHECKOUT SECTION (Matches Screenshot) --- */}
                {cartItems.length > 0 && (
                    <div className="flex flex-col items-end mt-16 border-t border-gray-100 pt-8">

                        {/* Subtotal Row */}
                        <div className="flex items-baseline gap-4 mb-2">
                            <span className="text-xl text-gray-600">Subtotal</span>
                            <span className="text-2xl font-bold text-gray-800">₹{grandTotal.toFixed(2)}</span>
                        </div>

                        {/* Tax Note */}
                        <p className="text-gray-500 text-sm mb-6">Taxes and shipping calculated at checkout</p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            {/* Continue Shopping */}
                            <Link
                                to="/"
                                className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-sm hover:bg-gray-300 transition text-center uppercase tracking-wide text-sm"
                            >
                                Continue Shopping
                            </Link>

                            {/* CHECK OUT BUTTON */}
                            <button
                                onClick={() => navigate('/checkout')}
                                className="px-10 py-3 bg-[#c91f37] hover:bg-[#a0182b] text-white font-bold rounded-sm transition shadow-md uppercase tracking-wide text-sm"
                            >
                                Check Out
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CartPage;
