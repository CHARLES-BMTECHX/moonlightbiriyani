import axiosInstance from "./axiosInstance";

const dashboardService = {
  getOverview: () =>
    axiosInstance.get("/admin/dashboard/overview"),
};

export default dashboardService;
