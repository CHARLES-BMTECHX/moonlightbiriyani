import axiosInstance from "./AxiosInstance";

const dashboardService = {
  getOverview: () =>
    axiosInstance.get("/admin/dashboard/overview"),
};

export default dashboardService;
