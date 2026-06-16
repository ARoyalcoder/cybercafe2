import api from "./axios";

export const getDashboardStats =
  async () => {
    const response =
      await api.get(
        "/dashboard/stats"
      );

    return response.data;
  };


  export const getRecentUploads =
  async () => {
    const response =
      await api.get(
        "/dashboard/recent-uploads"
      );

    return response.data;
  };