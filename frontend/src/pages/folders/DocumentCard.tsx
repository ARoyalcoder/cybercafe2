import { memo, useMemo } from "react";
import {
  Calendar,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  FileArchive,
} from "lucide-react";

interface FileItem {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  createdAt?: string;
}

interface DocumentCardProps {
  file: FileItem;
  onPreview: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
}

function DocumentCard({
  file,
  onPreview,
  onDownload,
}: DocumentCardProps) {
  const formattedDate = useMemo(() => {
    if (!file.createdAt) return "Recently uploaded";

    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    ).format(
      new Date(file.createdAt)
    );
  }, [file.createdAt]);

  const shortId = useMemo(
    () => file._id.slice(-8),
    [file._id]
  );

  const FileIcon = useMemo(() => {
    if (
      file.fileType?.startsWith(
        "image"
      )
    )
      return ImageIcon;

    if (
      file.fileType?.includes(
        "sheet"
      ) ||
      file.fileName.endsWith(
        ".xlsx"
      )
    )
      return FileSpreadsheet;

    if (
      file.fileType?.includes(
        "zip"
      )
    )
      return FileArchive;

    return FileText;
  }, [file.fileType, file.fileName]);

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-200
        hover:shadow-xl
      "
    >
      {/* Preview Section */}

      <div
        className="
          relative
          flex
          h-44
          items-center
          justify-center
          bg-linear-to-br
          from-slate-50
          via-blue-50
          to-indigo-100
        "
      >
        <FileIcon
          size={64}
          className="
            text-blue-600
            transition-transform
            duration-300
            group-hover:scale-110
          "
        />

        <div
          className="
            absolute
            right-3
            top-3
            rounded-full
            bg-white/80
            px-3
            py-1
            text-xs
            font-medium
            text-slate-600
            backdrop-blur
          "
        >
          Document
        </div>
      </div>

      {/* Content */}

      <div className="p-5">
        <h3
          title={file.fileName}
          className="
            truncate
            text-base
            font-semibold
            text-slate-900
          "
        >
          {file.fileName}
        </h3>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              ID #{shortId}
            </span>
          </div>
        </div>

        {/* Actions */}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              onPreview(file)
            }
            aria-label={`Preview ${file.fileName}`}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-300
            "
          >
            <Eye size={16} />
            Preview
          </button>

          <button
            type="button"
            onClick={() =>
              onDownload(file)
            }
            aria-label={`Download ${file.fileName}`}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-emerald-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-emerald-700
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-300
            "
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(DocumentCard);