import api from "./axios";

export const getUsage =
  async () => {
    const response =
      await api.get(
        "/subscription/usage"
      );

    return response.data;
  };