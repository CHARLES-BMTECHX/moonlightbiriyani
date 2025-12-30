import axiosInstance from "./AxiosInstance";

const productService = {
  getProducts: () =>
    axiosInstance.get("/products"),

  createProduct: (formData) =>
    axiosInstance.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateProduct: (id, formData) =>
    axiosInstance.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteProduct: (id) =>
    axiosInstance.delete(`/products/${id}`),
};

export default productService;
