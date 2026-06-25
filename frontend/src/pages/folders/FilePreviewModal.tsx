import {
  memo,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { motion } from "framer-motion";
import {
  X,
  Download,
} from "lucide-react";

interface FileItem {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  thumbnailUrl?: string;
}

interface FilePreviewModalProps {
  file: FileItem | null;
  onClose: () => void;
}

function FilePreviewModal({
  file,
  onClose,
}: FilePreviewModalProps) {
  useEffect(() => {
    if (!file) return;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [file, onClose]);

  const isImage = useMemo(
    () =>
      file?.fileType?.startsWith(
        "image/"
      ) ?? false,
    [file]
  );

  const isPdf = useMemo(
    () =>
      file?.fileType ===
      "application/pdf" ||
      file?.fileName
        ?.toLowerCase()
        .endsWith(".pdf"),
    [file]
  );

  const previewThumbnail =
    useMemo(
      () =>
        file?.thumbnailUrl ||
        "/file-placeholder.png",
      [file]
    );

  const fileExtension =
    useMemo(() => {
      if (!file?.fileType)
        return "FILE";

      return (
        file.fileType
          .split("/")
          .pop()
          ?.toUpperCase() ||
        "FILE"
      );
    }, [file]);

  const handleDownload =
    useCallback(async () => {
      if (!file) return;

      try {
        const response =
          await fetch(
            file.fileUrl
          );

        const blob =
          await response.blob();

        const url =
          URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;
        link.download =
          file.fileName;

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );

        URL.revokeObjectURL(
          url
        );
      } catch (error) {
        console.error(
          "Download failed:",
          error
        );

        window.open(
          file.fileUrl,
          "_blank"
        );
      }
    }, [file]);

  if (!file) return null;

  return (
    <div
      className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/80
      backdrop-blur-md
      p-4
    "
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-title"
        onClick={(e) =>
          e.stopPropagation()
        }
        initial={{
          opacity: 0,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.2,
        }}
        className="
        relative
        flex
        h-[92vh]
        w-full
        max-w-7xl
        flex-col
        overflow-hidden
        rounded-4xl
        border
        border-white/10
        bg-[#0f172a]
        backdrop-blur-2xl
        shadow-[0_0_60px_rgba(139,92,246,0.15)]
      "
      >
        {/* Header */}

        <div
          className="
          flex
          items-center
          justify-between
          border-b
          border-white/10
          px-6
          py-5
        "
        >
          <div className="min-w-0">
            <h2
              id="preview-title"
              className="
              truncate
              text-lg
              font-semibold
              text-white
            "
            >
              {file.fileName}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Preview Mode
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={
                handleDownload
              }
              className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-violet-600
              px-4
              py-2.5
              text-white
              transition-all
              hover:bg-violet-700
            "
            >
              <Download
                size={16}
              />
              Download
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="
              rounded-xl
              p-2
              text-slate-400
              transition
              hover:bg-white/10
              hover:text-white
            "
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}

        <div className="flex-1 overflow-auto bg-[#020617]">
          {isImage ? (
            <div className="h-full flex items-center justify-center p-6">
              <img
                src={
                  file.fileUrl
                }
                alt={
                  file.fileName
                }
                className="
                max-h-full
                max-w-full
                rounded-2xl
                object-contain
              "
              />
            </div>
          ) : isPdf ? (
            <iframe
              src={`${file.fileUrl}#toolbar=0`}
              title={
                file.fileName
              }
              className="
              h-full
              w-full
              border-0
            "
            />
          ) : (
            <div
              className="
              flex
              h-full
              flex-col
              items-center
              justify-center
              gap-6
              p-8
              text-center
            "
            >
              <div
                className="
                relative
                h-64
                w-64
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-white/5
              "
              >
                <div
                  className="
                  absolute
                  right-3
                  top-3
                  z-10
                  rounded-full
                  border
                  border-violet-500/20
                  bg-violet-500/20
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-violet-300
                "
                >
                  {fileExtension}
                </div>

                <img
                  src={
                    previewThumbnail
                  }
                  alt={
                    file.fileName
                  }
                  onError={(e) => {
                    e.currentTarget.src =
                      "/file-placeholder.png";
                  }}
                  className="
                  h-full
                  w-full
                  object-contain
                  p-4
                "
                />
              </div>

              <div>
                <h3
                  className="
                  text-xl
                  font-semibold
                  text-white
                "
                >
                  {file.fileName}
                </h3>

                <p
                  className="
                  mt-1
                  text-sm
                  text-slate-400
                "
                >
                  {file.fileType ||
                    "Unknown File Type"}
                </p>

                <p
                  className="
                  mt-3
                  max-w-md
                  text-sm
                  text-slate-500
                "
                >
                  Preview is unavailable
                  for this file type.
                  You can still
                  download it.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default memo(
  FilePreviewModal
);