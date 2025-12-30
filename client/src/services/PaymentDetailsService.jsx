import axiosInstance from "./AxiosInstance";

const paymentDetailsService = {
  getMyDetails: () =>
    axiosInstance.get("/payment-details/me"),

  getOrderAccountDetail: () =>
    axiosInstance.get("/payment-details/order-account"),

  setupDetails: (formData) =>
    axiosInstance.post("/payment-details/setup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deactivate: () =>
    axiosInstance.put("/payment-details/deactivate"),

  deleteDetails: () =>
    axiosInstance.delete("/payment-details"),

  getActiveDetails: () =>
    axiosInstance.get("/payment-details/active"),
};

export default paymentDetailsService;
