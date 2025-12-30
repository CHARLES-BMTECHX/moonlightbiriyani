// services/cartService.js
import axiosInstance from './AxiosInstance';

const cartService = {
  getMyCart: () => axiosInstance.get('/cart'),

  getMyCartItems: (page = 1, limit = 10) =>
    axiosInstance.get(`/cart/items?page=${page}&limit=${limit}`),
  addToCart: (productId, quantity = 1) =>
    axiosInstance.post('/cart', { productId, quantity }),

  // ✅ FIXED ROUTES
  updateQty: (productId, quantity) =>
    axiosInstance.patch(`/cart/items/${productId}`, { quantity }),

  removeItem: (productId) =>
    axiosInstance.delete(`/cart/items/${productId}`),

  clearCart: () =>
    axiosInstance.delete('/cart'),
};

export default cartService;
