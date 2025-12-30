import axiosInstance from "./AxiosInstance";

const addressService = {
  // Create new address
  addAddress: (data) => axiosInstance.post("/address", data),

  // Get all addresses of logged-in user
  getMyAddresses: () => axiosInstance.get("/address"),

  // Get single address
  getAddressById: (id) => axiosInstance.get(`/address/${id}`),

  // Update address
  updateAddress: (id, data) =>
    axiosInstance.patch(`/address/${id}`, data),

  // Delete address
  deleteAddress: (id) =>
    axiosInstance.delete(`/address/${id}`),
};

export default addressService;
