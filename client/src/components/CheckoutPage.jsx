import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Banknote, QrCode, Plus, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

// Services
import addressService from "../services/AddressService";
import paymentService from "../services/PaymentDetailsService";
import orderService from "../services/orderService";

const CheckoutPage = () => {
    const { cart, total, clearCart } = useCart();
    const navigate = useNavigate();

    // --- STATES ---
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

    // Form State
    const [newAddress, setNewAddress] = useState({
        label: "Home",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [paymentDetails, setPaymentDetails] = useState(null); // Merchant UPI details

    // --- 1. LOAD DATA ---
    const loadData = async () => {
        try {
            setLoading(true);

            const [addrRes, payRes] = await Promise.all([
                addressService.getMyAddresses().catch(() => ({ data: [] })),
                paymentService.getOrderAccountDetail().catch(() => ({ data: null })),
            ]);

            // Addresses
            const addrList = addrRes.data || [];
            setAddresses(addrList);
            if (addrList.length > 0) setSelectedAddress(addrList[0]._id);

            // ✅ FIX HERE
            console.log(payRes,'kjjdfjdfbjdfjb');

            setPaymentDetails(payRes?.data ? [payRes.data] : []);


            console.log("Payment details:", payRes?.data);
        } catch (error) {
            console.error("Load Error:", error);
            toast.error("Failed to load checkout details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // --- 2. HANDLERS ---

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await addressService.addAddress(newAddress);
            toast.success("Address added successfully!");

            // Update local state without full reload
            const addedAddr = res.data;
            setAddresses(prev => [addedAddr, ...prev]);
            setSelectedAddress(addedAddr._id);

            // Reset Form
            setIsAddingNewAddress(false);
            setNewAddress({ label: "Home", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", phone: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add address");
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        }

        try {
            const res = await orderService.placeOrder({
                addressId: selectedAddress,
                paymentMethod,
            });

            toast.success("Order placed successfully!");

            // Clear cart
            if (clearCart) clearCart();

            const orderId = res.order._id;

            if (paymentMethod === 'UPI') {
                navigate(`/payment-upload/${orderId}`);
            } else {
                navigate(`/order-success/${orderId}`);
            }

        } catch (err) {
            toast.error(err.message || "Order placement failed");
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <Loader2 className="animate-spin text-[#c91f37]" size={40} />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* --- LEFT COLUMN: FORMS --- */}
                <div className="lg:col-span-8 space-y-8">

                    {/* 1. DELIVERY ADDRESS SECTION */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <MapPin className="text-[#c91f37]" /> Delivery Address
                        </h2>

                        {!isAddingNewAddress ? (
                            <div className="space-y-4">
                                {/* List Existing Addresses */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr._id}
                                            onClick={() => setSelectedAddress(addr._id)}
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all relative ${selectedAddress === addr._id ? 'border-[#c91f37] bg-red-50' : 'border-gray-200 hover:border-red-200'
                                                }`}
                                        >
                                            {selectedAddress === addr._id && (
                                                <div className="absolute top-2 right-2 text-[#c91f37]">
                                                    <CheckCircle size={20} fill="#c91f37" className="text-white" />
                                                </div>
                                            )}
                                            {/* <span className="bg-gray-200 text-xs font-bold px-2 py-1 rounded text-gray-600 uppercase mb-2 inline-block">
                                                {addr.label || "Home"}
                                            </span> */}
                                            <p className="font-semibold text-gray-800 line-clamp-1">{addr.addressLine1}</p>
                                            <p className="text-gray-500 text-sm">{addr.city}, {addr.state} - {addr.pincode}</p>
                                            <p className="text-gray-500 text-sm mt-1">Phone: {addr.phone}</p>
                                        </div>
                                    ))}

                                    {/* Add New Button */}
                                    <button
                                        onClick={() => setIsAddingNewAddress(true)}
                                        className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#c91f37] hover:text-[#c91f37] transition-colors h-full min-h-[140px]"
                                    >
                                        <Plus size={32} />
                                        <span className="font-medium mt-2">Add New Address</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Add New Address Form
                            <form onSubmit={handleAddAddress} className="space-y-4 animate-fadeIn">
                                <div className="grid grid-cols-2 gap-4">
                                    <input required type="text" placeholder="Address Line 1" className="col-span-2 p-3 border border-gray-300 rounded focus:outline-none focus:border-[#c91f37]"
                                        value={newAddress.addressLine1} onChange={e => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />

                                    <input type="text" placeholder="Address Line 2 (Optional)" className="col-span-2 p-3 border border-gray-300 rounded focus:outline-none focus:border-[#c91f37]"
                                        value={newAddress.addressLine2} onChange={e => setNewAddress({ ...newAddress, addressLine2: e.target.value })} />

                                    <input required type="text" placeholder="City" className="p-3 border border-gray-300 rounded focus:outline-none focus:border-[#c91f37]"
                                        value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />

                                    <input required type="text" placeholder="State" className="p-3 border border-gray-300 rounded focus:outline-none focus:border-[#c91f37]"
                                        value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />

                                    <input
                                        required
                                        type="text"
                                        placeholder="Pincode"
                                        inputMode="numeric"
                                        maxLength={6}
                                        className="p-3 border border-gray-300 rounded focus:outline-none focus:border-[#c91f37]"
                                        value={newAddress.pincode}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, ""); // digits only
                                            if (value.length <= 6) {
                                                setNewAddress({ ...newAddress, pincode: value });
                                            }
                                        }}
                                    />

                                    <input
                                        required
                                        type="text"
                                        placeholder="Phone Number"
                                        inputMode="numeric"
                                        maxLength={10}
                                        className="p-3 border border-gray-300 rounded focus:outline-none focus:border-[#c91f37]"
                                        value={newAddress.phone}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, ""); // digits only
                                            if (value.length <= 10) {
                                                setNewAddress({ ...newAddress, phone: value });
                                            }
                                        }}
                                    />


                                    {/* <select className="p-3 border border-gray-300 rounded focus:outline-none focus:border-[#c91f37]"
                                        value={newAddress.label} onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}>
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="Other">Other</option>
                                    </select> */}
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button type="submit" className="bg-[#c91f37] text-white px-6 py-2 rounded font-semibold hover:bg-[#a0182b]">Save Address</button>
                                    <button type="button" onClick={() => setIsAddingNewAddress(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-semibold hover:bg-gray-300">Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* 2. PAYMENT METHOD SECTION */}

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <CreditCard className="text-[#c91f37]" /> Payment Method
                        </h2>

                        <div className="space-y-4">

                            {/* Option 1: Cash on Delivery (COD) */}
                            <div
                                onClick={() => setPaymentMethod('COD')}
                                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-[#c91f37] bg-red-50' : 'border-gray-200 hover:border-red-100'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-[#c91f37]' : 'border-gray-400'
                                    }`}>
                                    {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 bg-[#c91f37] rounded-full"></div>}
                                </div>
                                <Banknote className="text-gray-600 mr-3" />
                                <span className="font-semibold text-gray-700">Cash on Delivery (COD)</span>
                            </div>

                            {/* Option 2: UPI / QR Code */}
                            {paymentDetails &&
                                paymentDetails.map((payment) => (
                                    <div
                                        key={payment._id}
                                        onClick={() => setPaymentMethod('UPI')}
                                        className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'UPI'
                                            ? 'border-[#c91f37] bg-red-50'
                                            : 'border-gray-200 hover:border-red-100'
                                            }`}
                                    >
                                        <div className="flex items-center mb-2">
                                            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${paymentMethod === 'UPI' ? 'border-[#c91f37]' : 'border-gray-400'
                                                }`}>
                                                {paymentMethod === 'UPI' && (
                                                    <div className="w-2.5 h-2.5 bg-[#c91f37] rounded-full"></div>
                                                )}
                                            </div>
                                            <QrCode className="text-gray-600 mr-3" />
                                            <span className="font-semibold text-gray-700">
                                                Pay via UPI / QR Code
                                            </span>
                                        </div>

                                        {paymentMethod === 'UPI' && (
                                            <div className="mt-4 pl-9 animate-fadeIn">
                                                <div className="bg-white p-4 rounded border border-gray-200 flex flex-col sm:flex-row gap-6 items-center shadow-sm">

                                                    {/* QR CODE */}
                                                    <div className="flex-shrink-0 text-center">
                                                        {payment.qrCodeImage ? (
                                                            <div className="w-40 h-40 border rounded overflow-hidden">
                                                                <img
                                                                    src={payment.qrCodeImage}
                                                                    alt="Merchant QR"
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-40 h-40 bg-gray-100 flex items-center justify-center text-xs">
                                                                No QR Image
                                                            </div>
                                                        )}
                                                        <span className="text-xs text-gray-500">Scan to Pay</span>
                                                    </div>

                                                    <div className="hidden sm:block w-px h-32 bg-gray-200"></div>

                                                    {/* TEXT DETAILS */}
                                                    <div className="flex-grow w-full space-y-4">

                                                        {/* ✅ ACCOUNT HOLDER NAME (NEW) */}
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                                                Account Holder Name
                                                            </p>
                                                            <p className="font-bold text-gray-800 text-base mt-1 tracking-wide">
                                                                {payment.accountHolderName || "Unavailable"}
                                                            </p>
                                                        </div>

                                                        {/* UPI ID */}
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                                                Merchant UPI ID
                                                            </p>
                                                            <span className="font-mono bg-gray-100 px-3 py-1.5 rounded border text-sm">
                                                                {payment.upiId || "Unavailable"}
                                                            </span>
                                                        </div>

                                                        {/* MOBILE */}
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                                                Merchant Mobile
                                                            </p>
                                                            <p className="font-bold text-gray-800 text-lg mt-1">
                                                                {payment.phone || "Unavailable"}
                                                            </p>
                                                        </div>

                                                        <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-xs text-yellow-800">
                                                            <strong>Next Step:</strong> Complete payment and upload screenshot
                                                            after confirming order.
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}



                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: CART SUMMARY --- */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-10">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Order Summary</h3>

                        {/* Items List */}
                        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map(item => (
                                <div key={item.product._id} className="flex gap-3">
                                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-800 line-clamp-2">{item.product.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-sm font-bold text-gray-700">
                                        ₹{(item.product.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-2 border-t pt-4 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            {/* <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxes (5%)</span>
                                <span>₹{(total * 0.05).toFixed(2)}</span>
                            </div> */}
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center border-t border-gray-200 mt-4 pt-4 mb-6">
                            <span className="text-lg font-bold text-gray-800">Total Amount</span>
                            <span className="text-2xl font-bold text-[#c91f37]">₹{total.toFixed(2)}</span>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handlePlaceOrder}
                            disabled={cart.length === 0}
                            className="w-full bg-[#c91f37] hover:bg-[#a0182b] text-white font-bold py-4 rounded shadow-md transition-colors uppercase tracking-wide text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Confirm Order
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4">
                            Secure Checkout • 256-bit SSL Encrypted
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutPage;
