import { memo, useMemo } from "react";
import {
  Calendar,
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
      border-white/10
      bg-white/5
      backdrop-blur-xl
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-violet-500/30
      hover:bg-white/10
      hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]
    "
    >
      {/* Preview Area */}

      
      <div
        className="
    relative
    flex
    h-48
    items-center
    justify-center
    bg-linear-to-br
    from-violet-500/10
    via-blue-500/10
    to-cyan-500/10
  "
      >
        <FileIcon
          size={70}
          className="
      text-violet-400
      transition-all
      duration-300
      group-hover:scale-110
      group-hover:rotate-3
    "
        />

        {/* File Type Badge */}

        <div
          className="
      absolute
      top-3
      right-3
      rounded-full
      border
      border-white/10
      bg-black/30
      backdrop-blur-xl
      px-3
      py-1
      text-xs
      font-medium
      text-slate-300
    "
        >
          {file.fileType?.startsWith("image")
            ? "Image"
            : file.fileName.endsWith(".pdf")
              ? "PDF"
              : "Document"}
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
      text-white
    "
        >
          {file.fileName}
        </h3>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center justify-between">
             

            <span
              className="
          rounded-full
          border
          border-emerald-500/20
          bg-emerald-500/10
          px-2.5
          py-1
          text-xs
          font-medium
          text-emerald-400
        "
            >
              Active
            </span>
          </div>
        </div>

        {/* Actions */}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onPreview(file)}
            className="
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-violet-600
        px-4
        py-3
        text-sm
        font-medium
        text-white
        transition-all
        hover:bg-violet-700
      "
          >
            <Eye size={16} />
            Preview
          </button>

          <button
            type="button"
            onClick={() =>
              window.open(
                file.fileUrl,
                "_blank"
              )
            }
            className="
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-white/10
        bg-white/5
        px-4
        py-3
        text-sm
        font-medium
        text-slate-300
        transition-all
        hover:bg-white/10
      "
          >
            Download
          </button>
        </div>
      </div>
      

    </article>
  );

}

export default memo(DocumentCard);