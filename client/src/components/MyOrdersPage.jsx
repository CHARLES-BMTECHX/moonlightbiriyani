import React, { useEffect, useState } from "react";
import orderService from "../services/orderService";
import { Link } from "react-router-dom";
import { Package, ChevronLeft, ChevronRight, Loader2, Download } from "lucide-react";

// ✅ FIX: Import autoTable as a default export
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const response = await orderService.getMyOrders(page, ITEMS_PER_PAGE);
      const data = response.data || response;

      if (data.orders) {
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      setError("Failed to load orders. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Helper for Status Badge Color
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700 border-green-200";
      case "Shipped": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // ============================================
  // 📄 INVOICE GENERATION LOGIC
  // ============================================
  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    // 1. Company Logo/Title
    doc.setFontSize(20);
    doc.setTextColor(103, 38, 116);
    doc.text("Moonlight Biriyani", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Authentic Biriyani & More", 14, 28);

    // 2. Invoice Label & Details
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("INVOICE", 150, 22);

    doc.setFontSize(10);
    doc.text(`Invoice No: ${order.uniqueCode}`, 150, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 150, 36);
    doc.text(`Status: ${order.status}`, 150, 42);

    // 3. Customer Details
    doc.setLineWidth(0.5);
    doc.line(14, 48, 196, 48);

    doc.setFontSize(12);
    doc.setTextColor(103, 38, 116);
    doc.text("Bill To:", 14, 56);

    doc.setFontSize(10);
    doc.setTextColor(0);

    const userName = order.user?.username || order.shippingAddress?.name || "Customer";
    const userPhone = order.user?.phone || order.shippingAddress?.phone || "";

    doc.text(userName, 14, 62);
    if (userPhone) doc.text(`Phone: ${userPhone}`, 14, 68);

    // 4. Order Items Table
    const tableRows = order.items.map((item) => {
      const name = item.product?.name || "Unknown Item";
      const price = item.priceAtOrder || item.product?.price || 0;
      const qty = item.quantity;
      const total = price * qty;
      return [name, qty, `Rs. ${price}`, `Rs. ${total}`];
    });

    // ✅ FIX: Call autoTable as a function and pass 'doc' as the first argument
    autoTable(doc, {
      startY: 75,
      head: [['Item Description', 'Qty', 'Price', 'Total']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [103, 38, 116], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    // 5. Total Summary
    // ✅ FIX: Use (doc).lastAutoTable.finalY
    let finalY = (doc).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text(`Grand Total: Rs. ${order.totalAmount}`, 140, finalY);

    // 6. Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Thank you for ordering from Moonlight Biriyani!", 105, 280, null, null, "center");

    // 7. Save File
    doc.save(`Invoice_${order.uniqueCode}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#672674]">My Orders</h1>
            <p className="text-gray-500 mt-1">Track and manage your recent purchases</p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-[#672674] p-4 rounded-lg border border-red-200 text-center">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
            <p className="text-gray-500 mt-2">Looks like you haven't placed any orders yet.</p>
            <Link to="/products" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500 font-medium">
              Start Shopping &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Orders List */}
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</span>
                      <p className="font-mono text-sm font-medium text-gray-900">#{order.uniqueCode}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Placed</span>
                      <p className="text-sm text-gray-700">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Amount</span>
                      <p className="text-sm font-bold text-gray-900">₹{order.totalAmount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>

                    {/* 👇 DOWNLOAD INVOICE BUTTON */}
                    <button
                      onClick={() => downloadInvoice(order)}
                      className="flex items-center gap-1 text-sm text-[#672674] font-medium hover:bg-purple-50 px-3 py-1.5 rounded-md border border-[#672674] transition-colors"
                      title="Download Invoice"
                    >
                      <Download size={16} />
                      <span className="hidden sm:inline">Invoice</span>
                    </button>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                          {item.product?.image ? (
                            <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{item.product?.name || "Product Unavailable"}</h4>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ₹{(item.priceAtOrder || item.product?.price) * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 border-t border-gray-200 pt-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 border rounded-md text-sm font-medium
                ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </button>

            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </p>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`flex items-center px-4 py-2 border rounded-md text-sm font-medium
                ${currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrdersPage;
