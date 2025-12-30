import axiosInstance from "./AxiosInstance";

const orderService = {
  // 🛒 Place Order
  placeOrder: (orderData) =>
    axiosInstance.post("/orders/place", orderData),

  // 📤 Upload Payment Screenshot
  uploadPaymentScreenshot: (orderId, file) => {
    const formData = new FormData();
    // must match upload.single("screenshot")
    formData.append("screenshot", file);

    return axiosInstance.post(
      `/orders/${orderId}/screenshot`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  // 👤 Get My Orders (User)
  getMyOrders: (page = 1, limit = 10) =>
    axiosInstance.get(`/orders/my?page=${page}&limit=${limit}`),

  // 🧾 Get Latest Order Code / Order Detail
  getOrderById: (orderId) =>
    axiosInstance.get(`/orders/latest/code/${orderId}`),

  // 🛠️ Admin: Get All Orders (with filters)
  getAllOrders: (params) =>
    axiosInstance.get("/orders/admin/all", { params }),

  // 🛠️ Admin: Update Order Status
  updateOrderStatus: (orderId, status) =>
    axiosInstance.put(`/orders/admin/${orderId}/status`, { status }),
};

export default orderService;
