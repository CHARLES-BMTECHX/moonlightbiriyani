import axiosInstance from "./AxiosInstance";

const favoriteService = {
  // 🔁 Toggle favorite (add / remove)
  toggleFavorite: (productId) =>
    axiosInstance.post("/favorites/toggle", { productId }),

  // ❤️ Get my favorites
  getMyFavorites: () =>
    axiosInstance.get("/favorites/my"),

  // ❌ Remove favorite explicitly
  removeFavorite: (productId) =>
    axiosInstance.delete(`/favorites/${productId}`),
};

export default favoriteService;
