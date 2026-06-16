export const downloadFile = async (
  fileId: string,
  fileName: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/files/download/${fileId}`
  );

  const blob =
    await response.blob();

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = fileName;

  link.click();

  URL.revokeObjectURL(url);
};

export const copyFileLink = async (
  url: string
) => {
  await navigator.clipboard.writeText(
    url
  );
};

export const printFile = (
  url: string
) => {
  const win =
    window.open(
      url,
      "_blank"
    );

  win?.addEventListener(
    "load",
    () => {
      win.print();
    }
  );
};