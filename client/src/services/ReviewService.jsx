import axiosInstance from './axiosInstance';

const reviewService = {
  getAll: ({ page = 1, limit = 10 }) =>
    axiosInstance.get(`/reviews?page=${page}&limit=${limit}`),

  create: (data) => axiosInstance.post('/reviews', data),
  update: (id, data) => axiosInstance.put(`/reviews/${id}`, data),
  delete: (id) => axiosInstance.delete(`/reviews/${id}`),
};

export default reviewService;
