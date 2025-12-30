import axiosInstance from "./AxiosInstance";

export const getUsers = (params) =>
  axiosInstance.get("/auth/users", { params });

export const getUserById = (id) =>
  axiosInstance.get(`/auth/users/${id}`);

export const updateUser = (id, data) =>
  axiosInstance.put(`/auth/users/${id}`, data);

export const deleteUser = (id) =>
  axiosInstance.delete(`/auth/users/${id}`);

// CREATE user
export const createUser = (data) =>
  axiosInstance.post("/auth/signup", data);
