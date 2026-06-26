import { useRef } from "react";

import {
  UploadCloud,
  User,
} from "lucide-react";

import FileList from "./FileList";
import UploadProgress from "./UploadProgress";

interface Props {
  customerName: string;
  setCustomerName: (
    value: string
  ) => void;

  files: File[];
  setFiles: React.Dispatch<
    React.SetStateAction<File[]>
  >;

  uploading: boolean;
  progress: number;

  onUpload: () => void;
}

export default function UploadForm({
  customerName,
  setCustomerName,
  files,
  setFiles,
  uploading,
  progress,
  onUpload,
}: Props) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const handleFiles = (
    selectedFiles: FileList | null
  ) => {
    if (!selectedFiles) return;

    setFiles((prev) => [
      ...prev,
      ...Array.from(selectedFiles),
    ]);
  };

  const removeFile = (
    index: number
  ) => {
    setFiles((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  const handleDrop = (
    e: React.DragEvent
  ) => {
    e.preventDefault();

    handleFiles(
      e.dataTransfer.files
    );
  };

  return (
    <div
      className="
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        p-8
        rounded-3xl
      "
    >
      <h2 className="text-2xl font-bold text-white">
        Upload Documents
      </h2>

      <p className="text-slate-400 mt-2">
        Fill your details and upload
        required documents.
      </p>

      {/* Customer Name */}

      <div className="mt-8">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Customer Name
        </label>

        <div className="relative">
          <User
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-500
            "
          />

          <input
            type="text"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            placeholder="Enter your name"
            className="
              w-full
              h-12
              pl-11
              pr-4
              rounded-2xl
              bg-white/5
              border
              border-white/10
              text-white
              placeholder:text-slate-500
              focus:outline-none
              focus:border-violet-500/30
            "
          />
        </div>
      </div>

      {/* Upload Area */}

      <div
        onDragOver={(e) =>
          e.preventDefault()
        }
        onDrop={handleDrop}
        onClick={() =>
          fileInputRef.current?.click()
        }
        className="
          mt-6
          cursor-pointer
          rounded-3xl
          border-2
          border-dashed
          border-white/10
          bg-white/5
          p-10
          text-center
          transition
          hover:border-violet-500/30
          hover:bg-white/10
        "
      >
        <UploadCloud
          size={50}
          className="
            mx-auto
            text-violet-400
          "
        />

        <h3 className="mt-4 text-lg font-semibold text-white">
          Drag & Drop Files
        </h3>

        <p className="mt-2 text-slate-400">
          or click to browse files
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={(e) =>
            handleFiles(
              e.target.files
            )
          }
        />
      </div>

      {/* Selected Files */}

      <FileList
        files={files}
        onRemove={removeFile}
      />

      {/* Upload Progress */}

      {uploading && (
        <UploadProgress
          progress={progress}
        />
      )}

      {/* Upload Button */}

      <button
        onClick={onUpload}
        disabled={
          uploading ||
          !customerName ||
          files.length === 0
        }
        className="
          mt-8
          w-full
          rounded-2xl
          bg-linear-to-r
          from-violet-600
          to-blue-600
          py-4
          font-semibold
          text-white
          transition
          hover:opacity-90
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {uploading
          ? "Uploading..."
          : "Upload Documents"}
      </button>
    </div>
  );
}