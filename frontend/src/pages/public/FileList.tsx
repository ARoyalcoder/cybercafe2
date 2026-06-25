import {
  FileText,
  Image,
  X,
} from "lucide-react";

interface Props {
  files: File[];
  onRemove: (
    index: number
  ) => void;
}

export default function FileList({
  files,
  onRemove,
}: Props) {
  if (files.length === 0)
    return null;

  return (
    <div className="mt-6">
      <h3 className="mb-4 text-sm font-semibold text-slate-300">
        Selected Files
      </h3>

      <div
        className="
    max-h-80
    overflow-y-auto
    space-y-3
    pr-2

    scrollbar-thin
    scrollbar-thumb-slate-600
    scrollbar-track-transparent
  "
      >        {files.map(
        (
          file,
          index
        ) => {
          const isImage =
            file.type.startsWith(
              "image"
            );

          return (
            <div
              key={`${file.name}-${index}`}
              className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-4
                "
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-white/5
                    "
                >
                  {isImage ? (
                    <Image
                      size={18}
                      className="text-cyan-400"
                    />
                  ) : (
                    <FileText
                      size={18}
                      className="text-violet-400"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <p
                    className="
                        truncate
                        text-sm
                        font-medium
                        text-white
                      "
                  >
                    {file.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {(
                      file.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onRemove(index)
                }
                className="
                    rounded-xl
                    p-2
                    text-slate-400
                    transition
                    hover:bg-red-500/10
                    hover:text-red-400
                  "
              >
                <X size={16} />
              </button>
            </div>
          );
        }
      )}
      </div>
    </div>
  );
}