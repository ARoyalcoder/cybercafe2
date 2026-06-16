import api from "./axios";

export const getProfile =
  async () => {
    const response =
      await api.get("/auth/me");
console.log(response.data);
    return response.data;
  };



export const logoutUser =
  async () => {
    const deviceId =
      localStorage.getItem(
        "deviceId"
      );

    const response =
      await api.post(
        "/auth/logout",
        {},
        {
          headers: {
            "device-id":
              deviceId,
          },
        }
      );

    return response.data;
  };