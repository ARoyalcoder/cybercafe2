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
        <div className="rounded-2xl border bg-white p-8 text-center">
          Folder not found.
        </div>
      </DashboardLayout>
    );
  }

  const {
    folder,
    files,
  } = data;

  return (
    <DashboardLayout>
      {/* Folder Overview */}

      <section
        className="
          rounded-3xl
          border
          bg-white
          p-6
          shadow-sm
        "
      >
        <h1 className="text-3xl font-bold text-slate-900">
          {folder.folderName}
        </h1>

        <div
          className="
            mt-5
            grid
            gap-4
            sm:grid-cols-3
          "
        >
          <div>
            <p className="text-sm text-slate-500">
              Customer
            </p>

            <p className="font-medium">
              {folder.customerName}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Documents
            </p>

            <p className="font-medium">
              {files.length}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Created
            </p>

            <p className="font-medium">
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

      {/* Documents */}

      <section
        className="
          mt-6
          rounded-3xl
          border
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Documents
          </h2>

          <span
            className="
              rounded-full
              bg-slate-100
              px-3
              py-1
              text-sm
              font-medium
            "
          >
            {files.length} Files
          </span>
        </div>

        {files.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            No documents available.
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