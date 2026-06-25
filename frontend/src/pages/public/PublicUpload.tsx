import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../../api/axios";

import UploadHero from "./UploadHero";
import UploadForm from "./UploadForm";
import UploadSuccess from "./UploadSuccess";

export default function PublicUpload() {
  const { slug } = useParams();

  const [customerName, setCustomerName] =
    useState("");

  const [files, setFiles] =
    useState<File[]>([]);

  const [uploading, setUploading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [success, setSuccess] =
    useState(false);

  const handleUpload =
    async () => {
      try {
        if (!customerName.trim()) {
          return toast.error(
            "Please enter your name"
          );
        }

        if (files.length === 0) {
          return toast.error(
            "Please select at least one file"
          );
        }

        setUploading(true);
        setProgress(0);

        const formData =
          new FormData();

        formData.append(
          "customerName",
          customerName
        );

        files.forEach((file) => {
          formData.append(
            "files",
            file
          );
        });

        await api.post(
          `/public/upload/${slug}`,
          formData,
          {
            onUploadProgress: (
              event
            ) => {
              const percent =
                Math.round(
                  (event.loaded *
                    100) /
                  (event.total || 1)
                );

              setProgress(
                percent
              );
            },
          }
        );

        setSuccess(true);

        toast.success(
          "Files uploaded successfully"
        );
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Upload failed"
        );
      } finally {
        setUploading(false);
      }
    };

  if (success) {
    return (
      <UploadSuccess
        totalFiles={
          files.length
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6">
      <div
        className="
          w-full
          max-w-6xl
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-[#0F172A]
          shadow-2xl
          grid
          lg:grid-cols-2
        "
      >
        <UploadHero />

        <div className="p-8 lg:p-10 flex items-center">
          <UploadForm
            customerName={
              customerName
            }
            setCustomerName={
              setCustomerName
            }
            files={files}
            setFiles={setFiles}
            uploading={uploading}
            progress={progress}
            onUpload={
              handleUpload
            }
          />
        </div>
      </div>
    </div>
  );
}