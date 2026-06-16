import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
  FileText,
  ShieldCheck,
  CloudUpload,
  X,
} from "lucide-react";
import api from "../../api/axios";

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

  const { getRootProps, getInputProps } =
    useDropzone({
      multiple: true,

      onDrop: (acceptedFiles) => {
        setFiles(acceptedFiles);
      },
    });

  const handleUpload =
    async () => {
      try {
        if (!customerName.trim()) {
          return toast.error(
            "Enter your name"
          );
        }

        if (!files.length) {
          return toast.error(
            "Select files"
          );
        }

        setUploading(true);

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
        console.log(slug);
        await api.post(
          `/public/upload/${slug}`,
          formData,
          {


            onUploadProgress:
              (event) => {
                const percent =
                  Math.round(
                    (event.loaded *
                      100) /
                    (event.total ||
                      1)
                  );

                setProgress(
                  percent
                );
              },
          }
        );

        setSuccess(true);

        toast.success(
          "Uploaded Successfully"
        );
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
          "Upload Failed"
        );

      } finally {
        setUploading(false);
      }
    };
if (success) {
  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-green-100 flex items-center justify-center p-6">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
          y: 40,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          relative
          overflow-hidden
          bg-white
          rounded-4xl
          shadow-[0_20px_80px_rgba(0,0,0,0.08)]
          border
          border-green-100
          p-10
          w-full
          max-w-xl
          text-center
        "
      >
        {/* Background Glow */}
        <div
          className="
            absolute
            inset-0
            bg-linear-to-br
            from-green-50
            via-transparent
            to-emerald-50
            pointer-events-none
          "
        />

        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
          }}
          className="
            relative
            mx-auto
            w-28
            h-28
            rounded-full
            bg-green-100
            flex
            items-center
            justify-center
          "
        >
          <CheckCircle
            size={70}
            className="text-green-600"
          />
        </motion.div>

        {/* Heading */}
        <h1 className="mt-8 text-4xl font-bold text-gray-900">
          Upload Successful 🎉
        </h1>

        <p className="mt-4 text-gray-500 text-lg leading-relaxed">
          Your documents have been uploaded securely
          and are now being processed.
        </p>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div
            className="
              bg-slate-50
              rounded-2xl
              p-5
              border
            "
          >
            <p className="text-sm text-gray-500">
              Total Files
            </p>

            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {files.length}
            </h3>
          </div>

          <div
            className="
              bg-slate-50
              rounded-2xl
              p-5
              border
            "
          >
            <p className="text-sm text-gray-500">
              Status
            </p>

            <h3 className="text-xl font-bold text-green-600 mt-2">
              Completed
            </h3>
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            mt-8
            rounded-2xl
            bg-green-50
            border
            border-green-100
            p-4
          "
        >
          <p className="text-sm text-green-700">
            ✓ Files received successfully.
            You may safely close this page.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-6">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
      w-full
      max-w-5xl
      bg-white
      rounded-4xl
      shadow-2xl
      overflow-hidden
      grid
      lg:grid-cols-2
    "
      >
        {/* Left Side */}

        <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-10 text-white flex flex-col justify-center">
          <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center mb-6">
            <CloudUpload size={32} />
          </div>

          <h1 className="text-4xl font-bold">
            Secure Document Upload
          </h1>

          <p className="mt-4 text-blue-100">
            Upload your documents securely.
            Your files are encrypted and stored safely.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} />
              <span>Secure Upload</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle size={20} />
              <span>Fast Processing</span>
            </div>

            <div className="flex items-center gap-3">
              <FileText size={20} />
              <span>Multiple File Support</span>
            </div>
          </div>
        </div>

        {/* Right Side */}

        <div className="p-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Upload Documents
          </h2>

          <p className="text-gray-500 mt-2">
            Fill your details and upload files.
          </p>

          {/* Name */}

          <div className="mt-8">
            <label className="block text-sm font-medium mb-2">
              Customer Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={customerName}
              onChange={(e) =>
                setCustomerName(
                  e.target.value
                )
              }
              className="
            w-full
            h-14
            px-4
            rounded-2xl
            border
            border-gray-200
            focus:ring-2
            focus:ring-blue-500
            outline-none
          "
            />
          </div>

          {/* Upload Zone */}

          <div
            {...getRootProps()}
            className="
          mt-6
          border-2
          border-dashed
          border-blue-300
          rounded-3xl
          p-10
          text-center
          cursor-pointer
          hover:border-blue-500
          hover:bg-blue-50/50
          transition-all
        "
          >
            <input
              {...getInputProps()}
            />

            <Upload
              size={55}
              className="mx-auto text-blue-600"
            />

            <h3 className="font-semibold text-lg mt-4">
              Drag & Drop Files
            </h3>

            <p className="text-gray-500 mt-2">
              or click to browse your device
            </p>
          </div>

          {/* Selected Files */}

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">
                Selected Files
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map(
                  (file, index) => (
                    <div
                      key={index}
                      className="
                    flex
                    items-center
                    justify-between
                    bg-gray-50
                    border
                    rounded-2xl
                    px-4
                    py-3
                  "
                    >
                      <div className="flex items-center gap-3">
                        <FileText
                          size={18}
                          className="text-blue-600"
                        />

                        <span className="text-sm truncate">
                          {file.name}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          setFiles(
                            files.filter(
                              (
                                _,
                                i
                              ) =>
                                i !==
                                index
                            )
                          );
                        }}
                      >
                        <X
                          size={16}
                          className="text-gray-400 hover:text-red-500"
                        />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Progress */}

          {uploading && (
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">
                  Uploading...
                </span>

                <span className="text-sm font-semibold">
                  {progress}%
                </span>
              </div>

              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${progress}%`,
                  }}
                  className="
                h-full
                bg-linear-to-r
                from-blue-500
                to-indigo-600
              "
                />
              </div>
            </div>
          )}

          {/* Upload Button */}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="
          mt-8
          w-full
          h-14
          rounded-2xl
          bg-linear-to-r
          from-blue-600
          to-indigo-600
          text-white
          font-semibold
          hover:shadow-lg
          disabled:opacity-70
          transition-all
        "
          >
            {uploading
              ? "Uploading..."
              : `Upload ${files.length > 0
                ? `(${files.length}) Files`
                : "Files"
              }`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}