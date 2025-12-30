import axiosInstance from "./axiosInstance";

export const getHeroBanners = (params) =>
  axiosInstance.get("/hero-banners", { params });

export const getHeroBannerById = (id) =>
  axiosInstance.get(`/hero-banners/${id}`);

export const createHeroBanner = (formData) =>
  axiosInstance.post("/hero-banners", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateHeroBanner = (id, formData) =>
  axiosInstance.put(`/hero-banners/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteHeroBanner = (id) =>
  axiosInstance.delete(`/hero-banners/${id}`);
