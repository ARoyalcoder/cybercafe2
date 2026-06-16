import api from "./axios";

export const getFolders =
  async () => {
    const response =
      await api.get("/folders");

    return response.data;
  };

export const getFolder =
  async (id: string) => {
    const response =
      await api.get(
        `/folders/${id}`
      );

    return response.data;
  };

export const deleteFolder =
  async (id: string) => {
    const response =
      await api.delete(
        `/folders/${id}`
      );

    return response.data;
  };

export const bulkDeleteFolders =
  async (folderIds: string[]) => {
    const response =
      await api.delete(
        "/folders/bulk-delete",
        {
          data: {
            folderIds,
          },
        }
      );

    return response.data;
  };


export const getFolderDetails =
  async (id: string) => {
    const response =
      await api.get(
        `/folders/${id}`
      );

    return response.data;
  };