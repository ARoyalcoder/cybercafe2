import {
  CloudUpload,
  ShieldCheck,
  CheckCircle,
  FileText,
} from "lucide-react";

export default function UploadHero() {
  return (
    <div
      className="
        bg-gradient-to-br
        from-violet-600
        via-blue-600
        to-cyan-500
        p-10
        text-white
        flex
        flex-col
        justify-center
        relative
        overflow-hidden
      "
    >
      {/* Glow */}

      <div
        className="
          absolute
          top-0
          right-0
          w-64
          h-64
          rounded-full
          bg-white/10
          blur-3xl
        "
      />

      <div className="relative z-10">
        <div
          className="
            w-16
            h-16
            rounded-3xl
            bg-white/20
            flex
            items-center
            justify-center
            mb-6
            backdrop-blur-xl
          "
        >
          <CloudUpload size={32} />
        </div>

        <h1 className="text-4xl font-bold">
          Secure Document Upload
        </h1>

        <p className="mt-4 text-blue-100 leading-relaxed">
          Upload your documents securely.
          Your files are encrypted and
          stored safely inside DocFlow.
        </p>

        <div className="mt-10 space-y-5">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} />
            <span>Bank Level Security</span>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle size={20} />
            <span>Instant Processing</span>
          </div>

          <div className="flex items-center gap-3">
            <FileText size={20} />
            <span>Multiple File Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}