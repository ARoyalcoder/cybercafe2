interface Props {
  progress: number;
}

export default function UploadProgress({
  progress,
}: Props) {
  return (
    <div
      className="
        mt-6
        rounded-2xl
        border
        border-white/10
        bg-white/5
        p-5
      "
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-300">
          Uploading Files...
        </span>

        <span className="text-sm font-semibold text-cyan-400">
          {progress}%
        </span>
      </div>

      <div
        className="
          h-3
          overflow-hidden
          rounded-full
          bg-white/10
        "
      >
        <div
          className="
            h-full
            rounded-full
            bg-linear-to-r
            from-violet-500
            via-blue-500
            to-cyan-500
            transition-all
            duration-300
          "
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Please do not close this page while
        the upload is in progress.
      </p>
    </div>
  );
}