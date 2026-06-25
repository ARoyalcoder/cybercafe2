import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/Loader/Loader";

import { getFolderDetails } from "../../api/folderApi";

import DocumentCard from "./DocumentCard";
import FilePreviewModal from "./FilePreviewModal";

interface FileItem {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  createdAt?: string;
}

interface FolderDetailsResponse {
  folder: {
    _id: string;
    folderName: string;
    customerName: string;
    createdAt: string;
  };
  files: FileItem[];
}

export default function FolderDetails() {
  const { id } = useParams();

  const [data, setData] =
    useState<FolderDetailsResponse | null>(
      null
    );

  const [previewFile, setPreviewFile] =
    useState<FileItem | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchFolderDetails =
      async () => {
        try {
          setLoading(true);
          setError(null);

          const response =
            await getFolderDetails(id);

          setData(response);
        } catch (err) {
          console.error(err);

          setError(
            "Failed to load folder details."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchFolderDetails();
  }, [id]);

  const handlePreview =
    useCallback(
      (file: FileItem) => {
        setPreviewFile(file);
      },
      []
    );

  const handleClosePreview =
    useCallback(() => {
      setPreviewFile(null);
    }, []);

  const handleDownload =
    useCallback((file: FileItem) => {
      window.open(
        file.fileUrl,
        "_blank",
        "noopener,noreferrer"
      );
    }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-1 items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex flex-1 items-center justify-center min-h-screen ">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  const {
    folder,
    files,
  } = data;

  return (<DashboardLayout>
    {/* Folder Header */}


    <section
      className="
    rounded-3xl
    bg-white/5
    border
    border-white/10
    backdrop-blur-xl
    p-8
  "
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            {folder.folderName}
          </h1>

          <p className="mt-2 text-slate-400">
            Customer document collection folder
          </p>
        </div>

        <div
          className="
        self-start
        rounded-full
        border
        border-violet-500/20
        bg-violet-500/10
        px-5
        py-2
        text-sm
        font-medium
        text-violet-400
      "
        >
          {files.length} Files
        </div>
      </div>

      {/* Overview Cards */}

      <div
        className="
    grid
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-5
    gap-6
  "
      >        <div
        className="
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-5
      "
      >
          <p className="text-sm text-slate-400">
            Customer
          </p>

          <p className="mt-2 font-semibold text-white">
            {folder.customerName}
          </p>
        </div>

        <div
          className="
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-5
      "
        >
          <p className="text-sm text-slate-400">
            Documents
          </p>

          <p className="mt-2 font-semibold text-white">
            {files.length}
          </p>
        </div>

        <div
          className="
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-5
      "
        >
          <p className="text-sm text-slate-400">
            Created
          </p>

          <p className="mt-2 font-semibold text-white">
            {new Intl.DateTimeFormat(
              "en-IN",
              {
                dateStyle: "medium",
              }
            ).format(
              new Date(
                folder.createdAt
              )
            )}
          </p>
        </div>
      </div>
    </section>

    {/* Documents Section */}

    <section
      className="
    mt-6
    rounded-3xl
    border
    border-white/10
    bg-white/5
    backdrop-blur-xl
    p-6
  "
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Documents
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Uploaded customer files
          </p>
        </div>

        <span
          className="
        rounded-full
        border
        border-violet-500/20
        bg-violet-500/10
        px-4
        py-1
        text-sm
        font-medium
        text-violet-400
      "
        >
          {files.length} Files
        </span>
      </div>

      {files.length === 0 ? (
        <div className="py-20 text-center">
          <div
            className="
          mx-auto
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-3xl
          bg-white/5
          text-4xl
        "
          >
            📂
          </div>

          <h3 className="mt-5 text-xl font-semibold text-white">
            No Documents Found
          </h3>

          <p className="mt-2 text-slate-400">
            Uploaded files will appear here.
          </p>
        </div>
      ) : (
        <div
          className="
        grid
        grid-cols-1
        gap-6
        md:grid-cols-2
        xl:grid-cols-3
      "
        >
          {files.map((file) => (
            <DocumentCard
              key={file._id}
              file={file}
              onPreview={
                handlePreview
              }
              onDownload={
                handleDownload
              }
            />
          ))}
        </div>
      )}
    </section>

    <FilePreviewModal
      file={previewFile}
      onClose={
        handleClosePreview
      }
    />


  </DashboardLayout>
  );

}